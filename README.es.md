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

**Crea cuentas de LLM7 en masa con claves API generadas automáticamente — inferencia compatible con OpenAI, un conjunto gratuito sin clave y conector para 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-68%20served-412991?style=for-the-badge)](https://llm7.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Inicio rápido](#-quick-start) · [🎁 Nivel gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-68-of-them) · [🧪 Usar la API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Cómo funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opciones](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por qué existe esto

LLM7 (`llm7.io`) es una pasarela compatible con OpenAI en **`https://api.llm7.io/v1`** que lista 68 ids de modelos. Dos cosas lo hacen merecedor de una herramienta masiva: el **conjunto gratuito está verificado en vivo por chat** (no solo listado), y los *mismos* ids gratuitos también responden desde un **portal sin clave** — el endpoint idéntico devuelve contenido **sin ningún encabezado `Authorization`**. La ruta de cuenta + clave existe para los ids y límites que la necesitan, así que la unidad que escala es **una cuenta por clave**, exactamente lo que acuña `--count N`.

## 🎁 Nivel gratuito — cuánto obtienes

| Qué | Valor |
| --- | --- |
| Registro | dirección de correo → código de 6 dígitos → sesión del panel → clave |
| Tarjeta requerida | **No** |
| Conjunto gratuito (verificado en vivo, con clave) | `codestral-latest`, `gpt-oss:20b` |
| Portal sin clave | el **mismo conjunto gratuito responde sin clave API** — consulta `--keyless-check` |
| Catálogo | 68 ids de modelos en `GET https://api.llm7.io/v1/models` |
| La unidad que escala | **una cuenta = una clave** → `--count N` en realidad significa "N cuentas gratuitas" |

> 💡 El nivel gratuito lo define LLM7 y puede cambiar. Consulta las cifras en vivo en [llm7.io](https://llm7.io) — y deja que la propia puerta de la herramienta decida:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — los 68

`GET https://api.llm7.io/v1/models` lista **68 ids**. El conjunto gratuito verificado con una llamada de chat real (2026-10-23):

| ID del modelo | Verificado |
| --- | --- |
| `codestral-latest` | **200** a través del grupo de salida — el modelo de puerta predeterminado, en el registro de puerta de `keys.txt` |
| `gpt-oss:20b` | **200** — mismo endpoint, misma clave |
| el catálogo restante | el mismo feed de `GET /models`, servido por clave/plan |

> ⚠️ Los mismos dos ids respondieron **sin clave** (sin encabezado `Authorization`) desde una solicitud simple a `https://api.llm7.io/v1/chat/completions` — verificado en vivo el 2026-10-23. Un número impreso aquí es un *tamaño de catálogo*, nunca una promesa por clave.

## 🧪 Cómo usar la API

URL base **`https://api.llm7.io/v1`** — compatible con OpenAI.

```bash
curl https://api.llm7.io/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"codestral-latest","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Las respuestas llegan como JSON simple **o** como un flujo SSE (líneas `text/event-stream`, `data: {...}`) incluso cuando `stream` no está establecido — el lector de esta herramienta acepta ambos, y el tuyo también debería.

## 🛠 Inicio rápido

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

`keys.txt` se escribe **solo** después de que una finalización de chat en vivo demuestra la clave. Consulta el conjunto gratuito en cualquier momento con `node src/cli.js --keyless-check`.

### 🖱️ El lanzador

El lanzador solicita la lista de proxies, la cantidad y el modelo de verificación, los recuerda en `launcher.config.json` y ejecuta la CLI con los flags correctos — también incluye la comprobación sin clave, la pantalla de salida y el conector de 9Router.

## ✅ Verificado y funcionando — cada clave se prueba

| Comprobación | Resultado |
| --- | --- |
| `GET https://api.llm7.io/v1/models` | **200** — 68 ids |
| `POST /v1/chat/completions` — `codestral-latest`, con clave | **200** con contenido real, a través del grupo de salida |
| `POST /v1/chat/completions` — `gpt-oss:20b`, sin clave | **200** con contenido real, sin encabezado `Authorization` |
| `POST /v1/chat/completions` — cada clave antes de escribirse | **200** con contenido real |
| una clave que falla su comprobación de chat | nunca se escribe en `keys.txt` — la cuenta permanece en `accounts.json` |

`keys.txt` aquí contiene **3 claves**; las 3 pasaron la puerta en vivo (`chat-200` × 2 por clave, más una comprobación de sanidad de llamada a herramienta `get_time`) a través del grupo de salida el 2026-10-23.

> **Bloqueo de escala (medido el 2026-10-23 — lee esto antes de esperar nuevas claves).** El propio servicio de verificación por correo de LLM7 actualmente responde **`403 ip_banned`** (`request-code-403-ip_banned`) o **`verify-403`** para las salidas que este laboratorio puede alcanzar, así que la ruta de *acuñación* falla en el paso del código aunque la ruta de *inferencia* esté sana. Eso es una política de IP del lado del proveedor, no un error de esta herramienta — la CLI informa el 403 exacto en lugar de inventar una clave. Vuelve a comprobar en cualquier momento:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

> **Puertas de calidad.** Cada clave aquí pasó un `chat-200` en vivo antes de escribirse en `keys.txt`
> (las claves muertas nunca se distribuyen). Las combinaciones del router siguen la misma regla a nivel de modelo: una entrada se
> añade **solo si el modelo responde `chat-200` y puede llamar a herramientas** — un modelo sin soporte de herramientas,
> una clave muerta o un proveedor muerto se descarta en lugar de añadirse. Vuelve a ejecutar el paso de verificación en cualquier momento;
> los fallos se informan, nunca se ocultan.

## 🧭 Cómo funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: LLM7 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.llm7.io/v1/chat/completions → real content = the key is live
```

| Paso | Llamada | Notas |
| --- | --- | --- |
| buzón | Emailnator `POST /api/generate-email` | una dirección de gmail nueva por cuenta (ayudante incluido) |
| elegibilidad | `POST {AUTH}/auth/email/eligibility {email}` | `AUTH=https://api-token.llm7.io`; debe responder `next=email_verification` |
| código | `POST {EV}/v1/email-verifications {email}` | `EV=https://api.llm7.io`; devuelve `verification_id`; las salidas bloqueadas responden `403 ip_banned` aquí |
| correo | lee el código de 6 dígitos del mismo buzón | se vuelve a solicitar una vez si hay silencio |
| verificar | `POST {EV}/v1/email-verifications/verify {verification_id,code}` | devuelve el `receipt` opaco |
| sesión | `POST {AUTH}/auth/email {receipt}` | el panel publica solo la **cadena** `receipt` — se rechaza el objeto de verificación completo |
| clave | `POST {AUTH}/tokens` (Bearer `auth_token`) | clave en texto plano devuelta una vez |
| puerta | `POST https://api.llm7.io/v1/chat/completions` | se requiere un 200 en vivo con contenido antes de `keys.txt` |

## ⚙️ Opciones de la CLI

```bash
node src/cli.js --count N        # mint N keys (stop on the first failed chat gate)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --keyless-check  # prove the keyless free set (no Authorization header)
node src/cli.js --screen         # test your exit pool against api.llm7.io
node src/cli.js --help
```

| Flag | Significado |
| --- | --- |
| `--count N` | cuentas (= claves) a acuñar `[1]` |
| `--model <id>` | modelo usado para la puerta en vivo `[codestral-latest]` |
| `--pool <file>` | lista de proxies, una salida por línea `[proxies.txt]` |
| `--verify-only` | vuelve a ejecutar cada clave en `keys.txt` a través de la puerta de chat |
| `--keyless-check` | demuestra el conjunto gratuito sin clave |
| `--screen` | examina el grupo contra `api.llm7.io` |
| `--tries N` | salidas probadas por paso antes de rendirse `[4]` |
| `--timeout MS` | tiempo de espera por solicitud `[45000]` |

| Variable de entorno | Predeterminado | Significado |
| --- | --- | --- |
| `LLM7_PROXIES` | `proxies.txt` | grupo de salida, una línea por proxy — opcional: sin un grupo, la CLI se conecta directamente |
| `LLM7_MODEL` | `codestral-latest` | modelo para la verificación en vivo |
| `LLM7_AUTH_BASE` | `https://api-token.llm7.io` | base de autenticación del panel |
| `LLM7_EV_BASE` | `https://api.llm7.io` | base de verificación por correo |
| `LLM7_API_BASE` | `https://api.llm7.io/v1` | base de inferencia |

## 🛰️ Detrás de un proxy

**Opcional — y verificado aquí, porque LLM7 es estricto sobre desde dónde te registras.** La herramienta también funciona sin proxy.

- **Con un grupo:** pasa `--pool <file>` (o establece `LLM7_PROXIES`) y cada solicitud pasa por una salida de esa lista; una línea muerta hace fallar ese intento y la CLI reintenta con la siguiente salida.
- **Sin un grupo:** la CLI imprime `running WITHOUT a proxy (direct)` y se conecta directamente. La inferencia, la comprobación sin clave y la puerta no cambian — solo la salida desde la que salen los paquetes.
- **La advertencia del 403 que debes conocer:** el servicio de verificación por correo de LLM7 aplica una **política por IP** y responde `403 ip_banned` para muchas salidas de centro de datos/gratuitas (medido en todo el grupo autorizado, 2026-10-23). Un grupo que se examina *en verde* en `--screen` (el endpoint es alcanzable) aún puede estar **bloqueado para el registro**. Usa salidas de tipo residencial, y espera que el paso de acuñación te diga el código exacto cuando se rechace.

## 📄 Archivos

| Ruta | Contenido |
| --- | --- |
| `keys.txt` | una clave verificada en vivo por línea — ignorada por git |
| `accounts.json` | correo / sub / clave enmascarada / estado de la puerta por cuenta — ignorado por git |
| `proxies.txt` | tus salidas, una por línea — ignorado por git |
| `src/vendor/` | tunelización de proxy incluida + ayudante de buzón Emailnator (sin dependencias externas) |

## 🔌 Conectar con 9Router

[9Router](https://9router.com) es un router autoalojado compatible con OpenAI. Registra este proveedor una vez y cada clave se convierte en una conexión bajo un nodo de proveedor:

```bash
node src/connect-9router.js
```

Predeterminados: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Los modelos se sirven entonces como `llm7/<model id>` y se equilibran la carga entre todas las claves.

## 🔌 Conectar con OmniRoute

[OmniRoute](https://omniroute.online) es un router autoalojado compatible con OpenAI. Registra este proveedor una vez y cada clave se convierte en una conexión bajo un nodo de proveedor:

```bash
node src/connect-omniroute.js
```

Predeterminados: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Los modelos se sirven entonces como `llm7/<model id>` y se equilibran la carga entre todas las claves.

## 🔑 Qué te da una clave

| | |
| --- | --- |
| 🏢 Proveedor | **LLM7** — [llm7.io](https://llm7.io) |
| 🎁 Qué da el proveedor | una cuenta por clave — el conjunto gratuito está verificado por chat, y también responde sin clave |
| 🔑 Qué te da una clave | una clave API limitada a su propia cuenta: los 68 ids de modelos en el endpoint de abajo, a los límites de tu plan. La cuota vive en la **cuenta**, que es exactamente por lo que esta herramienta crea una cuenta por clave |
| 🌐 Forma de la API | compatible con OpenAI: `POST https://api.llm7.io/v1/chat/completions` |
| 🔒 Tus datos | solo se contacta con llm7.io y el backend de buzón que configures; las claves permanecen en tu máquina |

## 🐞 Problemas

Si LLM7 cambia la forma de su registro, los endpoints de verificación por correo o su política de IP, la herramienta se detiene en ese paso e imprime el estado exacto (**p. ej. `request-code-403-ip_banned`**). **[Abre un issue](../../issues)** con el comando que ejecutaste y la salida exacta; los PR son bienvenidos.

## 📄 Licencia

MIT © 2026 — consulta [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 llm7-bulk-apikey contributors

</div>