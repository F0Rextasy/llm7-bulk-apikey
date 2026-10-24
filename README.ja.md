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

**自動生成された API キーで LLM7 アカウントを一括作成 — OpenAI 互換の推論、キー不要の無料セット、+ 9Router コネクタ。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-68%20served-412991?style=for-the-badge)](https://llm7.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 クイックスタート](#-quick-start) · [🎁 無料枠](#-free-tier--how-much-you-get) · [🤖 モデル](#-models--all-68-of-them) · [🧪 API の使い方](#-how-to-use-the-api) · [✅ 検証済み](#-verified-working--every-key-is-tested) · [🧭 仕組み](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ オプション](#️-cli-options) · [🛰️ プロキシ](#️-behind-a-proxy) · [🐞 イシュー](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ これが存在する理由

LLM7 (`llm7.io`) は **`https://api.llm7.io/v1`** にある OpenAI 互換ゲートウェイで、68 個のモデル ID を掲載しています。これを一括ツールにする価値がある理由は 2 つあります。**無料セットは実際にチャットで検証済み**（単に掲載されているだけではない）であり、*同じ*無料 ID が**キー不要のポータル**からも応答する — 同一のエンドポイントが **`Authorization` ヘッダーを一切付けずに**コンテンツを返すのです。アカウント + キーの経路は、キーを必要とする ID と制限のために存在するので、スケールする単位は**キーごとに 1 アカウント**、まさに `--count N` が生成するものです。

## 🎁 無料枠 — どれだけ得られるか

| 項目 | 値 |
| --- | --- |
| サインアップ | メールアドレス → 6 桁コード → ダッシュボードセッション → キー |
| カード要否 | **不要** |
| 無料セット（ライブ検証済み、キーあり） | `codestral-latest`、`gpt-oss:20b` |
| キー不要ポータル | **同じ無料セットが API キーなしで応答** — `--keyless-check` を参照 |
| カタログ | `GET https://api.llm7.io/v1/models` に 68 個のモデル ID |
| スケールする単位 | **1 アカウント = 1 キー** → `--count N` は実質「N 個の無料アカウント」 |

> 💡 無料枠は LLM7 が設定するもので、変更される可能性があります。最新の数値は [llm7.io](https://llm7.io) で確認してください — そしてツール自身のゲートに判断させましょう:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 モデル — 68 個すべて

`GET https://api.llm7.io/v1/models` は **68 個の ID** を掲載しています。実際のチャット呼び出しで検証された無料セット（2026-10-23）:

| モデル ID | 検証済み |
| --- | --- |
| `codestral-latest` | 出口プール経由で **200** — デフォルトのゲートモデル、`keys.txt` のゲートログに記載 |
| `gpt-oss:20b` | **200** — 同じエンドポイント、同じキー |
| 残りのカタログ | 同じ `GET /models` フィード、キー/プランごとに提供 |

> ⚠️ 同じ 2 つの ID が、`https://api.llm7.io/v1/chat/completions` への単純なリクエストから**キーなし**（`Authorization` ヘッダーなし）で応答しました — 2026-10-23 にライブ検証済み。ここに表示される数は*カタログのサイズ*であり、キーごとの約束では決してありません。

## 🧪 API の使い方

ベース URL **`https://api.llm7.io/v1`** — OpenAI 互換。

```bash
curl https://api.llm7.io/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"codestral-latest","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

レスポンスはプレーンな JSON **または** SSE ストリーム（`text/event-stream`、`data: {...}` 行）として届きます — `stream` が設定されていなくても同様です。このツールのリーダーは両方を受け付けますし、あなたのも受け付けるべきです。

## 🛠 クイックスタート

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

`keys.txt` は、実際のチャット補完がキーを証明した**後にのみ**書き込まれます。無料セットはいつでも `node src/cli.js --keyless-check` で確認できます。

### 🖱️ ランチャー

ランチャーはプロキシリスト、カウント、検証モデルを尋ね、それらを `launcher.config.json` に記憶し、適切なフラグで CLI を実行します — キー不要チェック、出口画面、9Router コネクタも備えています。

## ✅ 動作検証済み — すべてのキーがテストされています

| チェック | 結果 |
| --- | --- |
| `GET https://api.llm7.io/v1/models` | **200** — 68 個の ID |
| `POST /v1/chat/completions` — `codestral-latest`、キーあり | 出口プール経由で実際のコンテンツとともに **200** |
| `POST /v1/chat/completions` — `gpt-oss:20b`、キーなし | `Authorization` ヘッダーなしで実際のコンテンツとともに **200** |
| `POST /v1/chat/completions` — 書き込まれる前のすべてのキー | 実際のコンテンツとともに **200** |
| チャットチェックに失敗したキー | `keys.txt` には決して書き込まれない — アカウントは `accounts.json` に残る |

ここの `keys.txt` には **3 個のキー**が含まれており、3 個すべてが 2026-10-23 に出口プール経由でライブゲート（キーごとに `chat-200` × 2、加えてツール呼び出し `get_time` の健全性チェック）を通過しました。

> **スケールの障害（2026-10-23 測定 — 新しいキーを期待する前にこれを読んでください）。** LLM7 自身のメール検証サービスは現在、このラボが到達できる出口に対して **`403 ip_banned`**（`request-code-403-ip_banned`）または **`verify-403`** を返すため、*推論*経路は健全であるにもかかわらず、*生成*経路はコードのステップで失敗します。これはプロバイダー側の IP ポリシーであり、このツールのバグではありません — CLI はキーをでっち上げるのではなく、正確な 403 を報告します。いつでも再確認できます:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

> **品質ゲート。** ここにあるすべてのキーは、`keys.txt` に書き込まれる前にライブの `chat-200` を通過しています
> （死んだキーは決して出荷されません）。ルーターのコンボもモデルレベルで同じルールに従います: エントリは
> **モデルが `chat-200` で応答し、ツールを呼び出せる場合にのみ**追加されます — ツールサポートのないモデル、
> 死んだキー、死んだプロバイダーは追加されるのではなく削除されます。検証ステップはいつでも再実行できます;
> 失敗は報告され、決して隠されません。

## 🧭 仕組み

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: LLM7 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.llm7.io/v1/chat/completions → real content = the key is live
```

| ステップ | 呼び出し | 備考 |
| --- | --- | --- |
| メールボックス | Emailnator `POST /api/generate-email` | アカウントごとに新しい gmail アドレス（ベンダー化されたヘルパー） |
| 適格性 | `POST {AUTH}/auth/email/eligibility {email}` | `AUTH=https://api-token.llm7.io`; `next=email_verification` を返す必要がある |
| コード | `POST {EV}/v1/email-verifications {email}` | `EV=https://api.llm7.io`; `verification_id` を返す; 禁止された出口はここで `403 ip_banned` を返す |
| メール | 同じ受信箱から 6 桁コードを読む | 無応答時に一度再要求 |
| 検証 | `POST {EV}/v1/email-verifications/verify {verification_id,code}` | 不透明な `receipt` を返す |
| セッション | `POST {AUTH}/auth/email {receipt}` | ダッシュボードは `receipt` の**文字列**のみを送信する — verify オブジェクト全体は拒否される |
| キー | `POST {AUTH}/tokens`（Bearer `auth_token`） | プレーンテキストのキーが一度だけ返される |
| ゲート | `POST https://api.llm7.io/v1/chat/completions` | `keys.txt` の前に、コンテンツを伴うライブ 200 が必要 |

## ⚙️ CLI オプション

```bash
node src/cli.js --count N        # mint N keys (stop on the first failed chat gate)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --keyless-check  # prove the keyless free set (no Authorization header)
node src/cli.js --screen         # test your exit pool against api.llm7.io
node src/cli.js --help
```

| フラグ | 意味 |
| --- | --- |
| `--count N` | 生成するアカウント（= キー）の数 `[1]` |
| `--model <id>` | ライブゲートに使用するモデル `[codestral-latest]` |
| `--pool <file>` | プロキシリスト、1 行に 1 出口 `[proxies.txt]` |
| `--verify-only` | `keys.txt` のすべてのキーをチャットゲートで再実行 |
| `--keyless-check` | キー不要の無料セットを証明 |
| `--screen` | プールを `api.llm7.io` に対してスクリーニング |
| `--exits N` | 諦める前にステップごとに試す出口数 `[6]` |
| `--timeout MS` | リクエストごとのタイムアウト `[45000]` |

| 環境変数 | デフォルト | 意味 |
| --- | --- | --- |
| `LLM7_PROXIES` | `proxies.txt` | 出口プール、1 行に 1 プロキシ — 任意: プールなしの場合 CLI は直接接続 |
| `LLM7_MODEL` | `codestral-latest` | ライブ検証に使用するモデル |
| `LLM7_AUTH_BASE` | `https://api-token.llm7.io` | ダッシュボード認証ベース |
| `LLM7_EV_BASE` | `https://api.llm7.io` | メール検証ベース |
| `LLM7_API_BASE` | `https://api.llm7.io/v1` | 推論ベース |

## 🛰️ プロキシの背後で

**任意 — そしてここで相互確認されます。LLM7 はどこからサインアップするかに厳格だからです。** このツールはプロキシなしでも動作します。

- **プールあり:** `--pool <file>` を渡す（または `LLM7_PROXIES` を設定する）と、すべてのリクエストがそのリストの出口を経由します; 死んだ回線はその試行を失敗させ、CLI は次の出口で再試行します。
- **プールなし:** CLI は `running WITHOUT a proxy (direct)` と表示し、直接接続します。推論、キー不要チェック、ゲートは変わりません — パケットが出ていく出口だけが異なります。
- **知っておくべき 403 の注意点:** LLM7 のメール検証サービスは**IP ごとのポリシー**を適用し、多くのデータセンター/無料出口に対して `403 ip_banned` を返します（認可されたプール全体で 2026-10-23 に測定）。`--screen` で*グリーン*（エンドポイントに到達可能）と判定されたプールでも、**サインアップは禁止**されている可能性があります。レジデンシャル系の出口を使用し、拒否されたときは生成ステップが正確なコードを伝えることを想定してください。

## 📄 ファイル

| パス | 内容 |
| --- | --- |
| `keys.txt` | 1 行に 1 つのライブ検証済みキー — git で無視 |
| `accounts.json` | アカウントごとの email / sub / マスクされたキー / ゲートステータス — git で無視 |
| `proxies.txt` | あなたの出口、1 行に 1 つ — git で無視 |
| `src/vendor/` | ベンダー化されたプロキシトンネリング + Emailnator 受信箱ヘルパー（外部依存なし） |

## 🔌 9Router に接続

[9Router](https://9router.com) はセルフホスト型の OpenAI 互換ルーターです。このプロバイダーを一度登録すれば、すべてのキーが 1 つのプロバイダーノード配下の接続になります:

```bash
node src/connect-9router.js
```

デフォルト: `--base http://localhost:20128`、`--password 123456`、`--name "LLM7"`、`--prefix llm7`、`--base-url https://api.llm7.io/v1`。モデルは `llm7/<model id>` として提供され、すべてのキー間で負荷分散されます。

## 🔌 OmniRoute に接続

[OmniRoute](https://omniroute.online) はセルフホスト型の OpenAI 互換ルーターです。このプロバイダーを一度登録すれば、すべてのキーが 1 つのプロバイダーノード配下の接続になります:

```bash
node src/connect-omniroute.js
```

デフォルト: `--base http://localhost:20128`、`--password 123456`、`--name "LLM7"`、`--prefix llm7`、`--base-url https://api.llm7.io/v1`。モデルは `llm7/<model id>` として提供され、すべてのキー間で負荷分散されます。

## 🔑 1 つのキーで得られるもの

| | |
| --- | --- |
| 🏢 プロバイダー | **LLM7** — [llm7.io](https://llm7.io) |
| 🎁 プロバイダーが提供するもの | キーごとに 1 アカウント — 無料セットはチャット検証済みで、キーなしでも応答する |
| 🔑 1 つのキーで得られるもの | 自身のアカウントにスコープされた 1 つの API キー: 下記エンドポイントの 68 個のモデル ID を、あなたのプランの制限で。クォータは**アカウント**に紐づくので、このツールがキーごとに 1 アカウントを作成するのはまさにそのため |
| 🌐 API の形 | OpenAI 互換: `POST https://api.llm7.io/v1/chat/completions` |
| 🔒 あなたのデータ | 接触するのは llm7.io と、あなたが設定した受信箱バックエンドのみ; キーはあなたのマシンに留まる |

## 🐞 イシュー

LLM7 がサインアップの形、メール検証エンドポイント、または IP ポリシーを変更した場合、ツールはそのステップで停止し、正確なステータス（**例: `request-code-403-ip_banned`**）を表示します。実行したコマンドと正確な出力を添えて**[イシューを開いてください](../../issues)**; PR も歓迎します。

## 📄 ライセンス

MIT © 2026 — [LICENSE](LICENSE) を参照。

<div align="center">

**[MIT](LICENSE)** © 2026 llm7-bulk-apikey contributors

</div>