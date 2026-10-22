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

**Créez en masse des comptes LLM7 avec des clés API générées automatiquement — inférence compatible OpenAI, un ensemble gratuit sans clé, + connecteur 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-68%20served-412991?style=for-the-badge)](https://llm7.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Démarrage rapide](#-quick-start) · [🎁 Niveau gratuit](#-free-tier--how-much-you-get) · [🤖 Modèles](#-models--all-68-of-them) · [🧪 Utiliser l'API](#-how-to-use-the-api) · [✅ Vérifié](#-verified-working--every-key-is-tested) · [🧭 Comment ça marche](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Options](#️-cli-options) · [🛰️ Proxys](#️-behind-a-proxy) · [🐞 Problèmes](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Pourquoi cet outil existe

LLM7 (`llm7.io`) est une passerelle compatible OpenAI à l'adresse **`https://api.llm7.io/v1`** qui répertorie 68 identifiants de modèles. Deux choses en font un bon candidat pour un outil en masse : l'**ensemble gratuit est vérifié en direct par chat** (pas seulement listé), et les *mêmes* identifiants gratuits répondent aussi depuis un **portail sans clé** — le point de terminaison identique renvoie du contenu **sans aucun en-tête `Authorization`**. Le chemin compte + clé existe pour les identifiants et les limites qui en ont besoin, donc l'unité qui passe à l'échelle est **un compte par clé**, exactement ce que `--count N` génère.

## 🎁 Niveau gratuit — ce que vous obtenez

| Quoi | Valeur |
| --- | --- |
| Inscription | adresse e-mail → code à 6 chiffres → session du tableau de bord → clé |
| Carte requise | **Non** |
| Ensemble gratuit (vérifié en direct, avec clé) | `codestral-latest`, `gpt-oss:20b` |
| Portail sans clé | le **même ensemble gratuit répond sans clé API** — voir `--keyless-check` |
| Catalogue | 68 identifiants de modèles sur `GET https://api.llm7.io/v1/models` |
| L'unité qui passe à l'échelle | **un compte = une clé** → `--count N` signifie en réalité « N comptes gratuits » |

> 💡 Le niveau gratuit est défini par LLM7 et peut changer. Consultez les chiffres en direct sur [llm7.io](https://llm7.io) — et laissez la porte de l'outil décider :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modèles — les 68

`GET https://api.llm7.io/v1/models` répertorie **68 identifiants**. L'ensemble gratuit vérifié avec un véritable appel de chat (2026-10-23) :

| Identifiant du modèle | Vérifié |
| --- | --- |
| `codestral-latest` | **200** via le pool de sortie — le modèle de porte par défaut, dans le journal de porte de `keys.txt` |
| `gpt-oss:20b` | **200** — même point de terminaison, même clé |
| le reste du catalogue | même flux `GET /models`, servi par clé/forfait |

> ⚠️ Les deux mêmes identifiants ont répondu **sans clé** (aucun en-tête `Authorization`) à une simple requête vers `https://api.llm7.io/v1/chat/completions` — vérifié en direct le 2026-10-23. Un nombre affiché ici est une *taille de catalogue*, jamais une promesse par clé.

## 🧪 Comment utiliser l'API

URL de base **`https://api.llm7.io/v1`** — compatible OpenAI.

```bash
curl https://api.llm7.io/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"codestral-latest","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

Les réponses arrivent en JSON brut **ou** en flux SSE (lignes `text/event-stream`, `data: {...}`) même lorsque `stream` n'est pas défini — le lecteur de cet outil accepte les deux, et le vôtre devrait aussi.

## 🛠 Démarrage rapide

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

`keys.txt` n'est écrit **qu'** après qu'une complétion de chat en direct a prouvé la clé. Vérifiez l'ensemble gratuit à tout moment avec `node src/cli.js --keyless-check`.

### 🖱️ Le lanceur

Le lanceur demande la liste de proxys, le nombre et le modèle de vérification, les mémorise dans `launcher.config.json`, et exécute la CLI avec les bons drapeaux — il intègre aussi la vérification sans clé, l'écran de sortie et le connecteur 9Router.

## ✅ Vérifié fonctionnel — chaque clé est testée

| Vérification | Résultat |
| --- | --- |
| `GET https://api.llm7.io/v1/models` | **200** — 68 identifiants |
| `POST /v1/chat/completions` — `codestral-latest`, avec clé | **200** avec du contenu réel, via le pool de sortie |
| `POST /v1/chat/completions` — `gpt-oss:20b`, sans clé | **200** avec du contenu réel, sans en-tête `Authorization` |
| `POST /v1/chat/completions` — chaque clé avant son écriture | **200** avec du contenu réel |
| une clé qui échoue à sa vérification de chat | jamais écrite dans `keys.txt` — le compte reste dans `accounts.json` |

`keys.txt` contient ici **3 clés** ; les 3 ont passé la porte en direct (`chat-200` × 2 par clé, plus une vérification de bon sens d'appel d'outil `get_time`) via le pool de sortie le 2026-10-23.

> **Blocage de mise à l'échelle (mesuré le 2026-10-23 — à lire avant d'attendre de nouvelles clés).** Le service de vérification par e-mail de LLM7 répond actuellement **`403 ip_banned`** (`request-code-403-ip_banned`) ou **`verify-403`** pour les sorties que ce labo peut atteindre, donc le chemin de *création* échoue à l'étape du code même si le chemin d'*inférence* est sain. Il s'agit d'une politique d'IP côté fournisseur, pas d'un bug de cet outil — la CLI signale le 403 exact au lieu d'inventer une clé. Revérifiez à tout moment :

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

> **Portes de qualité.** Chaque clé ici a passé un `chat-200` en direct avant d'être écrite dans `keys.txt`
> (les clés mortes ne sont jamais livrées). Les combinaisons de routeur suivent la même règle au niveau du modèle : une entrée est
> ajoutée **uniquement si le modèle répond `chat-200` et peut appeler des outils** — un modèle sans prise en charge des outils,
> une clé morte ou un fournisseur mort est écarté au lieu d'être ajouté. Relancez l'étape de vérification à tout moment ;
> les échecs sont signalés, jamais cachés.

## 🧭 Comment ça marche

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: LLM7 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.llm7.io/v1/chat/completions → real content = the key is live
```

| Étape | Appel | Remarques |
| --- | --- | --- |
| boîte mail | Emailnator `POST /api/generate-email` | une adresse gmail fraîche par compte (helper vendu) |
| éligibilité | `POST {AUTH}/auth/email/eligibility {email}` | `AUTH=https://api-token.llm7.io` ; doit répondre `next=email_verification` |
| code | `POST {EV}/v1/email-verifications {email}` | `EV=https://api.llm7.io` ; renvoie `verification_id` ; les sorties bannies répondent `403 ip_banned` ici |
| mail | lire le code à 6 chiffres depuis la même boîte mail | redemandé une fois en cas de silence |
| vérification | `POST {EV}/v1/email-verifications/verify {verification_id,code}` | renvoie le `receipt` opaque |
| session | `POST {AUTH}/auth/email {receipt}` | le tableau de bord ne poste que la **chaîne** `receipt` — l'objet verify entier est refusé |
| clé | `POST {AUTH}/tokens` (Bearer `auth_token`) | clé en clair renvoyée une fois |
| porte | `POST https://api.llm7.io/v1/chat/completions` | un 200 en direct avec contenu requis avant `keys.txt` |

## ⚙️ Options de la CLI

```bash
node src/cli.js --count N        # mint N keys (stop on the first failed chat gate)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --keyless-check  # prove the keyless free set (no Authorization header)
node src/cli.js --screen         # test your exit pool against api.llm7.io
node src/cli.js --help
```

| Drapeau | Signification |
| --- | --- |
| `--count N` | comptes (= clés) à créer `[1]` |
| `--model <id>` | modèle utilisé pour la porte en direct `[codestral-latest]` |
| `--pool <file>` | liste de proxys, une sortie par ligne `[proxies.txt]` |
| `--verify-only` | relancer chaque clé de `keys.txt` via la porte de chat |
| `--keyless-check` | prouve l'ensemble gratuit sans clé |
| `--screen` | teste le pool contre `api.llm7.io` |
| `--tries N` | sorties essayées par étape avant d'abandonner `[4]` |
| `--timeout MS` | délai d'expiration par requête `[45000]` |

| Variable d'environnement | Valeur par défaut | Signification |
| --- | --- | --- |
| `LLM7_PROXIES` | `proxies.txt` | pool de sortie, une ligne par proxy — facultatif : sans pool, la CLI se connecte directement |
| `LLM7_MODEL` | `codestral-latest` | modèle pour la vérification en direct |
| `LLM7_AUTH_BASE` | `https://api-token.llm7.io` | base d'authentification du tableau de bord |
| `LLM7_EV_BASE` | `https://api.llm7.io` | base de vérification par e-mail |
| `LLM7_API_BASE` | `https://api.llm7.io/v1` | base d'inférence |

## 🛰️ Derrière un proxy

**Facultatif — et recoupé ici, car LLM7 est strict sur le lieu d'inscription.** L'outil fonctionne aussi sans proxy.

- **Avec un pool :** passez `--pool <file>` (ou définissez `LLM7_PROXIES`) et chaque requête passe par une sortie de cette liste ; une ligne morte fait échouer cette tentative et la CLI réessaie avec la sortie suivante.
- **Sans pool :** la CLI affiche `running WITHOUT a proxy (direct)` et se connecte directement. L'inférence, la vérification sans clé et la porte sont inchangées — seul change l'endroit d'où partent les paquets.
- **La mise en garde 403 que vous devez connaître :** le service de vérification par e-mail de LLM7 applique une **politique par IP** et répond `403 ip_banned` pour de nombreuses sorties datacenter/gratuites (mesuré sur tout le pool autorisé, 2026-10-23). Un pool qui passe au *vert* sur `--screen` (le point de terminaison est joignable) peut quand même être **banni pour l'inscription**. Utilisez des sorties de type résidentiel, et attendez-vous à ce que l'étape de création vous indique le code exact lorsqu'elle est refusée.

## 📄 Fichiers

| Chemin | Contenu |
| --- | --- |
| `keys.txt` | une clé vérifiée en direct par ligne — ignoré par git |
| `accounts.json` | email / sub / clé masquée / statut de porte par compte — ignoré par git |
| `proxies.txt` | vos sorties, une par ligne — ignoré par git |
| `src/vendor/` | tunnellisation proxy vendue + helper de boîte mail Emailnator (aucune dépendance externe) |

## 🔌 Connexion à 9Router

[9Router](https://9router.com) est un routeur auto-hébergé compatible OpenAI. Enregistrez ce fournisseur une fois et chaque clé devient une connexion sous un seul nœud fournisseur :

```bash
node src/connect-9router.js
```

Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Les modèles sont alors servis sous `llm7/<model id>` et répartis sur toutes les clés.

## 🔌 Connexion à OmniRoute

[OmniRoute](https://omniroute.online) est un routeur auto-hébergé compatible OpenAI. Enregistrez ce fournisseur une fois et chaque clé devient une connexion sous un seul nœud fournisseur :

```bash
node src/connect-omniroute.js
```

Valeurs par défaut : `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Les modèles sont alors servis sous `llm7/<model id>` et répartis sur toutes les clés.

## 🔑 Ce qu'une clé vous apporte

| | |
| --- | --- |
| 🏢 Fournisseur | **LLM7** — [llm7.io](https://llm7.io) |
| 🎁 Ce que le fournisseur donne | un compte par clé — l'ensemble gratuit est vérifié par chat, et il répond aussi sans clé |
| 🔑 Ce qu'une clé vous apporte | une clé API limitée à son propre compte : les 68 identifiants de modèles sur le point de terminaison ci-dessous, aux limites de votre forfait. Le quota vit sur le **compte**, ce qui explique précisément pourquoi cet outil crée un compte par clé |
| 🌐 Forme de l'API | compatible OpenAI : `POST https://api.llm7.io/v1/chat/completions` |
| 🔒 Vos données | seuls llm7.io et le backend de boîte mail que vous configurez sont contactés ; les clés restent sur votre machine |

## 🐞 Problèmes

Si LLM7 modifie la forme de son inscription, ses points de terminaison de vérification par e-mail ou sa politique d'IP, l'outil s'arrête à cette étape et affiche le statut exact (**par ex. `request-code-403-ip_banned`**). **[Ouvrez un ticket](../../issues)** avec la commande que vous avez exécutée et la sortie exacte ; les PR sont bienvenues.

## 📄 Licence

MIT © 2026 — voir [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 llm7-bulk-apikey contributors

</div>