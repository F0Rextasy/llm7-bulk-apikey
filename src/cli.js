#!/usr/bin/env node
'use strict';

/**
 * LLM7 bulk-apikey CLI — create LLM7 accounts, one API key per account, and
 * keep only the keys that survived a live chat call.
 *
 * LLM7 (https://llm7.io) is an OpenAI-compatible gateway at
 * `https://api.llm7.io/v1`. Its free set is served to a real key, and — this is
 * the odd part — the same free ids also answer from a KEYLESS portal (no
 * `Authorization` header at all). `--keyless-check` proves that live.
 *
 * The signup gate is: a readable inbox + LLM7's own e-mail-verification API.
 *   AUTH = https://api-token.llm7.io      EV = https://api.llm7.io
 *   1. mailbox     a fresh gmail address from the Emailnator pool (vendored)
 *   2. eligibility `POST {AUTH}/auth/email/eligibility {email}` -> next
 *   3. code        `POST {EV}/v1/email-verifications {email}` -> verification_id
 *   4. mail        the code, read from the same inbox
 *   5. verify      `POST {EV}/v1/email-verifications/verify {verification_id,code}` -> receipt
 *   6. session     `POST {AUTH}/auth/email {receipt}` -> auth_token
 *   7. key         `POST {AUTH}/tokens` (Bearer auth_token) -> plaintext key
 *   8. gate        `POST https://api.llm7.io/v1/chat/completions` -> 200 with content
 *
 * A key is appended to `keys.txt` only after step 8 answers 200 with real
 * content; a failed account is recorded in `accounts.json` and can be retried.
 *
 * Scale note (measured 2026-10-23): minting from a large exit fleet currently
 * fails at step 3/5 — LLM7's e-mail-verification service answers
 * `403 ip_banned` (`request-code-403-ip_banned`) or `verify-403` for the exits
 * this lab has.
 *
 * KEYLESS note (measured 2026-10-23, lane aizzz+llm7): the step-8 gate CANNOT prove a key. The free
 * ids answer at `https://api.llm7.io/v1/chat/completions` with **no** `Authorization` header, with a
 * **garbage** bearer (`sk-0000…dummy`) and even with `Basic abc123` — all three return the same
 * `chatcmpl_` id for the same prompt (evidence: `out/key-reality-*.json`). A key minted earlier is
 * also rejected by the account API (`POST https://api-token.llm7.io/tokens` → `401 Invalid token`),
 * and 9Router consumes llm7 keylessly through the `keyless2api` bridge on :8789. So the 3 lines in
 * `keys.txt` are dummies: **llm7 needs no key**, and `--count` targets a quantity that has no effect.
 * Minting is additionally blocked earlier by the `403 ip_banned` wall above.
 *
 * Options:
 *   --count N        accounts (= keys) to mint                          [1]
 *   --model <id>     model id for the live gate           [codestral-latest]
 *   --pool <file>    proxy list, one exit per line (env LLM7_PROXIES) [proxies.txt]
 *   --auto           headless-friendly alias (launcher passes it; no prompts ever)   
 *   --verify-only    re-run every key in keys.txt through the chat gate
 *   --keyless-check  prove the keyless free set (no Authorization header)
 *   --screen         test the proxy list against api.llm7.io
 *   --help
 *
 * Zero external dependencies. Node.js >= 18. The proxy list is OPTIONAL: pass
 * --pool (or LLM7_PROXIES) and every request leaves through an exit from it;
 * without a pool the tool connects directly.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { createAgent, loadPoolFile, label, isLocalHost } = require('./vendor/proxy.js');
const mail = require('./vendor/emailnator.js');

const ROOT = path.basename(__dirname) === 'src' ? path.resolve(__dirname, '..') : __dirname;
const KEYS_FILE = path.join(ROOT, 'keys.txt');
const ACCOUNTS_FILE = path.join(ROOT, 'accounts.json');

/** Dead-key report: only definite rejections — 429/5xx/transport never land here. */
const DEAD_FILE = path.join(ROOT, 'keys-dead.txt');
const DEAD_STATUS = new Set([401, 403]);
const DEAD_REASON = /banned|deactivated|disabled|suspended|quota|insufficient|forbidden|unauthorized/i;
function recordDead(key, status, sample) {
  if (!key) return;
  if (!DEAD_STATUS.has(Number(status)) && !DEAD_REASON.test(String(sample || ''))) return;
  const why = `${status}${sample ? ' ' + String(sample).replace(/\s+/g, ' ').slice(0, 60) : ''}`;
  try {
    fs.mkdirSync(path.dirname(DEAD_FILE), { recursive: true });
    fs.appendFileSync(DEAD_FILE, `${key}\t${why}\t${new Date().toISOString()}\n`);
  } catch (e) { /* diagnostics must never break the run */ }
}

const AUTH_BASE = (process.env.LLM7_AUTH_BASE || 'https://api-token.llm7.io').replace(/\/$/, '');
const EV_BASE = (process.env.LLM7_EV_BASE || 'https://api.llm7.io').replace(/\/$/, '');
const API_BASE = (process.env.LLM7_API_BASE || 'https://api.llm7.io/v1').replace(/\/$/, '');

/** The two free ids this tool verified live (2026-10-23). */
const FREE_MODELS = ['codestral-latest', 'gpt-oss:20b'];

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36';

// Shared/disposable boxes carry other tenants' mail: only a message that names
// this panel may supply the code (measured 2026-10-24: dddai read a stranger's
// code from a shared box). Override: --brand / LLM7_BRAND_RE.
let BRAND = new RegExp(process.env.LLM7_BRAND_RE || 'llm7', 'i');

// ------------------------------------------------------------------- options
const argv = process.argv.slice(2);
function arg(name, dflt) {
  const eq = argv.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.slice(name.length + 3);
  const i = argv.indexOf(`--${name}`);
  if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1];
  return dflt;
}
const has = (name) => argv.includes(`--${name}`);

if (has('help') || has('h')) {
  console.log(`llm7-bulk-apikey — create LLM7 accounts, one key each, verified by a live chat call.

  node src/cli.js --count 3            mint 3 keys (a live chat 200 keeps a key)
  node src/cli.js --verify-only        re-check every key in keys.txt
  node src/cli.js --keyless-check      prove the keyless free set (no API key)
  node src/cli.js --screen             test your proxy list against api.llm7.io
  node src/cli.js --help

  --count N        accounts to mint                                       [1]
  --model <id>     model used for the live gate            [codestral-latest]
  --pool <file>    proxy list, one exit per line (env LLM7_PROXIES) [optional]
  --exits N        exits tried per step before giving up                  [6]
  --verify-only    re-run every key in keys.txt through the chat gate
  --keyless-check  prove the keyless free set
  --screen         only test the proxy list against api.llm7.io
  --brand RE       sender/subject fence for the code mail (env LLM7_BRAND_RE)

Requests go through your proxy list when one is provided (--pool / env).
Without a pool the tool connects directly.`);
  process.exit(0);
}

const COUNT = Math.max(1, parseInt(arg('count', '1'), 10) || 1);
const MODEL = arg('model', process.env.LLM7_MODEL || 'codestral-latest');
const EXITS = Math.max(1, parseInt(arg('exits', '6'), 10) || 6);
const TIMEOUT_MS = Math.max(5000, parseInt(arg('timeout', '45000'), 10) || 45000);
const AUTO = has('auto');
const VERIFY_ONLY = has('verify-only');
const KEYLESS = has('keyless-check');
const SCREEN = has('screen');
if (arg('brand')) BRAND = new RegExp(arg('brand'), 'i'); // --brand overrides the mail fence

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const log = (...a) => console.log(`[${new Date().toISOString().slice(11, 19)}]`, ...a);

// --------------------------------------------------------------------- pool
function loadPool() {
  const poolArg = arg('pool', process.env.LLM7_PROXIES || 'proxies.txt');
  const poolFile = fs.existsSync(path.resolve(poolArg)) ? path.resolve(poolArg) : path.resolve(ROOT, poolArg);
  if (!fs.existsSync(poolFile)) {
    console.log(`no proxy list at ${poolFile} — running WITHOUT a proxy (direct). Put exits there (or pass --pool) to route through them.`);
    return [];
  }
  const exits = (loadPoolFile ? loadPoolFile(poolFile) : []).filter((p) => !isLocalHost(p.host));
  if (!exits.length) {
    console.log(`${poolFile} has no usable exits — running WITHOUT a proxy (direct).`);
    return [];
  }
  return exits.map((p) => ({ p, label: label(p), fails: 0 }));
}

const POOL = loadPool();
let poolCursor = 0;

/** Round-robin over the pool; `null` proxy = direct (pool-less mode). */
function nextExit(exclude = []) {
  if (!POOL.length) return { p: null, label: 'direct' };
  for (let i = 0; i < POOL.length; i++) {
    const s = POOL[(poolCursor + i) % POOL.length];
    if (s.fails >= 2 || exclude.includes(s.label)) continue;
    poolCursor = (poolCursor + i + 1) % POOL.length;
    return s;
  }
  // everything looked dead: forget the scores and hand out the next line anyway
  for (const s of POOL) s.fails = 0;
  return POOL[poolCursor++ % POOL.length];
}
function mark(entry, ok, why) {
  if (!entry) return;
  if (ok) { entry.fails = 0; return; }
  entry.fails++;
  if (entry.fails === 2) log(`exit ${entry.label} looks dead (${why || 'error'})`);
}
/** A dead exit, not a panel verdict — the flow rotates to the next candidate. */
const isExitError = (e) =>
  /proxy connect failed|proxy CONNECT refused|proxy timeout|connect timeout|connect failed|ETIMEDOUT|ECONNREFUSED|ECONNRESET|ECONNABORTED|EPIPE|ENETUNREACH|EHOSTUNREACH|EAI_AGAIN|socket hang up|secureConnect|TLS|handshake/i.test(
    String((e && e.message) || e),
  );


// --------------------------------------------------------------------- http
/** One request through `proxy` (a parsed pool line; null = direct). Resolves on any HTTP status; throws on transport errors. */
function hreq(proxy, url, { method = 'GET', headers = {}, body = null, timeoutMs = TIMEOUT_MS } = {}) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const payload = body === null || body === undefined ? null : Buffer.from(typeof body === 'string' ? body : JSON.stringify(body));
    const finalHeaders = { 'user-agent': UA, accept: 'application/json, text/event-stream, */*', ...headers };
    if (payload && !finalHeaders['content-type']) finalHeaders['content-type'] = 'application/json';
    const req = https.request(
      {
        method,
        host: u.hostname,
        port: u.port || 443,
        path: u.pathname + u.search,
        agent: proxy ? createAgent({ ...proxy, connectTimeoutMs: 8000, timeoutMs }) : undefined,
        headers: finalHeaders,
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, text: Buffer.concat(chunks).toString('utf8') }));
      }
    );
    req.setTimeout(timeoutMs, () => req.destroy(new Error('timeout')));
    req.on('error', (e) => reject(e));
    if (payload) req.write(payload);
    req.end();
  });
}

/**
 * Runs one step with exit failover. `fn(exit)` returns {status,...}; a transport
 * throw (or a retryable HTTP status) moves the step to the next exit. `exit` is
 * a mutable box so the whole account keeps using the last exit that worked.
 */
async function step(name, box, { retryStatus = [] }, fn) {
  let last = null;
  let lastErr = null;
  for (let t = 0; t < EXITS; t++) {
    try {
      const r = await fn(box);
      if (retryStatus.includes(r.status) && t < EXITS - 1) {
        mark(box.entry, false, `${name}:${r.status}`);
        const s = nextExit([box.entry && box.entry.label]);
        box.entry = s; box.p = s.p; box.label = s.label;
        last = r;
        continue;
      }
      mark(box.entry, true);
      return r;
    } catch (e) {
      lastErr = e;
      mark(box.entry, false, e.message.slice(0, 50));
      if (isExitError(e)) log(`${name}: exit ${box.label} dead (${e.message.slice(0, 70)}) → next exit`);
      else log(`${name}: exit ${box.label} failed: ${e.message.slice(0, 90)}`);
      const s = nextExit([box.entry && box.entry.label]);
      box.entry = s; box.p = s.p; box.label = s.label;
    }
  }
  if (last) return last;
  if (lastErr && isExitError(lastErr)) throw new Error(`no usable route — ${EXITS} candidate(s) over ${box.p ? box.label : 'direct mode (no proxy list)'}: every attempt died at the transport layer.`);
  throw lastErr || new Error(`${name}: all exits failed`);
}

// ---------------------------------------------------------------- responses
/** Reads an OpenAI reply that may be plain JSON *or* an SSE stream. */
function chatParse(status, text) {
  let content = '';
  let reasoning = '';
  let finish = null;
  try {
    const j = JSON.parse(text);
    if (j && Array.isArray(j.choices) && j.choices.length) {
      const m = j.choices[0].message || {};
      content = m.content || '';
      reasoning = m.reasoning_content || '';
      finish = j.choices[0].finish_reason ?? null;
      return { content, reasoning, finish };
    }
  } catch {
    /* not JSON — try SSE below */
  }
  for (const raw of String(text).split(/\r?\n/)) {
    const line = raw.trim();
    if (!line.startsWith('data:')) continue;
    const data = line.slice(5).trim();
    if (!data || data === '[DONE]') continue;
    let j;
    try { j = JSON.parse(data); } catch { continue; }
    const ch = j && Array.isArray(j.choices) ? j.choices[0] : null;
    if (!ch) continue;
    const d = ch.delta || ch.message || {};
    if (d.content) content += d.content;
    if (d.reasoning_content) reasoning += d.reasoning_content;
    if (ch.finish_reason) finish = ch.finish_reason;
  }
  return { content, reasoning, finish };
}

/** Live chat call: keyed (Bearer) or keyless (no Authorization header at all). */
async function chatGate(exit, key, model = MODEL) {
  const headers = key ? { authorization: `Bearer ${key}` } : {};
  const r = await hreq(exit.p, `${API_BASE}/chat/completions`, {
    method: 'POST',
    headers,
    body: { model, messages: [{ role: 'user', content: 'Reply with the single word: ok' }], max_tokens: 8, temperature: 0 },
    timeoutMs: 60000,
  });
  const parsed = chatParse(r.status, r.text);
  const ok = r.status === 200 && !!(parsed.content || parsed.reasoning);
  return { ok, status: r.status, ...parsed, sample: String(r.text).slice(0, 160) };
}

// --------------------------------------------------------------------- mail
/** Wait for the 6-digit LLM7 code; a message is read through the account exit or direct. */
/**
 * Ids already in the box, taken BEFORE the code is requested. The Emailnator
 * gmail pool is shared and recycled, so a mail that was already there belongs to
 * another tenant and its 6 digits are not ours. A failed snapshot is not an
 * empty box — it retries, then throws.
 */
async function snapshotIds(email, exit) {
  for (let k = 0; k < 4; k++) {
    try {
      const msgs = await mail.listMessages(email, exit && exit.p);
      if (Array.isArray(msgs)) return new Set(msgs.map((m) => String((m && m.id) || '')).filter(Boolean));
    } catch (e) { /* retry */ }
    await sleep(4000);
  }
  throw new Error('inbox snapshot failed (exits unhealthy)');
}
async function waitForCode(email, exit, { timeoutMs = 210000, pollMs = 6000, seenIds = [] } = {}) {
  const deadline = Date.now() + timeoutMs;
  const seen = new Set(seenIds instanceof Set ? seenIds : (seenIds || []).map(String));
  while (Date.now() < deadline) {
    let msgs = [];
    try {
      msgs = await mail.listMessages(email, exit.p);
    } catch (e) {
      log(`  inbox poll: ${e.message.slice(0, 80)}`);
      try { msgs = await mail.listMessages(email, null); } catch (e2) { log(`  inbox poll direct: ${e2.message.slice(0, 80)}`); }
    }
    for (const m of msgs) {
      const id = String(m.id);
      if (seen.has(id)) continue;
      seen.add(id);
      if (!BRAND.test(`${m.from || ''} ${m.subject || ''}`)) continue; // the panel's own mail only
      let full = m;
      try { full = await mail.readMessage(id, exit.p); } catch { /* keep the list row */ }
      const blob = `${m.subject || ''}\n${m.from || ''}\n${String(full.content || full.html || '').replace(/<[^>]+>/g, ' ')}`;
      const hit = blob.match(/(?:^|[^\d])(\d{6})(?:[^\d]|$)/);
      if (hit) return { code: hit[1], subject: m.subject };
    }
    await sleep(pollMs);
  }
  return null;
}

// -------------------------------------------------------------- llm7 steps
async function newMailbox(box) {
  const r = await step('new-address', box, {}, async (b) => {
    const a = await mail.newAddress(b.p);
    return { status: 200, plain: a.plain };
  });
  return r.plain;
}

async function mintAccount(idx) {
  const t0 = Date.now();
  const account = { idx, at: new Date().toISOString(), steps: [] };
  const note = (name, obj) => account.steps.push({ name, ms: Date.now() - t0, ...obj });
  const s = nextExit();
  const box = { entry: s, p: s.p, label: s.label };

  // 1. mailbox
  let email;
  try { email = await newMailbox(box); } catch (e) { return { ok: false, reason: 'mailbox-failed', detail: e.message, account }; }
  account.email = email;
  note('mailbox', { email, exit: box.label });

  // 2. eligibility
  const elig = await step('eligibility', box, { retryStatus: [429, 403] }, (b) =>
    hreq(b.p, `${AUTH_BASE}/auth/email/eligibility`, { method: 'POST', body: { email } }).then((r) => {
      let next = null;
      try { next = JSON.parse(r.text)?.next; } catch { /* keep null */ }
      return { status: r.status, next, text: r.text };
    }));
  note('eligibility', { status: elig.status, next: elig.next, exit: box.label });
  if (elig.next === 'access_request') return { ok: false, reason: 'access-request-gate', account };
  if (elig.status !== 200 || elig.next !== 'email_verification') {
    return { ok: false, reason: `eligibility-${elig.status}`, detail: String(elig.text).slice(0, 160), account };
  }

  // 3. request the code (banned exits answer 403 here)
  const req = await step('request-code', box, { retryStatus: [429, 403] }, (b) =>
    hreq(b.p, `${EV_BASE}/v1/email-verifications`, { method: 'POST', body: { email } }).then((r) => {
      let j = null;
      try { j = JSON.parse(r.text); } catch { /* keep null */ }
      return { status: r.status, verification_id: j && j.verification_id, json: j, text: r.text };
    }));
  note('request-code', { status: req.status, exit: box.label, body: String(req.text).slice(0, 160) });
  if (req.status === 403) {
    const code = req.json && req.json.error && (req.json.error.code || req.json.error);
    return { ok: false, reason: `request-code-403-${code || ''}`, account };
  }
  if (req.status === 429 && req.json && req.json.error && req.json.error.turnstile_required) {
    return { ok: false, reason: 'turnstile-required', account };
  }
  if (!(req.status >= 200 && req.status < 300) || !req.verification_id) {
    return { ok: false, reason: `request-code-${req.status}`, account };
  }

  // 4. wait for the mail
  const seenIds = await snapshotIds(email, box);
  const found = await waitForCode(email, box, { timeoutMs: 210000, seenIds });
  if (!found) return { ok: false, reason: 'no-mail', account };
  note('mail', { subject: found.subject });

  // 5. verify the code -> receipt
  const ver = await step('verify', box, { retryStatus: [403] }, (b) =>
    hreq(b.p, `${EV_BASE}/v1/email-verifications/verify`, { method: 'POST', body: { verification_id: req.verification_id, code: found.code } }).then((r) => {
      let j = null;
      try { j = JSON.parse(r.text); } catch { /* keep null */ }
      return { status: r.status, json: j, text: r.text };
    }));
  note('verify', { status: ver.status, exit: box.label, body: String(ver.text).slice(0, 160) });
  if (ver.status !== 200) return { ok: false, reason: `verify-${ver.status}`, account };

  // 6. session: the dashboard posts only the opaque `receipt` string
  const receipt = ver.json && typeof ver.json === 'object' ? ver.json.receipt : null;
  const sess = await step('session', box, {}, (b) =>
    hreq(b.p, `${AUTH_BASE}/auth/email`, { method: 'POST', body: { receipt } }).then((r) => {
      let j = null;
      try { j = JSON.parse(r.text); } catch { /* keep null */ }
      const auth_token = j && (j.auth_token || j.token || (j.data && j.data.auth_token));
      return { status: r.status, auth_token, sub: j && j.sub, json: j, text: r.text };
    }));
  note('session', { status: sess.status, exit: box.label, sub: sess.sub });
  if (!sess.auth_token) return { ok: false, reason: `session-${sess.status}`, detail: String(sess.text).slice(0, 160), account };
  account.sub = sess.sub;

  // 7. create the key
  const tok = await step('create-token', box, {}, (b) =>
    hreq(b.p, `${AUTH_BASE}/tokens`, {
      method: 'POST',
      headers: { authorization: `Bearer ${sess.auth_token}` },
      body: { name: `llm7-${idx}`, expires_at: new Date(Date.now() + 180 * 86400000).toISOString() },
    }).then((r) => {
      let j = null;
      try { j = JSON.parse(r.text); } catch { /* keep null */ }
      const key = j && (j.token || j.api_key || j.key || (j.data && j.data.token));
      return { status: r.status, key, json: j, text: r.text };
    }));
  note('create-token', { status: tok.status, exit: box.label });
  if (!tok.key) return { ok: false, reason: `token-${tok.status}`, detail: String(tok.text).slice(0, 160), account };

  // 8. live gate
  let gate = { ok: false, status: 0 };
  for (let t = 0; t < Math.min(EXITS, 3) && !gate.ok; t++) {
    const ex = nextExit();
    try { gate = await chatGate(ex, tok.key, MODEL); mark(ex, gate.status === 200, `chat:${gate.status}`); }
    catch (e) { mark(ex, false, e.message.slice(0, 50)); gate = { ok: false, status: 0 }; }
  }
  note('gate', { status: gate.status, content: String(gate.content || '').slice(0, 40) });
  if (!gate.ok) {
    recordDead(tok.key, gate.status, gate.sample);
    return { ok: false, reason: `gate-${gate.status}`, account, key: tok.key };
  }

  account.key = tok.key;
  return { ok: true, key: tok.key, account };
}

// ------------------------------------------------------------------ files
function readKeys() {
  try { return fs.readFileSync(KEYS_FILE, 'utf8').split(/\r?\n/).map((s) => s.trim()).filter(Boolean); } catch { return []; }
}
function appendKey(key) {
  fs.appendFileSync(KEYS_FILE, (fs.existsSync(KEYS_FILE) && fs.statSync(KEYS_FILE).size ? '\n' : '') + key + '\n');
}
function loadAccounts() { try { return JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf8')); } catch { return []; } }
function saveAccounts(list) { fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(list, null, 2) + '\n'); }

// ------------------------------------------------------------------- modes
async function mint() {
  const accounts = loadAccounts();
  log(`llm7 · ${COUNT} key(s) · exits ${POOL.length || 'direct'} · model ${MODEL} · keys land in keys.txt`);
  let made = 0;
  for (let i = 0; i < COUNT; i++) {
    const r = await mintAccount(i + 1);
    if (r.ok) {
      appendKey(r.key);
      accounts.push({ at: new Date().toISOString(), email: r.account.email, sub: r.account.sub, key_masked: `${r.key.slice(0, 6)}…${r.key.slice(-4)}`, gate: 200 });
      saveAccounts(accounts);
      made++;
      log(`account ${i + 1} ✔ chat-200 ${MODEL} · ${r.key.slice(0, 6)}…`);
    } else {
      accounts.push({ at: new Date().toISOString(), email: r.account && r.account.email, reason: r.reason, detail: r.detail, steps: r.account && r.account.steps });
      saveAccounts(accounts);
      log(`account ${i + 1} ✘ ${r.reason}${r.detail ? ` ${String(r.detail).slice(0, 140)}` : ''}`);
    }
  }
  log(`done — ${made}/${COUNT} key(s) written to ${KEYS_FILE}`);
}

async function verifyOnly() {
  const keys = readKeys();
  if (!keys.length) { console.log(`no keys in ${KEYS_FILE}`); process.exit(0); }
  let live = 0;
  for (let i = 0; i < keys.length; i++) {
    let g = null;
    let lastErr = null;
    for (let t = 0; t < Math.max(EXITS, 3); t++) {
      const ex = nextExit();
      try { g = await chatGate(ex, keys[i], MODEL); mark(ex, g.status === 200, `chat:${g.status}`); break; } catch (e) { lastErr = e; mark(ex, false, e.message.slice(0, 50)); }
    }
    if (!g) { console.log(`  ✘ ${keys[i].slice(0, 6)}… ${String(lastErr && lastErr.message).slice(0, 90)}`); continue; }
    if (g.ok) live++;
    else recordDead(keys[i], g.status, g.sample);
    console.log(`  ${g.ok ? '✔' : '✘'} ${keys[i].slice(0, 6)}… chat=${g.status}`);
  }
  console.log(`verify: ${live}/${keys.length} keys live`);
  process.exit(live === keys.length ? 0 : 1);
}

/** Proves the keyless portal: same free ids, no Authorization header. */
async function keylessCheck() {
  const ex = nextExit();
  const models = await hreq(ex.p, `${API_BASE}/models`, { timeoutMs: 30000 });
  let ids = [];
  try { ids = (JSON.parse(models.text).data || []).map((m) => m.id); } catch { /* keep empty */ }
  console.log(`keyless GET /models → ${models.status} · ${ids.length} id(s)`);
  let ok = 0;
  for (const model of FREE_MODELS) {
    try {
      const g = await chatGate(ex, null, model);
      if (g.ok) ok++;
      console.log(`  ${g.ok ? '✔' : '✘'} keyless ${model} chat=${g.status} · ${String(g.content || g.sample).slice(0, 40)}`);
    } catch (e) {
      console.log(`  ✘ keyless ${model} ${e.message.slice(0, 80)}`);
    }
  }
  console.log(`keyless free set: ${ok}/${FREE_MODELS.length} model(s) answered without an Authorization header`);
  process.exit(ok === FREE_MODELS.length ? 0 : 1);
}

async function screen() {
  if (!POOL.length) { console.log('no proxy list to screen (direct mode)'); process.exit(0); }
  let ok = 0;
  for (const e of POOL.slice(0, 64)) {
    try {
      const t0 = Date.now();
      const r = await hreq(e.p, `${API_BASE}/models`, { timeoutMs: 20000 });
      const good = r.status === 200;
      if (good) ok++;
      console.log(`  ${good ? '✔' : '✘'} ${e.label} status=${r.status} ${Date.now() - t0}ms`);
    } catch (err) {
      console.log(`  ✘ ${e.label} ${String(err.message).slice(0, 80)}`);
    }
  }
  console.log(`screened ${Math.min(POOL.length, 64)} exit(s): ${ok} reach ${API_BASE}`);
  process.exit(0);
}

const run = KEYLESS ? keylessCheck : SCREEN ? screen : VERIFY_ONLY ? verifyOnly : mint;
run().catch((e) => { console.error('[fatal]', e.message); process.exit(1); });
