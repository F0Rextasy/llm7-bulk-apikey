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

**Otomatik oluşturulan API anahtarlarıyla toplu LLM7 hesabı oluşturun — OpenAI uyumlu çıkarım, anahtarsız ücretsiz set, + 9Router bağlayıcısı.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-68%20served-412991?style=for-the-badge)](https://llm7.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Hızlı başlangıç](#-quick-start) · [🎁 Ücretsiz katman](#-free-tier--how-much-you-get) · [🤖 Modeller](#-models--all-68-of-them) · [🧪 API'yi kullanın](#-how-to-use-the-api) · [✅ Doğrulandı](#-verified-working--every-key-is-tested) · [🧭 Nasıl çalışır](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Seçenekler](#️-cli-options) · [🛰️ Proxy'ler](#️-behind-a-proxy) · [🐞 Sorunlar](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Bu neden var

LLM7 (`llm7.io`), **`https://api.llm7.io/v1`** adresinde bulunan ve 68 model kimliği listeleyen OpenAI uyumlu bir ağ geçididir. Onu bir toplu araç için değerli kılan iki şey var: **ücretsiz set canlı olarak sohbetle doğrulanır** (yalnızca listelenmez) ve *aynı* ücretsiz kimlikler bir **anahtarsız portaldan** da yanıt verir — aynı uç nokta, **hiç `Authorization` başlığı olmadan** içerik döndürür. Hesap + anahtar yolu, anahtar gerektiren kimlikler ve limitler için vardır; bu yüzden ölçeklenen birim **anahtar başına bir hesaptır** — tam olarak `--count N`'in ürettiği şey.

## 🎁 Ücretsiz katman — ne kadar elde edersiniz

| Ne | Değer |
| --- | --- |
| Kayıt | e-posta adresi → 6 haneli kod → kontrol paneli oturumu → anahtar |
| Kart gerekli mi | **Hayır** |
| Ücretsiz set (canlı doğrulanmış, anahtarlı) | `codestral-latest`, `gpt-oss:20b` |
| Anahtarsız portal | **aynı ücretsiz set API anahtarı olmadan yanıt verir** — bkz. `--keyless-check` |
| Katalog | `GET https://api.llm7.io/v1/models` üzerinde 68 model kimliği |
| Ölçeklenen birim | **bir hesap = bir anahtar** → `--count N` aslında "N ücretsiz hesap" demektir |

> 💡 Ücretsiz katman LLM7 tarafından belirlenir ve değişebilir. Canlı sayıları [llm7.io](https://llm7.io) adresinden kontrol edin — ve kararı aracın kendi kapısına bırakın:

```bash
node src/cli.js --verify-only     # keys.txt içindeki her anahtar gerçek bir sohbet çağrısıyla yeniden test edilir
```

## 🤖 Modeller — 68'inin tamamı

`GET https://api.llm7.io/v1/models` **68 kimlik** listeler. Gerçek bir sohbet çağrısıyla doğrulanan ücretsiz set (2026-10-23):

| Model Kimliği | Doğrulandı |
| --- | --- |
| `codestral-latest` | çıkış havuzu üzerinden **200** — varsayılan kapı modeli, `keys.txt`'in kapı günlüğünde |
| `gpt-oss:20b` | **200** — aynı uç nokta, aynı anahtar |
| kalan katalog | aynı `GET /models` akışı, anahtar/plana göre sunulur |

> ⚠️ Aynı iki kimlik, `https://api.llm7.io/v1/chat/completions` adresine yapılan düz bir istekten **anahtarsız** (hiç `Authorization` başlığı olmadan) yanıt verdi — 2026-10-23'te canlı olarak doğrulandı. Burada yazılan bir sayı bir *katalog boyutudur*, asla anahtar başına bir vaat değildir.

## 🧪 API nasıl kullanılır

Temel URL **`https://api.llm7.io/v1`** — OpenAI uyumlu.

```bash
curl https://api.llm7.io/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"codestral-latest","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Yanıtlar düz JSON **veya** `stream` ayarlanmamış olsa bile bir SSE akışı (`text/event-stream`, `data: {...}` satırları) olarak gelir — bu aracın okuyucusu her ikisini de kabul eder, sizinki de etmelidir.

## 🛠 Hızlı başlangıç

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

`keys.txt` **yalnızca** canlı bir sohbet tamamlaması anahtarı kanıtladıktan sonra yazılır. Ücretsiz seti istediğiniz zaman `node src/cli.js --keyless-check` ile kontrol edin.

### 🖱️ Başlatıcı

Başlatıcı proxy listesini, sayıyı ve doğrulama modelini sorar, bunları `launcher.config.json` içinde hatırlar ve CLI'yi doğru bayraklarla çalıştırır — ayrıca anahtarsız kontrolü, çıkış ekranını ve 9Router bağlayıcısını da taşır.

## ✅ Çalıştığı doğrulandı — her anahtar test edilir

| Kontrol | Sonuç |
| --- | --- |
| `GET https://api.llm7.io/v1/models` | **200** — 68 kimlik |
| `POST /v1/chat/completions` — `codestral-latest`, anahtarlı | çıkış havuzu üzerinden gerçek içerikle **200** |
| `POST /v1/chat/completions` — `gpt-oss:20b`, anahtarsız | gerçek içerikle **200**, `Authorization` başlığı yok |
| `POST /v1/chat/completions` — yazılmadan önce her anahtar | gerçek içerikle **200** |
| sohbet kontrolünde başarısız olan bir anahtar | `keys.txt`'e asla yazılmaz — hesap `accounts.json` içinde kalır |

Buradaki `keys.txt` **3 anahtar** taşır; 3'ü de 2026-10-23'te çıkış havuzu üzerinden canlı kapıyı geçti (anahtar başına `chat-200` × 2, artı bir araç çağrısı `get_time` akıl sağlığı kontrolü).

> **Ölçek engelleyici (2026-10-23'te ölçüldü — yeni anahtarlar bekleyecekseniz bunu okuyun).** LLM7'nin kendi e-posta doğrulama servisi şu anda bu laboratuvarın erişebildiği çıkışlar için **`403 ip_banned`** (`request-code-403-ip_banned`) veya **`verify-403`** yanıtı veriyor; bu yüzden *üretim* yolu, *çıkarım* yolu sağlıklı olsa bile kod adımında başarısız oluyor. Bu, sağlayıcı tarafında bir IP politikasıdır, bu araçta bir hata değildir — CLI, anahtar uydurmak yerine tam 403'ü bildirir. İstediğiniz zaman yeniden kontrol edin:

```bash
node src/cli.js --verify-only     # keys.txt içindeki her anahtar gerçek bir sohbet çağrısıyla yeniden test edilir
```

> **Kalite kapıları.** Buradaki her anahtar, `keys.txt`'e yazılmadan önce canlı bir `chat-200` geçti
> (ölü anahtarlar asla gönderilmez). Yönlendirici kombinasyonları model düzeyinde aynı kuralı izler: bir giriş
> **yalnızca model `chat-200` yanıtı verirse ve araçları çağırabiliyorsa** eklenir — araç desteği olmayan bir model,
> ölü bir anahtar veya ölü bir sağlayıcı eklenmek yerine çıkarılır. Doğrulama adımını istediğiniz zaman yeniden çalıştırın;
> başarısızlıklar bildirilir, asla gizlenmez.

## 🧭 Nasıl çalışır

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: LLM7 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.llm7.io/v1/chat/completions → real content = the key is live
```

| Adım | Çağrı | Notlar |
| --- | --- | --- |
| posta kutusu | Emailnator `POST /api/generate-email` | hesap başına yeni bir gmail adresi (gömülü yardımcı) |
| uygunluk | `POST {AUTH}/auth/email/eligibility {email}` | `AUTH=https://api-token.llm7.io`; `next=email_verification` yanıtı vermeli |
| kod | `POST {EV}/v1/email-verifications {email}` | `EV=https://api.llm7.io`; `verification_id` döndürür; yasaklı çıkışlar burada `403 ip_banned` yanıtı verir |
| posta | aynı gelen kutusundan 6 haneli kodu oku | sessizlik durumunda bir kez yeniden istenir |
| doğrula | `POST {EV}/v1/email-verifications/verify {verification_id,code}` | opak `receipt` döndürür |
| oturum | `POST {AUTH}/auth/email {receipt}` | kontrol paneli yalnızca `receipt` **dizesini** gönderir — tüm doğrulama nesnesi reddedilir |
| anahtar | `POST {AUTH}/tokens` (Bearer `auth_token`) | düz metin anahtar bir kez döndürülür |
| kapı | `POST https://api.llm7.io/v1/chat/completions` | `keys.txt`'ten önce içerikle canlı 200 gerekir |

## ⚙️ CLI seçenekleri

```bash
node src/cli.js --count N        # mint N keys (stop on the first failed chat gate)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --keyless-check  # prove the keyless free set (no Authorization header)
node src/cli.js --screen         # test your exit pool against api.llm7.io
node src/cli.js --help
```

| Bayrak | Anlamı |
| --- | --- |
| `--count N` | üretilecek hesap (= anahtar) sayısı `[1]` |
| `--model <id>` | canlı kapı için kullanılan model `[codestral-latest]` |
| `--pool <file>` | proxy listesi, satır başına bir çıkış `[proxies.txt]` |
| `--verify-only` | `keys.txt` içindeki her anahtarı sohbet kapısından yeniden geçir |
| `--keyless-check` | anahtarsız ücretsiz seti kanıtlar |
| `--screen` | havuzu `api.llm7.io`'ya karşı tarar |
| `--exits N` | vazgeçmeden önce adım başına denenen çıkış sayısı `[6]` |
| `--timeout MS` | istek başına zaman aşımı `[45000]` |

| Ortam değişkeni | Varsayılan | Anlamı |
| --- | --- | --- |
| `LLM7_PROXIES` | `proxies.txt` | çıkış havuzu, proxy başına bir satır — isteğe bağlı: havuz olmadan CLI doğrudan bağlanır |
| `LLM7_MODEL` | `codestral-latest` | canlı doğrulama için model |
| `LLM7_AUTH_BASE` | `https://api-token.llm7.io` | kontrol paneli kimlik doğrulama temeli |
| `LLM7_EV_BASE` | `https://api.llm7.io` | e-posta doğrulama temeli |
| `LLM7_API_BASE` | `https://api.llm7.io/v1` | çıkarım temeli |

## 🛰️ Proxy arkasında

**İsteğe bağlı — ve burada çapraz kontrol edilir, çünkü LLM7 nereden kaydolduğunuz konusunda katıdır.** Araç proxy olmadan da çalışır.

- **Havuzla:** `--pool <file>` geçin (veya `LLM7_PROXIES` ayarlayın); her istek o listeden bir çıkıştan geçer; ölü bir satır o denemeyi başarısız kılar ve CLI bir sonraki çıkışla yeniden dener.
- **Havuz olmadan:** CLI `running WITHOUT a proxy (direct)` yazdırır ve doğrudan bağlanır. Çıkarım, anahtarsız kontrol ve kapı değişmez — yalnızca paketlerin çıktığı çıkış değişir.
- **Bilmeniz gereken 403 uyarısı:** LLM7'nin e-posta doğrulama servisi **IP başına bir politika** uygular ve birçok veri merkezi/ücretsiz çıkış için `403 ip_banned` yanıtı verir (2026-10-23'te onaylanmış havuzun tamamında ölçüldü). `--screen` üzerinde *yeşil* görünen bir havuz (uç nokta erişilebilir) yine de **kayıt için yasaklı** olabilir. Konut tipi çıkışlar kullanın ve üretim adımının reddedildiğinde size tam kodu söylemesini bekleyin.

## 📄 Dosyalar

| Yol | İçerik |
| --- | --- |
| `keys.txt` | satır başına bir canlı doğrulanmış anahtar — git tarafından yok sayılır |
| `accounts.json` | hesap başına e-posta / sub / maskelenmiş anahtar / kapı durumu — git tarafından yok sayılır |
| `proxies.txt` | çıkışlarınız, satır başına bir tane — git tarafından yok sayılır |
| `src/vendor/` | gömülü proxy tünelleme + Emailnator gelen kutusu yardımcısı (harici bağımlılık yok) |

## 🔌 9Router'a bağlanın

[9Router](https://9router.com) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir. Bu sağlayıcıyı bir kez kaydedin ve her anahtar tek bir sağlayıcı düğümü altında bir bağlantı haline gelir:

```bash
node src/connect-9router.js
```

Varsayılanlar: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Modeller daha sonra `llm7/<model id>` olarak sunulur ve her anahtar arasında yük dengelenir.

## 🔌 OmniRoute'a bağlanın

[OmniRoute](https://omniroute.online) kendi kendine barındırılan, OpenAI uyumlu bir yönlendiricidir. Bu sağlayıcıyı bir kez kaydedin ve her anahtar tek bir sağlayıcı düğümü altında bir bağlantı haline gelir:

```bash
node src/connect-omniroute.js
```

Varsayılanlar: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Modeller daha sonra `llm7/<model id>` olarak sunulur ve her anahtar arasında yük dengelenir.

## 🔑 Bir anahtar size ne kazandırır

| | |
| --- | --- |
| 🏢 Sağlayıcı | **LLM7** — [llm7.io](https://llm7.io) |
| 🎁 Sağlayıcının verdikleri | anahtar başına bir hesap — ücretsiz set sohbetle doğrulanır ve ayrıca anahtarsız da yanıt verir |
| 🔑 Bir anahtar size ne kazandırır | kendi hesabına kapsanmış bir API anahtarı: aşağıdaki uç noktadaki 68 model kimliği, planınızın limitlerinde. Kota **hesapta** yaşar, bu aracın anahtar başına bir hesap oluşturmasının nedeni tam da budur |
| 🌐 API şekli | OpenAI uyumlu: `POST https://api.llm7.io/v1/chat/completions` |
| 🔒 Verileriniz | yalnızca llm7.io ve yapılandırdığınız gelen kutusu arka ucuna bağlanılır; anahtarlar makinenizde kalır |

## 🐞 Sorunlar

LLM7 kayıt şeklini, e-posta doğrulama uç noktalarını veya IP politikasını değiştirirse, araç o adımda durur ve tam durumu yazdırır (**örn. `request-code-403-ip_banned`**). Çalıştırdığınız komut ve tam çıktıyla birlikte **[bir sorun açın](../../issues)**; PR'lar memnuniyetle karşılanır.

## 📄 Lisans

MIT © 2026 — bkz. [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 llm7-bulk-apikey katkıda bulunanlar

</div>