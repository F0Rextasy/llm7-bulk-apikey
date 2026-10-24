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

**자동 생성된 API 키로 LLM7 계정을 대량 생성 — OpenAI 호환 추론, 키 없는 무료 세트, + 9Router 커넥터.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-68%20served-412991?style=for-the-badge)](https://llm7.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 빠른 시작](#-quick-start) · [🎁 무료 티어](#-free-tier--how-much-you-get) · [🤖 모델](#-models--all-68-of-them) · [🧪 API 사용하기](#-how-to-use-the-api) · [✅ 검증됨](#-verified-working--every-key-is-tested) · [🧭 작동 방식](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ 옵션](#️-cli-options) · [🛰️ 프록시](#️-behind-a-proxy) · [🐞 이슈](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ 이 도구가 존재하는 이유

LLM7(`llm7.io`)은 **`https://api.llm7.io/v1`** 에 위치한 OpenAI 호환 게이트웨이로, 68개의 모델 id를 나열합니다. 이 도구를 대량 도구로 만들 만한 두 가지 특징이 있습니다: **무료 세트는 실시간으로 채팅 검증되며**(단순히 목록에 오른 것이 아님), *동일한* 무료 id가 **키 없는 포털**에서도 응답합니다 — 같은 엔드포인트가 **`Authorization` 헤더 없이도** 콘텐츠를 반환합니다. 계정 + 키 경로는 키가 필요한 id와 한도 때문에 존재하므로, 확장되는 단위는 **키당 하나의 계정**이며, 이것이 바로 `--count N`이 생성하는 것입니다.

## 🎁 무료 티어 — 얼마나 받을 수 있나

| 항목 | 값 |
| --- | --- |
| 가입 | 이메일 주소 → 6자리 코드 → 대시보드 세션 → 키 |
| 카드 필요 | **아니오** |
| 무료 세트 (실시간 검증, 키 사용) | `codestral-latest`, `gpt-oss:20b` |
| 키 없는 포털 | **동일한 무료 세트가 API 키 없이 응답** — `--keyless-check` 참고 |
| 카탈로그 | `GET https://api.llm7.io/v1/models`에 68개의 모델 id |
| 확장되는 단위 | **하나의 계정 = 하나의 키** → `--count N`은 사실상 "N개의 무료 계정" |

> 💡 무료 티어는 LLM7이 정하며 변경될 수 있습니다. 실시간 수치는 [llm7.io](https://llm7.io)에서 확인하세요 — 그리고 도구 자체의 게이트가 판단하도록 두세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 모델 — 68개 전부

`GET https://api.llm7.io/v1/models`는 **68개의 id**를 나열합니다. 실제 채팅 호출로 검증된 무료 세트(2026-10-23):

| 모델 ID | 검증됨 |
| --- | --- |
| `codestral-latest` | 출구 풀을 통해 **200** — 기본 게이트 모델, `keys.txt`의 게이트 로그에 기록됨 |
| `gpt-oss:20b` | **200** — 동일 엔드포인트, 동일 키 |
| 나머지 카탈로그 | 동일한 `GET /models` 피드, 키/플랜별로 제공됨 |

> ⚠️ 동일한 두 id가 `https://api.llm7.io/v1/chat/completions`에 대한 일반 요청에서 **키 없이**(`Authorization` 헤더 없음) 응답했습니다 — 2026-10-23 실시간 검증. 여기에 표시된 숫자는 *카탈로그 크기*이며, 결코 키별 약속이 아닙니다.

## 🧪 API 사용 방법

베이스 URL **`https://api.llm7.io/v1`** — OpenAI 호환.

```bash
curl https://api.llm7.io/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"codestral-latest","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

응답은 일반 JSON **또는** SSE 스트림(`text/event-stream`, `data: {...}` 줄)으로 도착합니다 — `stream`이 설정되지 않았을 때도 마찬가지입니다. 이 도구의 리더는 둘 다 허용하며, 여러분의 리더도 그래야 합니다.

## 🛠 빠른 시작

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

`keys.txt`는 실시간 채팅 완료가 키를 증명한 **후에만** 기록됩니다. 언제든 `node src/cli.js --keyless-check`로 무료 세트를 확인하세요.

### 🖱️ 런처

런처는 프록시 목록, 개수, 검증 모델을 묻고 이를 `launcher.config.json`에 기억하며, 올바른 플래그로 CLI를 실행합니다 — 또한 키 없는 검사, 출구 화면, 9Router 커넥터를 포함합니다.

## ✅ 검증됨 — 모든 키가 테스트됨

| 검사 | 결과 |
| --- | --- |
| `GET https://api.llm7.io/v1/models` | **200** — 68개 id |
| `POST /v1/chat/completions` — `codestral-latest`, 키 사용 | 출구 풀을 통해 실제 콘텐츠와 함께 **200** |
| `POST /v1/chat/completions` — `gpt-oss:20b`, 키 없음 | `Authorization` 헤더 없이 실제 콘텐츠와 함께 **200** |
| `POST /v1/chat/completions` — 기록되기 전의 모든 키 | 실제 콘텐츠와 함께 **200** |
| 채팅 검사에 실패한 키 | `keys.txt`에 절대 기록되지 않음 — 계정은 `accounts.json`에 남음 |

여기의 `keys.txt`에는 **3개의 키**가 있습니다; 3개 모두 2026-10-23에 출구 풀을 통해 실시간 게이트(키당 `chat-200` × 2, 그리고 도구 호출 `get_time` 정상성 검사)를 통과했습니다.

> **확장 차단 요인 (2026-10-23 측정 — 새 키를 기대하기 전에 읽어보세요).** LLM7 자체의 이메일 검증 서비스는 현재 이 랩이 도달할 수 있는 출구에 대해 **`403 ip_banned`**(`request-code-403-ip_banned`) 또는 **`verify-403`**을 응답하므로, *추론* 경로는 건강하지만 *생성* 경로는 코드 단계에서 실패합니다. 이는 제공자 측 IP 정책이지 이 도구의 버그가 아닙니다 — CLI는 키를 지어내는 대신 정확한 403을 보고합니다. 언제든 다시 확인하세요:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

> **품질 게이트.** 여기의 모든 키는 `keys.txt`에 기록되기 전에 실시간 `chat-200`을 통과했습니다
> (죽은 키는 절대 배포되지 않습니다). 라우터 조합도 모델 수준에서 동일한 규칙을 따릅니다: 항목은
> **모델이 `chat-200`을 응답하고 도구를 호출할 수 있는 경우에만** 추가됩니다 — 도구 지원이 없는 모델,
> 죽은 키, 죽은 제공자는 추가되지 않고 제거됩니다. 언제든 검증 단계를 다시 실행하세요;
> 실패는 보고되며, 결코 숨겨지지 않습니다.

## 🧭 작동 방식

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: LLM7 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.llm7.io/v1/chat/completions → real content = the key is live
```

| 단계 | 호출 | 비고 |
| --- | --- | --- |
| mailbox | Emailnator `POST /api/generate-email` | 계정당 새 gmail 주소 (벤더링된 헬퍼) |
| eligibility | `POST {AUTH}/auth/email/eligibility {email}` | `AUTH=https://api-token.llm7.io`; `next=email_verification`을 응답해야 함 |
| code | `POST {EV}/v1/email-verifications {email}` | `EV=https://api.llm7.io`; `verification_id` 반환; 차단된 출구는 여기서 `403 ip_banned` 응답 |
| mail | 동일한 받은편지함에서 6자리 코드 읽기 | 응답이 없으면 한 번 재요청 |
| verify | `POST {EV}/v1/email-verifications/verify {verification_id,code}` | 불투명한 `receipt` 반환 |
| session | `POST {AUTH}/auth/email {receipt}` | 대시보드는 `receipt` **문자열**만 전송함 — 전체 verify 객체는 거부됨 |
| key | `POST {AUTH}/tokens` (Bearer `auth_token`) | 평문 키가 한 번 반환됨 |
| gate | `POST https://api.llm7.io/v1/chat/completions` | `keys.txt` 이전에 콘텐츠가 있는 실시간 200이 필요함 |

## ⚙️ CLI 옵션

```bash
node src/cli.js --count N        # mint N keys (stop on the first failed chat gate)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --keyless-check  # prove the keyless free set (no Authorization header)
node src/cli.js --screen         # test your exit pool against api.llm7.io
node src/cli.js --help
```

| 플래그 | 의미 |
| --- | --- |
| `--count N` | 생성할 계정 (= 키) 수 `[1]` |
| `--model <id>` | 실시간 게이트에 사용되는 모델 `[codestral-latest]` |
| `--pool <file>` | 프록시 목록, 줄당 하나의 출구 `[proxies.txt]` |
| `--verify-only` | `keys.txt`의 모든 키를 채팅 게이트를 통해 다시 실행 |
| `--keyless-check` | 키 없는 무료 세트를 증명 |
| `--screen` | `api.llm7.io`에 대해 풀을 스크리닝 |
| `--exits N` | 포기하기 전 단계당 시도할 출구 수 `[6]` |
| `--timeout MS` | 요청당 타임아웃 `[45000]` |

| 환경 변수 | 기본값 | 의미 |
| --- | --- | --- |
| `LLM7_PROXIES` | `proxies.txt` | 출구 풀, 프록시당 한 줄 — 선택 사항: 풀이 없으면 CLI가 직접 연결 |
| `LLM7_MODEL` | `codestral-latest` | 실시간 검증용 모델 |
| `LLM7_AUTH_BASE` | `https://api-token.llm7.io` | 대시보드 인증 베이스 |
| `LLM7_EV_BASE` | `https://api.llm7.io` | 이메일 검증 베이스 |
| `LLM7_API_BASE` | `https://api.llm7.io/v1` | 추론 베이스 |

## 🛰️ 프록시 뒤에서

**선택 사항 — 그리고 여기서 교차 확인됩니다, LLM7은 어디서 가입하는지에 엄격하기 때문입니다.** 이 도구는 프록시 없이도 작동합니다.

- **풀 사용 시:** `--pool <file>`을 전달하거나(또는 `LLM7_PROXIES` 설정) 모든 요청이 해당 목록의 출구를 통해 나갑니다; 죽은 줄은 해당 시도를 실패시키고 CLI는 다음 출구로 재시도합니다.
- **풀 없이:** CLI는 `running WITHOUT a proxy (direct)`를 출력하고 직접 연결합니다. 추론, 키 없는 검사, 게이트는 변경되지 않습니다 — 패킷이 나가는 출구만 다를 뿐입니다.
- **반드시 알아야 할 403 주의사항:** LLM7의 이메일 검증 서비스는 **IP별 정책**을 시행하며 많은 데이터센터/무료 출구에 대해 `403 ip_banned`를 응답합니다(전체 승인된 풀에서 2026-10-23 측정). `--screen`에서 *녹색*으로 스크리닝되는(엔드포인트에 도달 가능한) 풀도 **가입이 차단될** 수 있습니다. 주거용 스타일 출구를 사용하고, 생성 단계가 거부될 때 정확한 코드를 알려줄 것이라고 예상하세요.

## 📄 파일

| 경로 | 내용 |
| --- | --- |
| `keys.txt` | 줄당 하나의 실시간 검증된 키 — git-ignored |
| `accounts.json` | 계정당 이메일 / sub / 마스킹된 키 / 게이트 상태 — git-ignored |
| `proxies.txt` | 출구, 줄당 하나 — git-ignored |
| `src/vendor/` | 벤더링된 프록시 터널링 + Emailnator 받은편지함 헬퍼 (외부 의존성 없음) |

## 🔌 9Router에 연결

[9Router](https://9router.com)는 자체 호스팅되는 OpenAI 호환 라우터입니다. 이 제공자를 한 번 등록하면 모든 키가 하나의 제공자 노드 아래 연결이 됩니다:

```bash
node src/connect-9router.js
```

기본값: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. 모델은 `llm7/<model id>`로 제공되며 모든 키에 걸쳐 로드 밸런싱됩니다.

## 🔌 OmniRoute에 연결

[OmniRoute](https://omniroute.online)는 자체 호스팅되는 OpenAI 호환 라우터입니다. 이 제공자를 한 번 등록하면 모든 키가 하나의 제공자 노드 아래 연결이 됩니다:

```bash
node src/connect-omniroute.js
```

기본값: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. 모델은 `llm7/<model id>`로 제공되며 모든 키에 걸쳐 로드 밸런싱됩니다.

## 🔑 키 하나로 얻는 것

| | |
| --- | --- |
| 🏢 제공자 | **LLM7** — [llm7.io](https://llm7.io) |
| 🎁 제공자가 주는 것 | 키당 하나의 계정 — 무료 세트는 채팅 검증되며, 키 없이도 응답함 |
| 🔑 키 하나로 얻는 것 | 자체 계정에 범위가 지정된 하나의 API 키: 아래 엔드포인트의 68개 모델 id, 플랜의 한도 내에서. 할당량은 **계정**에 있으므로, 이 도구가 키당 하나의 계정을 생성하는 것입니다 |
| 🌐 API 형태 | OpenAI 호환: `POST https://api.llm7.io/v1/chat/completions` |
| 🔒 데이터 | llm7.io와 구성한 받은편지함 백엔드만 접촉됨; 키는 여러분의 머신에 남음 |

## 🐞 이슈

LLM7이 가입 형태, 이메일 검증 엔드포인트 또는 IP 정책을 변경하면, 도구는 해당 단계에서 멈추고 정확한 상태를 출력합니다(**예: `request-code-403-ip_banned`**). 실행한 명령과 정확한 출력을 포함하여 **[이슈를 열어주세요](../../issues)**; PR을 환영합니다.

## 📄 라이선스

MIT © 2026 — [LICENSE](LICENSE) 참고.

<div align="center">

**[MIT](LICENSE)** © 2026 llm7-bulk-apikey contributors

</div>