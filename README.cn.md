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

**批量创建 LLM7 账户并自动生成 API 密钥 — 兼容 OpenAI 的推理、免密钥免费套餐，以及 9Router 连接器。**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-68%20served-412991?style=for-the-badge)](https://llm7.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 快速开始](#-quick-start) · [🎁 免费套餐](#-free-tier--how-much-you-get) · [🤖 模型](#-models--all-68-of-them) · [🧪 使用 API](#-how-to-use-the-api) · [✅ 已验证](#-verified-working--every-key-is-tested) · [🧭 工作原理](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 选项](#️-cli-options) · [🛰️ 代理](#️-behind-a-proxy) · [🐞 问题](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 为什么会有这个项目

LLM7（`llm7.io`）是一个兼容 OpenAI 的网关，地址为 **`https://api.llm7.io/v1`**，列出了 68 个模型 id。有两点让它值得做一个批量工具：**免费套餐是经过实时聊天验证的**（不只是列出来而已），而且*同样的*免费 id 也能从一个**免密钥门户**得到响应 —— 同一个端点**完全不带 `Authorization` 头**也能返回内容。账户 + 密钥这条路径是为那些需要它的 id 和限制而存在的，所以可扩展的单元是**每个密钥一个账户**，这正是 `--count N` 所铸造的东西。

## 🎁 免费套餐 — 你能得到多少

| 项目 | 值 |
| --- | --- |
| 注册 | 电子邮件地址 → 6 位验证码 → 仪表盘会话 → 密钥 |
| 需要银行卡 | **否** |
| 免费套餐（实时验证，带密钥） | `codestral-latest`、`gpt-oss:20b` |
| 免密钥门户 | **同一免费套餐无需 API 密钥即可响应** —— 见 `--keyless-check` |
| 目录 | `GET https://api.llm7.io/v1/models` 上有 68 个模型 id |
| 可扩展的单元 | **一个账户 = 一个密钥** → `--count N` 实际上就是“N 个免费账户” |

> 💡 免费套餐由 LLM7 设定，可能会变化。请在 [llm7.io](https://llm7.io) 查看实时数字 —— 并让工具自身的关卡来做判断：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 模型 — 全部 68 个

`GET https://api.llm7.io/v1/models` 列出了 **68 个 id**。经真实聊天调用验证的免费套餐（2026-10-23）：

| 模型 ID | 已验证 |
| --- | --- |
| `codestral-latest` | 通过出口池返回 **200** —— 默认关卡模型，记录在 `keys.txt` 的关卡日志中 |
| `gpt-oss:20b` | **200** —— 同一端点，同一密钥 |
| 其余目录 | 同一个 `GET /models` 数据源，按密钥/套餐提供 |

> ⚠️ 同样的两个 id 从对 `https://api.llm7.io/v1/chat/completions` 的普通请求中**免密钥**（不带 `Authorization` 头）得到了响应 —— 于 2026-10-23 实时验证。这里打印的数字是*目录规模*，绝不是对每个密钥的承诺。

## 🧪 如何使用 API

基础 URL **`https://api.llm7.io/v1`** —— 兼容 OpenAI。

```bash
curl https://api.llm7.io/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"codestral-latest","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

响应以纯 JSON **或** SSE 流（`text/event-stream`、`data: {...}` 行）形式到达，即使未设置 `stream` 也是如此 —— 本工具的读取器两者都接受，你的也应该如此。

## 🛠 快速开始

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

`keys.txt` **只有**在一次实时聊天补全证明该密钥有效之后才会被写入。随时用 `node src/cli.js --keyless-check` 检查免费套餐。

### 🖱️ 启动器

启动器会询问代理列表、数量和验证模型，将它们记住在 `launcher.config.json` 中，并用正确的标志运行 CLI —— 它还带有免密钥检查、出口筛选和 9Router 连接器。

## ✅ 已验证可用 — 每个密钥都经过测试

| 检查 | 结果 |
| --- | --- |
| `GET https://api.llm7.io/v1/models` | **200** —— 68 个 id |
| `POST /v1/chat/completions` —— `codestral-latest`，带密钥 | **200**，返回真实内容，通过出口池 |
| `POST /v1/chat/completions` —— `gpt-oss:20b`，免密钥 | **200**，返回真实内容，无 `Authorization` 头 |
| `POST /v1/chat/completions` —— 每个密钥在被写入之前 | **200**，返回真实内容 |
| 未通过聊天检查的密钥 | 永远不会写入 `keys.txt` —— 账户保留在 `accounts.json` 中 |

这里的 `keys.txt` 包含 **3 个密钥**；全部 3 个都在 2026-10-23 通过了出口池的实时关卡（每个密钥 `chat-200` × 2，外加一次工具调用 `get_time` 健全性检查）。

> **规模障碍（2026-10-23 实测 —— 在期待新密钥之前请先阅读）。** LLM7 自己的电子邮件验证服务目前对本实验室能到达的出口返回 **`403 ip_banned`**（`request-code-403-ip_banned`）或 **`verify-403`**，因此*铸造*路径在验证码步骤就失败了，尽管*推理*路径是健康的。这是提供商侧的 IP 策略，不是本工具的 bug —— CLI 会报告确切的 403，而不是凭空造出一个密钥。随时可重新检查：

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

> **质量关卡。** 这里的每个密钥在被写入 `keys.txt` 之前都通过了实时 `chat-200`
> （死密钥绝不会被发布）。路由器组合在模型层面遵循同样的规则：一个条目**只有在该模型
> 能返回 `chat-200` 且能调用工具时**才会被添加 —— 不支持工具的模型、
> 死密钥或死提供商会被丢弃而不是添加。随时重新运行验证步骤；
> 失败会被报告，绝不会被隐藏。

## 🧭 工作原理

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: LLM7 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.llm7.io/v1/chat/completions → real content = the key is live
```

| 步骤 | 调用 | 备注 |
| --- | --- | --- |
| 邮箱 | Emailnator `POST /api/generate-email` | 每个账户一个全新的 gmail 地址（内置辅助程序） |
| 资格 | `POST {AUTH}/auth/email/eligibility {email}` | `AUTH=https://api-token.llm7.io`；必须返回 `next=email_verification` |
| 验证码 | `POST {EV}/v1/email-verifications {email}` | `EV=https://api.llm7.io`；返回 `verification_id`；被封禁的出口在此返回 `403 ip_banned` |
| 邮件 | 从同一收件箱读取 6 位验证码 | 无响应时重新请求一次 |
| 验证 | `POST {EV}/v1/email-verifications/verify {verification_id,code}` | 返回不透明的 `receipt` |
| 会话 | `POST {AUTH}/auth/email {receipt}` | 仪表盘只提交 `receipt` **字符串** —— 整个 verify 对象会被拒绝 |
| 密钥 | `POST {AUTH}/tokens`（Bearer `auth_token`） | 明文密钥仅返回一次 |
| 关卡 | `POST https://api.llm7.io/v1/chat/completions` | 在写入 `keys.txt` 之前必须实时返回带内容的 200 |

## ⚙️ CLI 选项

```bash
node src/cli.js --count N        # mint N keys (stop on the first failed chat gate)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --keyless-check  # prove the keyless free set (no Authorization header)
node src/cli.js --screen         # test your exit pool against api.llm7.io
node src/cli.js --help
```

| 标志 | 含义 |
| --- | --- |
| `--count N` | 要铸造的账户（= 密钥）数量 `[1]` |
| `--model <id>` | 用于实时关卡的模型 `[codestral-latest]` |
| `--pool <file>` | 代理列表，每行一个出口 `[proxies.txt]` |
| `--verify-only` | 通过聊天关卡重新运行 `keys.txt` 中的每个密钥 |
| `--keyless-check` | 验证免密钥免费套餐 |
| `--screen` | 针对 `api.llm7.io` 筛选代理池 |
| `--tries N` | 放弃前每步尝试的出口数 `[4]` |
| `--timeout MS` | 每请求超时 `[45000]` |

| 环境变量 | 默认值 | 含义 |
| --- | --- | --- |
| `LLM7_PROXIES` | `proxies.txt` | 出口池，每行一个代理 —— 可选：没有代理池时 CLI 直接连接 |
| `LLM7_MODEL` | `codestral-latest` | 用于实时验证的模型 |
| `LLM7_AUTH_BASE` | `https://api-token.llm7.io` | 仪表盘认证基础地址 |
| `LLM7_EV_BASE` | `https://api.llm7.io` | 电子邮件验证基础地址 |
| `LLM7_API_BASE` | `https://api.llm7.io/v1` | 推理基础地址 |

## 🛰️ 在代理之后

**可选 —— 但这里做了交叉检查，因为 LLM7 对你从何处注册很严格。** 该工具在没有代理的情况下也能工作。

- **有代理池时：** 传入 `--pool <file>`（或设置 `LLM7_PROXIES`），每个请求都会经过该列表中的一个出口；一条失效线路会使该次尝试失败，CLI 会用下一个出口重试。
- **没有代理池时：** CLI 会打印 `running WITHOUT a proxy (direct)` 并直接连接。推理、免密钥检查和关卡都不变 —— 只是数据包离开的出口不同。
- **你必须知道的 403 注意事项：** LLM7 的电子邮件验证服务执行**按 IP 的策略**，对许多数据中心/免费出口返回 `403 ip_banned`（2026-10-23 在整个受认可的代理池上实测）。一个在 `--screen` 上筛选为*绿色*（端点可达）的代理池，仍可能**被禁止用于注册**。请使用住宅类出口，并预期铸造步骤在被拒绝时告诉你确切的代码。

## 📄 文件

| 路径 | 内容 |
| --- | --- |
| `keys.txt` | 每行一个经实时验证的密钥 —— 已被 git 忽略 |
| `accounts.json` | 每个账户的 email / sub / 掩码密钥 / 关卡状态 —— 已被 git 忽略 |
| `proxies.txt` | 你的出口，每行一个 —— 已被 git 忽略 |
| `src/vendor/` | 内置的代理隧道 + Emailnator 收件箱辅助程序（无外部依赖） |

## 🔌 连接到 9Router

[9Router](https://9router.com) 是一个自托管、兼容 OpenAI 的路由器。注册一次此提供商，每个密钥都会成为一个提供商节点下的连接：

```bash
node src/connect-9router.js
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--name "LLM7"`、`--prefix llm7`、`--base-url https://api.llm7.io/v1`。模型随后以 `llm7/<model id>` 形式提供，并在所有密钥之间负载均衡。

## 🔌 连接到 OmniRoute

[OmniRoute](https://omniroute.online) 是一个自托管、兼容 OpenAI 的路由器。注册一次此提供商，每个密钥都会成为一个提供商节点下的连接：

```bash
node src/connect-omniroute.js
```

默认值：`--base http://localhost:20128`、`--password 123456`、`--name "LLM7"`、`--prefix llm7`、`--base-url https://api.llm7.io/v1`。模型随后以 `llm7/<model id>` 形式提供，并在所有密钥之间负载均衡。

## 🔑 一个密钥能给你什么

| | |
| --- | --- |
| 🏢 提供商 | **LLM7** —— [llm7.io](https://llm7.io) |
| 🎁 提供商提供什么 | 每个密钥一个账户 —— 免费套餐经过聊天验证，而且也能免密钥响应 |
| 🔑 一个密钥能给你什么 | 一个限定于其自身账户的 API 密钥：下方端点上的 68 个模型 id，按你套餐的限制。配额存在于**账户**上，这正是本工具为每个密钥创建一个账户的原因 |
| 🌐 API 形态 | 兼容 OpenAI：`POST https://api.llm7.io/v1/chat/completions` |
| 🔒 你的数据 | 只联系 llm7.io 和你配置的收件箱后端；密钥留在你的机器上 |

## 🐞 问题

如果 LLM7 更改其注册形态、电子邮件验证端点或其 IP 策略，工具会在该步骤停止并打印确切状态（**例如 `request-code-403-ip_banned`**）。请**[提交 issue](../../issues)**，附上你运行的命令和确切输出；欢迎 PR。

## 📄 许可证

MIT © 2026 —— 见 [LICENSE](LICENSE)。

<div align="center">

**[MIT](LICENSE)** © 2026 llm7-bulk-apikey contributors

</div>