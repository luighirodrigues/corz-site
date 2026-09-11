# Site institucional CORZ

Site institucional, blog e painel editorial da CORZ Tecnologia.
Construído sobre a Diretriz Estratégica de Comunicação 2026: a CORZ não
vende tecnologia, responde por **continuidade operacional**.

---

## O que está aqui

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | Next.js 16 (App Router) | Geração estática das páginas públicas + rotas de servidor para o painel, no mesmo projeto |
| Linguagem | TypeScript estrito | — |
| Estilo | Tailwind CSS 4 | Tokens da marca declarados em `@theme`, sem arquivo de configuração |
| Banco | PostgreSQL + Drizzle ORM | Drizzle é TypeScript puro, sem binário nativo: instala por npm em qualquer ambiente e tem cold start menor |
| Sessão | Própria, opaca, no servidor | Revogável na hora — apagar a linha derruba o acesso. Um JWT não permite isso |
| Senha | Argon2id (`@node-rs/argon2`) | Parâmetros conforme recomendação OWASP |
| 2º fator | TOTP (otplib), segredo cifrado em AES-256-GCM | — |
| Rolagem | Lenis | Curva curta (0,95 s), desligada em `prefers-reduced-motion` |

## Estrutura

```
src/
  app/
    (site)/            páginas públicas — todas estáticas
    admin/             painel editorial (login + área autenticada)
    api/               rotas de servidor
    sitemap.ts robots.ts llms.txt/ blog/rss.xml/
  components/
    marca/             logotipo em SVG, traçado do manual da marca
    sistema/           cursor, rolagem, revelação, primitivos
    blocos/            seções reutilizáveis entre páginas
    inicio/            seções exclusivas da home
    admin/             editor de artigos, 2FA, navegação
  conteudo/            copy institucional em TypeScript (site, soluções, FAQ)
  db/                  esquema Drizzle e conexão
  lib/                 auth, cifra, SEO, sanitização, validação
  fontes/              .woff2 auto-hospedados
scripts/               CLI: usuários, semeadura, publicação agendada
drizzle/               migrações SQL versionadas
```

A copy fica em `src/conteudo/` de propósito: alterar um texto institucional
é editar um arquivo de dados, não caçar string dentro de componente.

---

## Rodando localmente

```bash
npm install
cp .env.example .env          # preencha os segredos
npm run db:migrar             # cria as tabelas
npm run semear                # categorias + 3 artigos iniciais
npm run usuario -- criar "Seu Nome" voce@corz.com.br ADMIN
npm run dev
```

O comando `usuario -- criar` imprime uma senha forte gerada na hora.
Entregue por canal seguro e ative o segundo fator no primeiro acesso.

### Variáveis de ambiente

| Variável | Como gerar |
|---|---|
| `DATABASE_URL` | string de conexão do Postgres (use `sslmode=require` em produção) |
| `SESSAO_SEGREDO` | `openssl rand -base64 48` |
| `CIFRA_SEGREDO` | `openssl rand -base64 32` — cifra os segredos TOTP |
| `CRON_SEGREDO` | `openssl rand -base64 32` — protege o endpoint de publicação |
| `NEXT_PUBLIC_SITE_URL` | URL canônica, sem barra final |

Trocar `CIFRA_SEGREDO` invalida os segredos de 2FA já gravados: todos os
usuários precisariam reconfigurar o aplicativo autenticador.

---

## Publicação agendada

O agendamento funciona por dois caminhos independentes, e isso é
intencional:

1. **Consulta pública** — um artigo com status `AGENDADO` cuja hora já
   passou já aparece no site. O blog não espera nenhuma tarefa rodar.
2. **Normalização** — um cron promove o registro para `PUBLICADO` e
   revalida o cache das páginas estáticas.

Escolha um dos dois para o passo 2:

```bash
# Via HTTP (Vercel Cron, GitHub Actions, cron + curl)
curl -H "Authorization: Bearer $CRON_SEGREDO" https://corz.com.br/api/cron/publicar

# Ou direto no banco, por cron do sistema, a cada 5 minutos
cd /caminho/do/site && npm run publicar:agendados
```

Se o cron falhar por uma semana, nada quebra no site — só os registros
ficam com o status desatualizado.

---

## Segurança

- Sessão opaca no servidor, apenas o hash SHA-256 do token no banco.
- Expiração dupla: 8 h de inatividade, 7 dias no total.
- CSRF por double submit em toda rota administrativa que altera estado.
- Limite de tentativas de login por e-mail (6) e por IP (20) a cada 15 min.
- Mensagem única para credencial errada e usuário inexistente, com o mesmo
  custo de tempo — sem oráculo de enumeração de contas.
- HTML de artigo sanitizado no servidor por lista de permissões antes de
  gravar. `iframe` só de players conhecidos.
- Trilha de auditoria com autor, ação, entidade, IP e data.
- Criação de conta apenas por linha de comando: não existe rota web capaz
  de criar um administrador.
- Cabeçalhos: CSP, HSTS, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `X-Content-Type-Options`, COOP.

### Sobre a CSP

A política é dividida por superfície, e vale entender o motivo antes de
mexer:

- **Painel** — `nonce` + `strict-dynamic`. É onde existe sessão
  autenticada e onde um XSS teria consequência real. Essas rotas já são
  dinâmicas, então o nonce não custa nada.
- **Público** — `'self' 'unsafe-inline'` para script. Usar nonce aqui
  obrigaria o Next a renderizar cada página a cada requisição, custando a
  geração estática do site inteiro. O risco é baixo por construção: as
  páginas são HTML estático e todo conteúdo de artigo já foi sanitizado no
  servidor.

Se um dia o site ganhar área logada pública, essa divisão precisa ser
revista.

### Auditoria de dependências

`npm audit` reporta um alerta moderado em `esbuild`, puxado por
`drizzle-kit`. É dependência **de desenvolvimento** e não vai para
produção. Não rode `npm audit fix --force`: ele rebaixa o `drizzle-kit`
para uma versão que não entende este esquema.

---

## SEO e indexação por IA

- Grafo JSON-LD único e conectado por `@id` em cada página
  (`Organization` + `LocalBusiness`, `WebSite`, `WebPage`, `Service`,
  `BlogPosting`, `FAQPage`, `BreadcrumbList`).
- `/llms.txt` — resumo estruturado em markdown para modelos de
  linguagem: posicionamento, serviços, números verificados e FAQ. Quem
  escreve o resumo da empresa é a empresa, não o rastreador.
- `robots.txt` libera explicitamente GPTBot, ClaudeBot, PerplexityBot,
  OAI-SearchBot e afins. Ser citado quando um diretor pergunta a um
  assistente "como reduzir parada de loja" vale mais do que proteger
  texto que já é público.
- Campo **resposta curta** por artigo (40–60 palavras): o trecho
  autossuficiente que buscadores e assistentes citam.
- Construtor de perguntas e respostas no editor, que vira `FAQPage`.
- Sitemap e RSS gerados do banco.
- Fontes auto-hospedadas: nenhuma requisição a servidor de terceiro.

---

## Painel editorial

`/admin` — três papéis:

| Papel | Pode |
|---|---|
| `AUTOR` | escrever e editar os próprios artigos, sempre como rascunho |
| `EDITOR` | publicar, agendar e editar qualquer artigo; ver solicitações |
| `ADMIN` | tudo, mais a lista de usuários |

O editor mostra, enquanto se escreve: contagem de caracteres com o limite
de corte do Google, prévia do resultado de busca e uma lista de pendências
antes de publicar. Arquivar não apaga: o artigo sai do ar e o endereço
continua existindo para quem já linkou.

---

## Design

O sistema visual foi traduzido do deck institucional 2026, não inventado:

- Separação de planos por **tonalidade e fio de 1px**, nunca por sombra
  difusa. Raio pequeno (2–4 px).
- Todo escuro deriva do petróleo `#00304D`. Cinza neutro não existe na
  paleta — é o indício nº 1 de template genérico.
- Dispositivo-assinatura: palavra-chave em **caixa azul sólida**, inline
  com o título.
- Rótulos de seção em monoespaçada, caixa-alta, entrelinha larga.
- Cursor customizado com estados por `data-cursor`
  (`link`, `acao`, `texto`, `midia`, `arrastar`, `externo`, `bloqueado`)
  e rótulo por `data-cursor-rotulo`. Desliga em toque e em
  `prefers-reduced-motion`; campos de texto mantêm o cursor nativo.
- Revelação na rolagem contida (14 px, 0,7 s) e à prova de falha: sem
  JavaScript, nada fica escondido.

### Tipografia

Bricolage Grotesque (títulos) e Manrope (corpo) são auto-hospedadas.
ScaleVF e Final Six, do manual da marca, são comerciais — estão
substituídas por **Archivo** (grotesca variável com eixo de largura) e
**JetBrains Mono** (rótulos técnicos). Se a CORZ tiver as licenças, basta
trocar os dois `.woff2` em `src/fontes/`: as variáveis CSS já estão
desacopladas em `src/lib/fontes.ts`.

---

## Implantação

Qualquer host com Node 20+ e Postgres serve.

```bash
npm ci
npm run db:migrar
npm run build
npm start
```

Checklist antes de ir ao ar:

- [ ] `NEXT_PUBLIC_SITE_URL` apontando para o domínio real
- [ ] Segredos gerados de novo (nenhum valor de desenvolvimento)
- [ ] `DATABASE_URL` com `sslmode=require`
- [ ] Cron de publicação agendada configurado
- [ ] Redirecionamentos 301 das URLs antigas para as novas
- [ ] Sitemap enviado ao Google Search Console
