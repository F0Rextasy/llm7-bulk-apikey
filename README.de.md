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

**LLM7-Konten in großen Mengen erstellen mit automatisch generierten API-Schlüsseln — OpenAI-kompatible Inferenz, ein schlüsselloses kostenloses Set, + 9Router-Konnektor.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-68%20served-412991?style=for-the-badge)](https://llm7.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Schnellstart](#-quick-start) · [🎁 Kostenlose Stufe](#-free-tier--how-much-you-get) · [🤖 Modelle](#-models--all-68-of-them) · [🧪 Die API verwenden](#-how-to-use-the-api) · [✅ Verifiziert](#-verified-working--every-key-is-tested) · [🧭 So funktioniert es](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Optionen](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Probleme](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Warum es das gibt

LLM7 (`llm7.io`) ist ein OpenAI-kompatibles Gateway unter **`https://api.llm7.io/v1`**, das 68 Modell-IDs auflistet. Zwei Dinge machen es ein Massenwerkzeug wert: Das **kostenlose Set ist live per Chat verifiziert** (nicht nur aufgelistet), und die *gleichen* kostenlosen IDs antworten auch von einem **schlüssellosen Portal** — derselbe Endpunkt liefert Inhalte mit **überhaupt keinem `Authorization`-Header**. Der Konto-+-Schlüssel-Pfad existiert für die IDs und Limits, die einen benötigen, also ist die Einheit, die skaliert, **ein Konto pro Schlüssel** — genau das, was `--count N` erzeugt.

## 🎁 Kostenlose Stufe — wie viel du bekommst

| Was | Wert |
| --- | --- |
| Anmeldung | E-Mail-Adresse → 6-stelliger Code → Dashboard-Sitzung → Schlüssel |
| Karte erforderlich | **Nein** |
| Kostenloses Set (live verifiziert, mit Schlüssel) | `codestral-latest`, `gpt-oss:20b` |
| Schlüsselloses Portal | das **gleiche kostenlose Set antwortet ohne API-Schlüssel** — siehe `--keyless-check` |
| Katalog | 68 Modell-IDs bei `GET https://api.llm7.io/v1/models` |
| Die Einheit, die skaliert | **ein Konto = ein Schlüssel** → `--count N` bedeutet wirklich „N kostenlose Konten" |

> 💡 Die kostenlose Stufe wird von LLM7 festgelegt und kann sich ändern. Prüfe die Live-Zahlen unter [llm7.io](https://llm7.io) — und lass das eigene Gate des Tools entscheiden:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelle — alle 68 davon

`GET https://api.llm7.io/v1/models` listet **68 IDs**. Das kostenlose Set, verifiziert mit einem echten Chat-Aufruf (2026-10-23):

| Modell-ID | Verifiziert |
| --- | --- |
| `codestral-latest` | **200** durch den Exit-Pool — das Standard-Gate-Modell, im Gate-Log von `keys.txt` |
| `gpt-oss:20b` | **200** — gleicher Endpunkt, gleicher Schlüssel |
| der restliche Katalog | derselbe `GET /models`-Feed, pro Schlüssel/Plan bereitgestellt |

> ⚠️ Dieselben zwei IDs antworteten **schlüssellos** (kein `Authorization`-Header) auf eine einfache Anfrage an `https://api.llm7.io/v1/chat/completions` — live verifiziert am 2026-10-23. Eine hier angegebene Zahl ist eine *Kataloggröße*, niemals ein Versprechen pro Schlüssel.

## 🧪 So verwendest du die API

Basis-URL **`https://api.llm7.io/v1`** — OpenAI-kompatibel.

```bash
curl https://api.llm7.io/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"codestral-latest","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Antworten kommen als einfaches JSON **oder** als SSE-Stream (`text/event-stream`, `data: {...}`-Zeilen), selbst wenn `stream` nicht gesetzt ist — der Reader dieses Tools akzeptiert beides, und deiner sollte das auch tun.

## 🛠 Schnellstart

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

`keys.txt` wird **nur** geschrieben, nachdem eine Live-Chat-Vervollständigung den Schlüssel beweist. Prüfe das kostenlose Set jederzeit mit `node src/cli.js --keyless-check`.

### 🖱️ Der Launcher

Der Launcher fragt nach der Proxy-Liste, Anzahl und Verifizierungsmodell, merkt sie sich in `launcher.config.json` und führt die CLI mit den richtigen Flags aus — er enthält auch den schlüssellosen Check, den Exit-Bildschirm und den 9Router-Konnektor.

## ✅ Verifiziert funktionierend — jeder Schlüssel wird getestet

| Prüfung | Ergebnis |
| --- | --- |
| `GET https://api.llm7.io/v1/models` | **200** — 68 IDs |
| `POST /v1/chat/completions` — `codestral-latest`, mit Schlüssel | **200** mit echtem Inhalt, durch den Exit-Pool |
| `POST /v1/chat/completions` — `gpt-oss:20b`, schlüssellos | **200** mit echtem Inhalt, kein `Authorization`-Header |
| `POST /v1/chat/completions` — jeder Schlüssel, bevor er geschrieben wird | **200** mit echtem Inhalt |
| ein Schlüssel, der seine Chat-Prüfung nicht besteht | wird nie in `keys.txt` geschrieben — das Konto bleibt in `accounts.json` |

`keys.txt` enthält hier **3 Schlüssel**; alle 3 bestanden das Live-Gate (`chat-200` × 2 pro Schlüssel, plus eine Tool-Call-`get_time`-Plausibilitätsprüfung) durch den Exit-Pool am 2026-10-23.

> **Skalierungsblocker (gemessen am 2026-10-23 — lies das, bevor du neue Schlüssel erwartest).** Der eigene E-Mail-Verifizierungsdienst von LLM7 antwortet derzeit mit **`403 ip_banned`** (`request-code-403-ip_banned`) oder **`verify-403`** für die Exits, die dieses Lab erreichen kann, sodass der *Erzeugungs*-Pfad beim Code-Schritt fehlschlägt, obwohl der *Inferenz*-Pfad gesund ist. Das ist eine IP-Richtlinie auf Anbieterseite, kein Fehler in diesem Tool — die CLI meldet den exakten 403, statt einen Schlüssel zu erfinden. Jederzeit erneut prüfen:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

> **Qualitätsgates.** Jeder Schlüssel hier bestand ein Live-`chat-200`, bevor er in `keys.txt` geschrieben wurde
> (tote Schlüssel werden nie ausgeliefert). Router-Kombinationen folgen derselben Regel auf Modellebene: Ein Eintrag wird
> **nur hinzugefügt, wenn das Modell `chat-200` antwortet und Tools aufrufen kann** — ein Modell ohne Tool-Unterstützung,
> ein toter Schlüssel oder ein toter Anbieter wird verworfen statt hinzugefügt. Führe den Verifizierungsschritt jederzeit erneut aus;
> Fehler werden gemeldet, nie versteckt.

## 🧭 So funktioniert es

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: LLM7 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.llm7.io/v1/chat/completions → real content = the key is live
```

| Schritt | Aufruf | Hinweise |
| --- | --- | --- |
| Postfach | Emailnator `POST /api/generate-email` | eine frische Gmail-Adresse pro Konto (gebündelter Helfer) |
| Berechtigung | `POST {AUTH}/auth/email/eligibility {email}` | `AUTH=https://api-token.llm7.io`; muss `next=email_verification` antworten |
| Code | `POST {EV}/v1/email-verifications {email}` | `EV=https://api.llm7.io`; gibt `verification_id` zurück; gebannte Exits antworten hier mit `403 ip_banned` |
| Mail | den 6-stelligen Code aus demselben Postfach lesen | bei Stille einmal erneut angefordert |
| Verifizieren | `POST {EV}/v1/email-verifications/verify {verification_id,code}` | gibt das undurchsichtige `receipt` zurück |
| Sitzung | `POST {AUTH}/auth/email {receipt}` | das Dashboard sendet nur den `receipt`-**String** — das ganze Verify-Objekt wird abgelehnt |
| Schlüssel | `POST {AUTH}/tokens` (Bearer `auth_token`) | Klartext-Schlüssel wird einmal zurückgegeben |
| Gate | `POST https://api.llm7.io/v1/chat/completions` | Live-200 mit Inhalt erforderlich, bevor `keys.txt` |

## ⚙️ CLI-Optionen

```bash
node src/cli.js --count N        # mint N keys (stop on the first failed chat gate)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --keyless-check  # prove the keyless free set (no Authorization header)
node src/cli.js --screen         # test your exit pool against api.llm7.io
node src/cli.js --help
```

| Flag | Bedeutung |
| --- | --- |
| `--count N` | Konten (= Schlüssel), die erzeugt werden sollen `[1]` |
| `--model <id>` | Modell, das für das Live-Gate verwendet wird `[codestral-latest]` |
| `--pool <file>` | Proxy-Liste, ein Exit pro Zeile `[proxies.txt]` |
| `--verify-only` | jeden Schlüssel in `keys.txt` erneut durch das Chat-Gate laufen lassen |
| `--keyless-check` | beweist das schlüssellose kostenlose Set |
| `--screen` | prüft den Pool gegen `api.llm7.io` |
| `--exits N` | Exits, die pro Schritt versucht werden, bevor aufgegeben wird `[6]` |
| `--timeout MS` | Timeout pro Anfrage `[45000]` |

| Umgebungsvariable | Standard | Bedeutung |
| --- | --- | --- |
| `LLM7_PROXIES` | `proxies.txt` | Exit-Pool, eine Zeile pro Proxy — optional: ohne Pool verbindet sich die CLI direkt |
| `LLM7_MODEL` | `codestral-latest` | Modell für die Live-Verifizierung |
| `LLM7_AUTH_BASE` | `https://api-token.llm7.io` | Dashboard-Auth-Basis |
| `LLM7_EV_BASE` | `https://api.llm7.io` | E-Mail-Verifizierungs-Basis |
| `LLM7_API_BASE` | `https://api.llm7.io/v1` | Inferenz-Basis |

## 🛰️ Hinter einem Proxy

**Optional — und hier gegengeprüft, weil LLM7 streng damit ist, von wo aus du dich anmeldest.** Das Tool funktioniert auch ohne Proxy.

- **Mit einem Pool:** übergib `--pool <file>` (oder setze `LLM7_PROXIES`), und jede Anfrage geht durch einen Exit aus dieser Liste; eine tote Zeile lässt diesen Versuch fehlschlagen, und die CLI versucht es mit dem nächsten Exit erneut.
- **Ohne einen Pool:** die CLI gibt `running WITHOUT a proxy (direct)` aus und verbindet sich direkt. Inferenz, der schlüssellose Check und das Gate bleiben unverändert — nur der Exit, von dem die Pakete ausgehen.
- **Der 403-Vorbehalt, den du kennen musst:** Der E-Mail-Verifizierungsdienst von LLM7 erzwingt eine **IP-Richtlinie** und antwortet mit `403 ip_banned` für viele Datacenter-/kostenlose Exits (gemessen am gesamten sanktionierten Pool, 2026-10-23). Ein Pool, der bei `--screen` *grün* abschneidet (der Endpunkt ist erreichbar), kann trotzdem **für die Anmeldung gebannt** sein. Verwende Exits im Residential-Stil und erwarte, dass der Erzeugungsschritt dir den exakten Code nennt, wenn er abgelehnt wird.

## 📄 Dateien

| Pfad | Inhalt |
| --- | --- |
| `keys.txt` | ein live-verifizierter Schlüssel pro Zeile — von Git ignoriert |
| `accounts.json` | E-Mail / Sub / maskierter Schlüssel / Gate-Status pro Konto — von Git ignoriert |
| `proxies.txt` | deine Exits, einer pro Zeile — von Git ignoriert |
| `src/vendor/` | gebündeltes Proxy-Tunneling + Emailnator-Postfach-Helfer (keine externen Abhängigkeiten) |

## 🔌 Mit 9Router verbinden

[9Router](https://9router.com) ist ein selbst gehosteter, OpenAI-kompatibler Router. Registriere diesen Anbieter einmal, und jeder Schlüssel wird zu einer Verbindung unter einem Anbieter-Node:

```bash
node src/connect-9router.js
```

Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Modelle werden dann als `llm7/<model id>` bereitgestellt und über jeden Schlüssel lastverteilt.

## 🔌 Mit OmniRoute verbinden

[OmniRoute](https://omniroute.online) ist ein selbst gehosteter, OpenAI-kompatibler Router. Registriere diesen Anbieter einmal, und jeder Schlüssel wird zu einer Verbindung unter einem Anbieter-Node:

```bash
node src/connect-omniroute.js
```

Standardwerte: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Modelle werden dann als `llm7/<model id>` bereitgestellt und über jeden Schlüssel lastverteilt.

## 🔑 Was ein Schlüssel dir bringt

| | |
| --- | --- |
| 🏢 Anbieter | **LLM7** — [llm7.io](https://llm7.io) |
| 🎁 Was der Anbieter gibt | ein Konto pro Schlüssel — das kostenlose Set ist per Chat verifiziert und antwortet auch schlüssellos |
| 🔑 Was ein Schlüssel dir bringt | einen API-Schlüssel, der auf sein eigenes Konto beschränkt ist: die 68 Modell-IDs am unten stehenden Endpunkt, zu den Limits deines Plans. Das Kontingent liegt beim **Konto**, weshalb dieses Tool genau ein Konto pro Schlüssel erstellt |
| 🌐 API-Form | OpenAI-kompatibel: `POST https://api.llm7.io/v1/chat/completions` |
| 🔒 Deine Daten | nur llm7.io und das von dir konfigurierte Postfach-Backend werden kontaktiert; Schlüssel bleiben auf deinem Rechner |

## 🐞 Probleme

Wenn LLM7 seine Anmeldeform, seine E-Mail-Verifizierungsendpunkte oder seine IP-Richtlinie ändert, stoppt das Tool an diesem Schritt und gibt den exakten Status aus (**z. B. `request-code-403-ip_banned`**). **[Öffne ein Issue](../../issues)** mit dem ausgeführten Befehl und der exakten Ausgabe; PRs sind willkommen.

## 📄 Lizenz

MIT © 2026 — siehe [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 llm7-bulk-apikey contributors

</div>