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

**Crie contas LLM7 em massa com chaves de API geradas automaticamente — inferência compatível com OpenAI, um conjunto gratuito sem chave e conector 9Router.**

[![Node](https://img.shields.io/badge/Node-%E2%89%A518-3DA639?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Dependencies](https://img.shields.io/badge/dependencies-0-blue?style=for-the-badge)](#)
[![License](https://img.shields.io/badge/license-MIT-6ea8fe?style=for-the-badge)](LICENSE)
[![Models](https://img.shields.io/badge/models-68%20served-412991?style=for-the-badge)](https://llm7.io)
[![9Router](https://img.shields.io/badge/9Router-connector-8B5CF6?style=for-the-badge)](#-connect-to-9router)
[![OmniRoute](https://img.shields.io/badge/OmniRoute-connector-8B5CF6?style=for-the-badge)](#-connect-to-omniroute)
[![X](https://img.shields.io/badge/X-%40bigbullapp-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/bigbullapp)

[🛠 Início rápido](#-quick-start) · [🎁 Nível gratuito](#-free-tier--how-much-you-get) · [🤖 Modelos](#-models--all-68-of-them) · [🧪 Use a API](#-how-to-use-the-api) · [✅ Verificado](#-verified-working--every-key-is-tested) · [🧭 Como funciona](#-how-it-works) · [🔌 9Router](#-connect-to-9router) · [🔌 OmniRoute](#-connect-to-omniroute) · [⚙️ Opções](#️-cli-options) · [🛰️ Proxies](#️-behind-a-proxy) · [🐞 Problemas](#-issues)

</div>

<div align="center">

**English** · [Türkçe](README.tr.md) · [中文](README.cn.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Português](README.pt.md)

</div>

---

## ✨ Por que isso existe

LLM7 (`llm7.io`) é um gateway compatível com OpenAI em **`https://api.llm7.io/v1`** que lista 68 ids de modelos. Duas coisas o tornam digno de uma ferramenta em massa: o **conjunto gratuito é verificado ao vivo por chat** (não apenas listado), e os *mesmos* ids gratuitos também respondem a partir de um **portal sem chave** — o endpoint idêntico retorna conteúdo com **nenhum cabeçalho `Authorization`**. O caminho de conta + chave existe para os ids e limites que precisam de uma, então a unidade que escala é **uma conta por chave**, exatamente o que `--count N` cria.

## 🎁 Nível gratuito — quanto você recebe

| O quê | Valor |
| --- | --- |
| Cadastro | endereço de e-mail → código de 6 dígitos → sessão do painel → chave |
| Cartão exigido | **Não** |
| Conjunto gratuito (verificado ao vivo, com chave) | `codestral-latest`, `gpt-oss:20b` |
| Portal sem chave | o **mesmo conjunto gratuito responde sem nenhuma chave de API** — veja `--keyless-check` |
| Catálogo | 68 ids de modelos em `GET https://api.llm7.io/v1/models` |
| A unidade que escala | **uma conta = uma chave** → `--count N` é na verdade "N contas gratuitas" |

> 💡 O nível gratuito é definido pela LLM7 e pode mudar. Confira os números ao vivo em [llm7.io](https://llm7.io) — e deixe o próprio portão da ferramenta decidir:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

## 🤖 Modelos — todos os 68

`GET https://api.llm7.io/v1/models` lista **68 ids**. O conjunto gratuito verificado com uma chamada de chat real (2026-10-23):

| ID do modelo | Verificado |
| --- | --- |
| `codestral-latest` | **200** através do pool de saída — o modelo de portão padrão, no log de portão de `keys.txt` |
| `gpt-oss:20b` | **200** — mesmo endpoint, mesma chave |
| o catálogo restante | mesmo feed `GET /models`, servido por chave/plano |

> ⚠️ Os mesmos dois ids responderam **sem chave** (nenhum cabeçalho `Authorization`) a partir de uma requisição simples para `https://api.llm7.io/v1/chat/completions` — verificado ao vivo em 2026-10-23. Uma contagem impressa aqui é um *tamanho de catálogo*, nunca uma promessa por chave.

## 🧪 Como usar a API

URL base **`https://api.llm7.io/v1`** — compatível com OpenAI.

```bash
curl https://api.llm7.io/v1/chat/completions \
  -H "Authorization: Bearer <your key>" \
  -H "Content-Type: application/json" \
  -d '{"model":"codestral-latest","messages":[{"role":"user","content":"hi"}],"max_tokens":8}'
```

As respostas chegam como JSON simples **ou** como um stream SSE (linhas `text/event-stream`, `data: {...}`) mesmo quando `stream` não está definido — o leitor desta ferramenta aceita ambos, e o seu também deveria.

## 🛠 Início rápido

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

`keys.txt` é escrito **somente** depois que uma conclusão de chat ao vivo comprova a chave. Verifique o conjunto gratuito a qualquer momento com `node src/cli.js --keyless-check`.

### 🖱️ O launcher

O launcher solicita a lista de proxies, a contagem e o modelo de verificação, lembra-os em `launcher.config.json` e executa a CLI com os flags corretos — ele também carrega a verificação sem chave, a tela de saída e o conector 9Router.

## ✅ Verificado e funcionando — toda chave é testada

| Verificação | Resultado |
| --- | --- |
| `GET https://api.llm7.io/v1/models` | **200** — 68 ids |
| `POST /v1/chat/completions` — `codestral-latest`, com chave | **200** com conteúdo real, através do pool de saída |
| `POST /v1/chat/completions` — `gpt-oss:20b`, sem chave | **200** com conteúdo real, sem cabeçalho `Authorization` |
| `POST /v1/chat/completions` — toda chave antes de ser escrita | **200** com conteúdo real |
| uma chave que falha na verificação de chat | nunca escrita em `keys.txt` — a conta permanece em `accounts.json` |

`keys.txt` aqui carrega **3 chaves**; todas as 3 passaram no portão ao vivo (`chat-200` × 2 por chave, mais uma verificação de sanidade de chamada de ferramenta `get_time`) através do pool de saída em 2026-10-23.

> **Bloqueio de escala (medido em 2026-10-23 — leia isto antes de esperar novas chaves).** O próprio serviço de verificação de e-mail da LLM7 atualmente responde **`403 ip_banned`** (`request-code-403-ip_banned`) ou **`verify-403`** para as saídas que este laboratório consegue alcançar, então o caminho de *criação* falha na etapa do código mesmo que o caminho de *inferência* esteja saudável. Isso é uma política de IP do lado do provedor, não um bug nesta ferramenta — a CLI reporta o 403 exato em vez de inventar uma chave. Re-verifique a qualquer momento:

```bash
node src/cli.js --verify-only     # every key in keys.txt is re-tested with a real chat call
```

> **Portões de qualidade.** Toda chave aqui passou por um `chat-200` ao vivo antes de ser escrita em `keys.txt`
> (chaves mortas nunca são enviadas). As combinações de roteador seguem a mesma regra no nível do modelo: uma entrada é
> adicionada **somente se o modelo responder `chat-200` e puder chamar ferramentas** — um modelo sem suporte a ferramentas,
> uma chave morta ou um provedor morto é descartado em vez de adicionado. Re-execute a etapa de verificação a qualquer momento;
> as falhas são reportadas, nunca ocultadas.

## 🧭 Como funciona

```
inbox (one address per account)                                  a fresh address per account
   │
   ├─▶ sign-up: LLM7 page → e-mail address → code / link from the inbox
   ├─▶ session: the account's cookies or access token in hand
   ├─▶ key mint: the account's key endpoint → plaintext key returned once (written to disk immediately)
   └─▶ live proof: POST https://api.llm7.io/v1/chat/completions → real content = the key is live
```

| Etapa | Chamada | Notas |
| --- | --- | --- |
| caixa de correio | Emailnator `POST /api/generate-email` | um endereço gmail novo por conta (helper embutido) |
| elegibilidade | `POST {AUTH}/auth/email/eligibility {email}` | `AUTH=https://api-token.llm7.io`; deve responder `next=email_verification` |
| código | `POST {EV}/v1/email-verifications {email}` | `EV=https://api.llm7.io`; retorna `verification_id`; saídas banidas respondem `403 ip_banned` aqui |
| e-mail | leia o código de 6 dígitos da mesma caixa de entrada | solicitado novamente uma vez em caso de silêncio |
| verificar | `POST {EV}/v1/email-verifications/verify {verification_id,code}` | retorna o `receipt` opaco |
| sessão | `POST {AUTH}/auth/email {receipt}` | o painel envia apenas a **string** `receipt` — o objeto de verificação inteiro é recusado |
| chave | `POST {AUTH}/tokens` (Bearer `auth_token`) | chave em texto simples retornada uma vez |
| portão | `POST https://api.llm7.io/v1/chat/completions` | 200 ao vivo com conteúdo exigido antes de `keys.txt` |

## ⚙️ Opções da CLI

```bash
node src/cli.js --count N        # mint N keys (stop on the first failed chat gate)
node src/cli.js --verify-only    # re-check every key in keys.txt
node src/cli.js --keyless-check  # prove the keyless free set (no Authorization header)
node src/cli.js --screen         # test your exit pool against api.llm7.io
node src/cli.js --help
```

| Flag | Significado |
| --- | --- |
| `--count N` | contas (= chaves) a criar `[1]` |
| `--model <id>` | modelo usado para o portão ao vivo `[codestral-latest]` |
| `--pool <file>` | lista de proxies, uma saída por linha `[proxies.txt]` |
| `--verify-only` | re-executa toda chave em `keys.txt` através do portão de chat |
| `--keyless-check` | comprova o conjunto gratuito sem chave |
| `--screen` | testa o pool contra `api.llm7.io` |
| `--tries N` | saídas tentadas por etapa antes de desistir `[4]` |
| `--timeout MS` | timeout por requisição `[45000]` |

| Variável de ambiente | Padrão | Significado |
| --- | --- | --- |
| `LLM7_PROXIES` | `proxies.txt` | pool de saída, uma linha por proxy — opcional: sem um pool a CLI conecta diretamente |
| `LLM7_MODEL` | `codestral-latest` | modelo para a verificação ao vivo |
| `LLM7_AUTH_BASE` | `https://api-token.llm7.io` | base de autenticação do painel |
| `LLM7_EV_BASE` | `https://api.llm7.io` | base de verificação de e-mail |
| `LLM7_API_BASE` | `https://api.llm7.io/v1` | base de inferência |

## 🛰️ Atrás de um proxy

**Opcional — e verificado aqui, porque a LLM7 é rigorosa quanto ao local de onde você se cadastra.** A ferramenta também funciona sem proxy.

- **Com um pool:** passe `--pool <file>` (ou defina `LLM7_PROXIES`) e toda requisição passa por uma saída dessa lista; uma linha morta falha naquela tentativa e a CLI tenta novamente com a próxima saída.
- **Sem um pool:** a CLI imprime `running WITHOUT a proxy (direct)` e conecta diretamente. A inferência, a verificação sem chave e o portão permanecem inalterados — apenas a saída de onde os pacotes partem.
- **A ressalva do 403 que você precisa conhecer:** o serviço de verificação de e-mail da LLM7 impõe uma **política por IP** e responde `403 ip_banned` para muitas saídas de datacenter/gratuitas (medido em todo o pool sancionado, 2026-10-23). Um pool que passa *verde* em `--screen` (o endpoint é alcançável) ainda pode estar **banido para cadastro**. Use saídas do tipo residencial e espere que a etapa de criação informe o código exato quando for recusada.

## 📄 Arquivos

| Caminho | Conteúdo |
| --- | --- |
| `keys.txt` | uma chave verificada ao vivo por linha — ignorado pelo git |
| `accounts.json` | e-mail / sub / chave mascarada / status do portão por conta — ignorado pelo git |
| `proxies.txt` | suas saídas, uma por linha — ignorado pelo git |
| `src/vendor/` | tunelamento de proxy embutido + helper de caixa de entrada Emailnator (sem dependências externas) |

## 🔌 Conectar ao 9Router

[9Router](https://9router.com) é um roteador auto-hospedado e compatível com OpenAI. Registre este provedor uma vez e toda chave se torna uma conexão sob um nó de provedor:

```bash
node src/connect-9router.js
```

Padrões: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Os modelos são então servidos como `llm7/<model id>` e balanceados entre todas as chaves.

## 🔌 Conectar ao OmniRoute

[OmniRoute](https://omniroute.online) é um roteador auto-hospedado e compatível com OpenAI. Registre este provedor uma vez e toda chave se torna uma conexão sob um nó de provedor:

```bash
node src/connect-omniroute.js
```

Padrões: `--base http://localhost:20128`, `--password 123456`, `--name "LLM7"`, `--prefix llm7`, `--base-url https://api.llm7.io/v1`. Os modelos são então servidos como `llm7/<model id>` e balanceados entre todas as chaves.

## 🔑 O que uma chave lhe dá

| | |
| --- | --- |
| 🏢 Provedor | **LLM7** — [llm7.io](https://llm7.io) |
| 🎁 O que o provedor oferece | uma conta por chave — o conjunto gratuito é verificado por chat e também responde sem chave |
| 🔑 O que uma chave lhe dá | uma chave de API limitada à sua própria conta: os 68 ids de modelos no endpoint abaixo, nos limites do seu plano. A cota fica na **conta**, que é exatamente por que esta ferramenta cria uma conta por chave |
| 🌐 Formato da API | Compatível com OpenAI: `POST https://api.llm7.io/v1/chat/completions` |
| 🔒 Seus dados | apenas llm7.io e o backend de caixa de entrada que você configurar são contatados; as chaves permanecem na sua máquina |

## 🐞 Problemas

Se a LLM7 mudar o formato do cadastro, os endpoints de verificação de e-mail ou sua política de IP, a ferramenta para nessa etapa e imprime o status exato (**por exemplo, `request-code-403-ip_banned`**). **[Abra uma issue](../../issues)** com o comando que você executou e a saída exata; PRs são bem-vindos.

## 📄 Licença

MIT © 2026 — veja [LICENSE](LICENSE).

<div align="center">

**[MIT](LICENSE)** © 2026 llm7-bulk-apikey contributors

</div>