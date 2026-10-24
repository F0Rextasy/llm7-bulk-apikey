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

**Массовое создание аккаунтов LLM7 с автоматически сгенерированными API-ключами — инференс, совместимый с OpenAI, бесплатный набор без ключа, + коннектор 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-68%20served-412991?style=for-the-badge)](https://llm7.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Быстрый старт](#-quick-start) · [🎁 Бесплатный уровень](#-free-tier--how-much-you-get) · [🤖 Модели](#-models--all-68-of-them) · [🧪 Использование API](#-how-to-use-the-api) · [✅ Проверено](#-verified-working--every-key-is-tested) · [🧭 Как это работает](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Опции](#️-cli-options) · [🛰️ Прокси](#️-behind-a-proxy) · [🐞 Проблемы](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Зачем это нужно

LLM7 (`llm7.io`) — это шлюз, совместимый с OpenAI, по адресу **`https://api.llm7.io/v1`**, который перечисляет 68 идентификаторов моделей. Две вещи делают его достойным массового инструмента: **бесплатный набор проверяется вживую через чат** (а не просто перечисляется), и *те же самые* бесплатные идентификаторы также отвечают через **портал без ключа** — тот же самый эндпоинт возвращает контент **вообще без заголовка `Authorization`**. Путь через аккаунт + ключ существует для идентификаторов и лимитов, которым он нужен, поэтому единица масштабирования — это **один аккаунт на ключ**, именно то, что создаёт `--count N`.

## 🎁 Бесплатный уровень — сколько вы получаете

| Что | Значение |
| --- | --- |
| Регистрация | адрес e-mail → 6-значный код → сессия в панели управления → ключ |
| Требуется карта | **Нет** |
| Бесплатный набор (проверен вживую, с ключом) | `codestral-latest`, `gpt-oss:20b` |
| Портал без ключа | **тот же бесплатный набор отвечает без API-ключа** — см. `--keyless-check` |
| Каталог | 68 идентификаторов моделей на `GET https://api.llm7.io/v1/models` |
| Единица масштабирования | **один аккаунт = один ключ** → `--count N` — это на самом деле «N бесплатных аккаунтов» |

> 💡 Бесплатный уровень устанавливается LLM7 и может меняться. Проверяйте актуальные цифры на [llm7.io](https://llm7.io) — и пусть собственный шлюз инструмента решает:

```bash
node src/cli.js --verify-only     # каждый ключ в keys.txt перепроверяется реальным вызовом чата
```

## 🤖 Модели — все 68

`GET https://api.llm7.io/v1/models` перечисляет **68 идентификаторов**. Бесплатный набор, проверенный реальным вызовом чата (2026-10-23):

| ID модели | Проверено |
| --- | --- |
| `codestral-latest` | **200** через пул выходов — модель шлюза по умолчанию, в журнале шлюза `keys.txt` |
| `gpt-oss:20b` | **200** — тот же эндпоинт, тот же ключ |
| остальной каталог | тот же поток `GET /models`, обслуживается по ключу/плану |

> ⚠️ Те же два идентификатора ответили **без ключа** (без заголовка `Authorization`) на обычный запрос к `https://api.llm7.io/v1/chat/completions` — проверено вживую 2026-10-23. Указанное здесь число — это *размер каталога*, а не обещание по каждому ключу.

## 🧪 Как использовать API

Базовый URL **`https://api.llm7.io/v1`** — совместим с OpenAI.

```bash
curl https://api.llm7.io/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"codestral-latest","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Ответы приходят в виде обычного JSON **или** в виде потока SSE (строки `text/event-stream`, `data: {...}`), даже когда `stream` не задан — читатель этого инструмента принимает оба варианта, и ваш тоже должен.

## 🛠 Быстрый старт

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

`keys.txt` записывается **только** после того, как живое завершение чата подтвердит ключ. Проверить бесплатный набор можно в любой момент с помощью `node src/cli.js --keyless-check`.

### 🖱️ Лаунчер

Лаунчер запрашивает список прокси, количество и модель проверки, запоминает их в `launcher.config.json` и запускает CLI с нужными флагами — он также содержит проверку без ключа, экран выходов и коннектор 9Router.

## ✅ Проверено в работе — каждый ключ протестирован

| Проверка | Результат |
| --- | --- |
| `GET https://api.llm7.io/v1/models` | **200** — 68 идентификаторов |
| `POST /v1/chat/completions` — `codestral-latest`, с ключом | **200** с реальным контентом, через пул выходов |
| `POST /v1/chat/completions` — `gpt-oss:20b`, без ключа | **200** с реальным контентом, без заголовка `Authorization` |
| `POST /v1/chat/completions` — каждый ключ перед записью | **200** с реальным контентом |
| ключ, не прошедший проверку чата | никогда не записывается в `keys.txt` — аккаунт остаётся в `accounts.json` |

`keys.txt` здесь содержит **3 ключа**; все 3 прошли живой шлюз (`chat-200` × 2 на ключ, плюс проверка вызова инструмента `get_time`) через пул выходов 2026-10-23.

> **Блокер масштабирования (измерено 2026-10-23 — прочтите это, прежде чем ожидать новые ключи).** Собственный сервис проверки e-mail LLM7 в настоящее время отвечает **`403 ip_banned`** (`request-code-403-ip_banned`) или **`verify-403`** для выходов, до которых может добраться эта лаборатория, поэтому путь *создания* ключа терпит неудачу на шаге кода, хотя путь *инференса* здоров. Это политика IP на стороне провайдера, а не ошибка в этом инструменте — CLI сообщает точный 403 вместо того, чтобы выдумывать ключ. Перепроверяйте в любой момент:

```bash
node src/cli.js --verify-only     # каждый ключ в keys.txt перепроверяется реальным вызовом чата
```

> **Контроль качества.** Каждый ключ здесь прошёл живой `chat-200` перед записью в `keys.txt`
> (мёртвые ключи никогда не поставляются). Комбинации роутера следуют тому же правилу на уровне модели: запись
> добавляется **только если модель отвечает `chat-200` и умеет вызывать инструменты** — модель без поддержки инструментов,
> мёртвый ключ или мёртвый провайдер отбрасывается, а не добавляется. Перезапускайте шаг проверки в любой момент;
> сбои сообщаются, никогда не скрываются.

## 🧭 Как это работает

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: LLM7 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.llm7.io/v1/chat/completions → real content = the key is live
```

| Шаг | Вызов | Примечания |
| --- | --- | --- |
| почтовый ящик | Emailnator `POST /api/generate-email` | свежий gmail-адрес на аккаунт (встроенный помощник) |
| право на участие | `POST {AUTH}/auth/email/eligibility {email}` | `AUTH=https://api-token.llm7.io`; должен ответить `next=email_verification` |
| код | `POST {EV}/v1/email-verifications {email}` | `EV=https://api.llm7.io`; возвращает `verification_id`; забаненные выходы отвечают `403 ip_banned` здесь |
| почта | прочитать 6-значный код из того же ящика | запрашивается повторно один раз при молчании |
| проверка | `POST {EV}/v1/email-verifications/verify {verification_id,code}` | возвращает непрозрачный `receipt` |
| сессия | `POST {AUTH}/auth/email {receipt}` | панель управления отправляет только **строку** `receipt` — весь объект проверки отклоняется |
| ключ | `POST {AUTH}/tokens` (Bearer `auth_token`) | ключ в открытом виде возвращается один раз |
| шлюз | `POST https://api.llm7.io/v1/chat/completions` | требуется живой 200 с контентом перед `keys.txt` |

## ⚙️ Опции CLI

```bash
node src/cli.js --count N        # mint N keys (stop on the first failed chat gate)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --keyless-check  # prove the keyless free set (no Authorization header)
node src/cli.js --screen         # test your exit pool against api.llm7.io
node src/cli.js --help
```

| Флаг | Значение |
| --- | --- |
| `--count N` | аккаунтов (= ключей) для создания `[1]` |
| `--model <id>` | модель, используемая для живого шлюза `[codestral-latest]` |
| `--pool <file>` | список прокси, один выход на строку `[proxies.txt]` |
| `--verify-only` | перезапустить каждый ключ в `keys.txt` через шлюз чата |
| `--keyless-check` | подтверждает бесплатный набор без ключа |
| `--screen` | проверяет пул против `api.llm7.io` |
| `--exits N` | выходов, испробованных на шаг, прежде чем сдаться `[6]` |
| `--timeout MS` | тайм-аут на запрос `[45000]` |

| Переменная окружения | По умолчанию | Значение |
| --- | --- | --- |
| `LLM7_PROXIES` | `proxies.txt` | пул выходов, одна строка на прокси — необязательно: без пула CLI подключается напрямую |
| `LLM7_MODEL` | `codestral-latest` | модель для живой проверки |
| `LLM7_AUTH_BASE` | `https://api-token.llm7.io` | база аутентификации панели управления |
| `LLM7_EV_BASE` | `https://api.llm7.io` | база проверки e-mail |
| `LLM7_API_BASE` | `https://api.llm7.io/v1` | база инференса |

## 🛰️ За прокси

**Необязательно — и перекрёстно проверено здесь, потому что LLM7 строг насчёт того, откуда вы регистрируетесь.** Инструмент работает и без прокси.

- **С пулом:** передайте `--pool <file>` (или задайте `LLM7_PROXIES`), и каждый запрос идёт через выход из этого списка; мёртвая строка проваливает эту попытку, и CLI повторяет с следующим выходом.
- **Без пула:** CLI выводит `running WITHOUT a proxy (direct)` и подключается напрямую. Инференс, проверка без ключа и шлюз не меняются — меняется только выход, из которого уходят пакеты.
- **Предостережение о 403, которое вы должны знать:** сервис проверки e-mail LLM7 применяет **политику по IP** и отвечает `403 ip_banned` для многих датацентровых/бесплатных выходов (измерено на всём санкционированном пуле, 2026-10-23). Пул, который показывает *зелёный* результат на `--screen` (эндпоинт доступен), всё равно может быть **забанен для регистрации**. Используйте выходы резидентного типа и ожидайте, что шаг создания ключа сообщит вам точный код, когда ему откажут.

## 📄 Файлы

| Путь | Содержимое |
| --- | --- |
| `keys.txt` | один проверенный вживую ключ на строку — игнорируется git |
| `accounts.json` | email / sub / маскированный ключ / статус шлюза на аккаунт — игнорируется git |
| `proxies.txt` | ваши выходы, один на строку — игнорируется git |
| `src/vendor/` | встроенное туннелирование прокси + помощник ящика Emailnator (без внешних зависимостей) |

## 🔌 Подключение к 9Router

[9Router](https://9router.com) — это самостоятельно размещаемый роутер, совместимый с OpenAI. Зарегистрируйте этого провайдера один раз, и каждый ключ станет соединением под одним узлом-провайдером:

```bash
node src/connect-9router.js
```

По умолчанию: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Затем модели обслуживаются как `llm7/<model id>` и балансируются между всеми ключами.

## 🔌 Подключение к OmniRoute

[OmniRoute](https://omniroute.online) — это самостоятельно размещаемый роутер, совместимый с OpenAI. Зарегистрируйте этого провайдера один раз, и каждый ключ станет соединением под одним узлом-провайдером:

```bash
node src/connect-omniroute.js
```

По умолчанию: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Затем модели обслуживаются как `llm7/<model id>` и балансируются между всеми ключами.

## 🔑 Что даёт один ключ

| | |
| --- | --- |
| 🏢 Провайдер | **LLM7** — [llm7.io](https://llm7.io) |
| 🎁 Что даёт провайдер | один аккаунт на ключ — бесплатный набор проверяется через чат, и он также отвечает без ключа |
| 🔑 Что даёт один ключ | один API-ключ, привязанный к своему аккаунту: 68 идентификаторов моделей на эндпоинте ниже, в пределах лимитов вашего плана. Квота живёт на **аккаунте**, именно поэтому этот инструмент создаёт один аккаунт на ключ |
| 🌐 Форма API | совместим с OpenAI: `POST https://api.llm7.io/v1/chat/completions` |
| 🔒 Ваши данные | связываются только llm7.io и настроенный вами бэкенд ящика; ключи остаются на вашей машине |

## 🐞 Проблемы

Если LLM7 изменит форму регистрации, эндпоинты проверки e-mail или свою политику по IP, инструмент остановится на этом шаге и выведет точный статус (**например, `request-code-403-ip_banned`**). **[Откройте issue](../../issues)** с командой, которую вы запустили, и точным выводом; PR приветствуются.

## 📄 Лицензия

MIT © 2026 — см. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 llm7-bulk-apikey contributors

</div>