<div align="center">

```
██╗     ██╗     ███╗   ███╗███████╗
██║     ██║     ████╗ ████║╚════██║
██║     ██║     ██╔████╔██║    ██╔╝
██║     ██║     ██║╚██╔╝██║   ██╔╝
███████╗███████╗██║ ╚═╝ ██║   ██║
╚══════╝╚══════╝╚═╝     ╚═╝   ╚═╝
```

# llm7-bulk-apikey

**Bulk-create LLM7 accounts with auto-generated API keys — OpenAI-compatible inference, a keyless free set, + 9Router connector.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-68%20served-412991?style=for-the-badge)](https://llm7.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Quick start](#-quick-start) · [🎁 Free tier](#-free-tier--how-much-you-get) · [🤖 Models](#-models--all-68-of-them) · [🧪 Use the API](#-how-to-use-the-api) · [✅ Verified](#-verified-working--every-key-is-tested) · [🧭 How it works](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Issues](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Why this exists

LLM7 (`llm7.io`) is an OpenAI-compatible gateway at **`https://api.llm7.io/v1`** that lists 68 model ids. Two things make it worth a bulk tool: the **free set is chat-verified live** (not just listed), and the *same* free ids also answer from a **keyless portal** — the identical endpoint returns content with **no `Authorization` header at all**. The account + key path exists for the ids and limits that need one, so the unit that scales is **one account per key**, exactly what `--count N` mints.

## 🎁 Free tier — how much you get

| What | Value |
| --- | --- |
| Sign-up | e-mail address → 6-digit code → dashboard session → key |
| Card required | **No** |
| Free set (verified live, keyed) | `codestral-latest`, `gpt-oss:20b` |
| Keyless portal | the **same free set answers with no API key** — see `--keyless-check` |
| Catalogue | 68 model ids on `GET https://api.llm7.io/v1/models` |
| The unit that scales | **one account = one key** → `--count N` is really "N free accounts" |

> 💡 The free tier is set by LLM7 and can change. Check the live numbers at [llm7.io](https://llm7.io) — and let the tool's own gate decide:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Models — all 68 of them

`GET https://api.llm7.io/v1/models` lists **68 ids**. The free set verified with a real chat call (2026-10-23):

| Model ID | Verified |
| --- | --- |
| `codestral-latest` | **200** through the exit pool — the default gate model, in `keys.txt`'s gate log |
| `gpt-oss:20b` | **200** — same endpoint, same key |
| the remaining catalogue | same `GET /models` feed, served per key/plan |

> ⚠️ The same two ids answered **keyless** (no `Authorization` header) from a plain request to `https://api.llm7.io/v1/chat/completions` — verified live on 2026-10-23. A count printed here is a *catalogue size*, never a per-key promise.

## 🧪 How to use the API

Base URL **`https://api.llm7.io/v1`** — OpenAI-compatible.

```bash
curl https://api.llm7.io/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"codestral-latest","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Responses arrive as plain JSON **or** as an SSE stream (`text/event-stream`, `data: {...}` lines) even when `stream` is not set — this tool's reader accepts both, and yours should too.

## 🛠 Quick start

```bash
# clone or fork this repository, then:
cd llm7-bulk-apikey

# 1) your proxy list, one exit per line (optional — without it the tool runs direct)
printf 'http://host:port\n' > proxies.txt

# 2) go
node src/launcher.js        # interactive
# or directly:
node src/cli.js --count 3
```

`keys.txt` is written **only** after a live chat completion proves the key. Check the free set at any time with `node src/cli.js --keyless-check`.

### 🖱️ The launcher

The launcher asks for the proxy list, count and verification model, remembers them in `launcher.config.json`, and runs the CLI with the right flags — it also carries the keyless check, the exit screen and the 9Router connector.

## ✅ Verified working — every key is tested

| Check | Result |
| --- | --- |
| `GET https://api.llm7.io/v1/models` | **200** — 68 ids |
| `POST /v1/chat/completions` — `codestral-latest`, keyed | **200** with real content, through the exit pool |
| `POST /v1/chat/completions` — `gpt-oss:20b`, keyless | **200** with real content, no `Authorization` header |
| `POST /v1/chat/completions` — every key before it is written | **200** with real content |
| a key that fails its chat check | never written to `keys.txt` — the account stays in `accounts.json` |

Every key shipped here passed the same live gate before it was written (`chat-200` × 2 per key, plus a tool-call `get_time` sanity check) through the exit pool on 2026-10-23.

> **Scale blocker (measured 2026-10-23 — read this before expecting new keys).** LLM7's own e-mail-verification service currently answers **`403 ip_banned`** (`request-code-403-ip_banned`) or **`verify-403`** for the exits this lab can reach, so the *mint* path fails at the code step even though the *inference* path is healthy. That is a provider-side IP policy, not a bug in this tool — the CLI reports the exact 403 instead of inventing a key. Re-check at any time:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

> **Quality gates.** Every key here passed a live `chat-200` before it was written to `keys.txt`
> (dead keys are never shipped). Router combos follow the same rule at the model level: an entry is
> added **only if the model answers `chat-200` and can call tools** — a model without tool support,
> a dead key or a dead provider is dropped instead of added. Re-run the verify step any time;
> failures are reported, never hidden.

## 🧭 How it works

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: LLM7 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.llm7.io/v1/chat/completions → real content = the key is live
```

| Step | Call | Notes |
| --- | --- | --- |
| mailbox | Emailnator `POST /api/generate-email` | a fresh gmail address per account (vendored helper) |
| eligibility | `POST {AUTH}/auth/email/eligibility {email}` | `AUTH=https://api-token.llm7.io`; must answer `next=email_verification` |
| code | `POST {EV}/v1/email-verifications {email}` | `EV=https://api.llm7.io`; returns `verification_id`; banned exits answer `403 ip_banned` here |
| mail | read the 6-digit code from the same inbox | re-requested once on silence |
| verify | `POST {EV}/v1/email-verifications/verify {verification_id,code}` | returns the opaque `receipt` |
| session | `POST {AUTH}/auth/email {receipt}` | the dashboard posts only the `receipt` **string** — the whole verify object is refused |
| key | `POST {AUTH}/tokens` (Bearer `auth_token`) | plaintext key returned once |
| gate | `POST https://api.llm7.io/v1/chat/completions` | live 200 with content required before `keys.txt` |

## ⚙️ CLI options

```bash
node src/cli.js --count N        # mint N keys (stop on the first failed chat gate)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --keyless-check  # prove the keyless free set (no Authorization header)
node src/cli.js --screen         # test your exit pool against api.llm7.io
node src/cli.js --help
```

| Flag | Meaning |
| --- | --- |
| `--count N` | accounts (= keys) to mint `[1]` |
| `--model <id>` | model used for the live gate `[codestral-latest]` |
| `--pool <file>` | proxy list, one exit per line `[proxies.txt]` |
| `--verify-only` | re-run every key in `keys.txt` through the chat gate |
| `--keyless-check` | proves the keyless free set |
| `--screen` | screens the pool against `api.llm7.io` |
| `--tries N` | exits tried per step before giving up `[4]` |
| `--timeout MS` | per-request timeout `[45000]` |

| Environment variable | Default | Meaning |
| --- | --- | --- |
| `LLM7_PROXIES` | `proxies.txt` | exit pool, one line per proxy — optional: without a pool the CLI connects directly |
| `LLM7_MODEL` | `codestral-latest` | model for the live verification |
| `LLM7_AUTH_BASE` | `https://api-token.llm7.io` | dashboard auth base |
| `LLM7_EV_BASE` | `https://api.llm7.io` | e-mail-verification base |
| `LLM7_API_BASE` | `https://api.llm7.io/v1` | inference base |

## 🛰️ Behind a proxy

**Optional — and cross-checked here, because LLM7 is strict about where you sign up from.** The tool works without a proxy too.

- **With a pool:** pass `--pool <file>` (or set `LLM7_PROXIES`) and every request goes through an exit from that list; a dead line fails that attempt and the CLI retries with the next exit.
- **Without a pool:** the CLI prints `running WITHOUT a proxy (direct)` and connects directly. Inference, the keyless check and the gate are unchanged — only the exit the packets leave from.
- **The 403 caveat you must know:** LLM7's e-mail-verification service enforces a **per-IP policy** and answers `403 ip_banned` for many datacenter/free exits (measured on the whole sanctioned pool, 2026-10-23). A pool that screens *green* on `--screen` (the endpoint is reachable) can still be **banned for signup**. Use residential-style exits, and expect the mint step to tell you the exact code when it is refused.

## 📄 Files

| Path | Contents |
| --- | --- |
| `keys.txt` | one live-verified key per line — git-ignored |
| `accounts.json` | email / sub / masked key / gate status per account — git-ignored |
| `proxies.txt` | your exits, one per line — git-ignored |
| `src/vendor/` | vendored proxy tunnelling + Emailnator inbox helper (no external deps) |

## 🔌 Connect to 9Router

[9Router](https://9router.com) is a self-hosted, OpenAI-compatible router. Register this provider once and every key becomes a connection under one provider-node:

```bash
node src/connect-9router.js
```

Defaults: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Models are then served as `llm7/<model id>` and load-balanced across every key.

## 🔌 Connect to OmniRoute

[OmniRoute](https://omniroute.online) is a self-hosted, OpenAI-compatible router. Register this provider once and every key becomes a connection under one provider-node:

```bash
node src/connect-omniroute.js
```

Defaults: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Models are then served as `llm7/<model id>` and load-balanced across every key.

## 🔑 What one key gets you

| | |
| --- | --- |
| 🏢 Provider | **LLM7** — [llm7.io](https://llm7.io) |
| 🎁 What the provider gives | one account per key — the free set is chat-verified, and it also answers keylessly |
| 🔑 What one key gets you | one API key scoped to its own account: the 68 model ids on the endpoint below, at your plan's limits. The quota lives on the **account**, which is exactly why this tool creates one account per key |
| 🌐 API shape | OpenAI-compatible: `POST https://api.llm7.io/v1/chat/completions` |
| 🔒 Your data | only llm7.io and the inbox backend you configure are contacted; keys stay on your machine |

## 🐞 Issues

If LLM7 changes its signup shape, the e-mail-verification endpoints or its IP policy, the tool stops at that step and prints the exact status (**e.g. `request-code-403-ip_banned`**). **[Open an issue](../../issues)** with the command you ran and the exact output; PRs are welcome.

## 📄 License

MIT © 2026 — see [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 llm7-bulk-apikey contributors

</div>
