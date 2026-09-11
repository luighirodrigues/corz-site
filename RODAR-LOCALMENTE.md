# Como rodar o site na sua máquina

Guia para Windows. São 5 passos, uns 15 minutos na primeira vez.

---

## Passo 1 — Instalar o Node.js

Baixe a versão **LTS** em [nodejs.org](https://nodejs.org) e instale
(pode clicar em "próximo" em tudo).

Para conferir, abra o **PowerShell** e rode:

```powershell
node -v
```

Precisa aparecer `v20` ou maior. Se aparecer erro, feche e reabra o
PowerShell — o instalador só passa a valer numa janela nova.

---

## Passo 2 — Ter um banco PostgreSQL

Escolha **um** dos dois caminhos.

### Caminho A — Banco na nuvem (recomendado para começar)

Não instala nada e leva 2 minutos.

1. Crie conta grátis em [neon.com](https://neon.com) (ou
   [supabase.com](https://supabase.com))
2. Crie um projeto — pode chamar de `corz`
3. Copie a **connection string**. Ela se parece com:
   `postgresql://usuario:senha@ep-algo.neon.tech/neondb?sslmode=require`

Guarde essa linha, você vai usar no passo 4.

### Caminho B — PostgreSQL na sua máquina

1. Baixe em
   [postgresql.org/download/windows](https://www.postgresql.org/download/windows/)
2. Durante a instalação, **anote a senha** que você definir para o
   usuário `postgres`
3. Ao final, abra o **pgAdmin** (vem junto) e crie um banco chamado
   `corz`

Sua connection string fica:
`postgresql://postgres:SUA_SENHA@localhost:5432/corz`

---

## Passo 3 — Abrir o projeto

Descompacte o `site-corz.zip`. Vai aparecer uma pasta `corz`.

Coloque em um caminho **sem OneDrive e sem espaços**, por exemplo
`C:\projetos\corz`. O OneDrive tenta sincronizar as milhares de pastas do
`node_modules` e deixa tudo lento.

Abra o PowerShell nessa pasta:

```powershell
cd C:\projetos\corz
npm install
```

Demora uns 2 minutos na primeira vez.

---

## Passo 4 — Criar o arquivo de configuração

Ainda no PowerShell, gere os três segredos:

```powershell
node -e "const c=require('crypto');console.log('SESSAO_SEGREDO=\"'+c.randomBytes(48).toString('base64')+'\"');console.log('CIFRA_SEGREDO=\"'+c.randomBytes(32).toString('base64')+'\"');console.log('CRON_SEGREDO=\"'+c.randomBytes(32).toString('base64')+'\"')"
```

Ele imprime três linhas. Agora crie um arquivo chamado **`.env`** dentro
da pasta `corz` (sim, começa com ponto e não tem extensão) com este
conteúdo:

```
DATABASE_URL="cole aqui a connection string do passo 2"
SESSAO_SEGREDO="cole a primeira linha gerada"
CIFRA_SEGREDO="cole a segunda linha gerada"
CRON_SEGREDO="cole a terceira linha gerada"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

> Se o Bloco de Notas não deixar salvar como `.env`, escolha
> "Todos os arquivos" no tipo e coloque o nome entre aspas: `".env"`.
> Ou use o VS Code, que não implica.

---

## Passo 5 — Preparar o banco e subir

Três comandos, um de cada vez:

```powershell
npm run db:migrar
```
Cria as tabelas.

```powershell
npm run semear
```
Cria as categorias do blog e os 3 artigos iniciais.

```powershell
npm run usuario -- criar "Luiz Schorn Coimbra" luiz@corz.com.br ADMIN
```
Cria seu acesso ao painel. **Copie a senha que aparecer na tela** — ela
só é mostrada uma vez.

Agora suba o site:

```powershell
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). O painel fica em
[http://localhost:3000/admin](http://localhost:3000/admin).

Para parar, aperte `Ctrl + C` no PowerShell.

---

## No dia a dia

Depois da primeira vez, é só isto:

```powershell
cd C:\projetos\corz
npm run dev
```

Qualquer arquivo que você salvar aparece no navegador na hora, sem
precisar reiniciar.

---

## Quando algo dá errado

**`npm` não é reconhecido**
O Node não foi instalado ou o PowerShell está aberto desde antes da
instalação. Feche e abra de novo.

**`DATABASE_URL ausente`**
O arquivo `.env` não está na pasta certa, ou foi salvo como `.env.txt`.
Confira com `dir` — o nome tem que ser exatamente `.env`.

**`ECONNREFUSED` ao rodar `db:migrar`**
O banco não está acessível. No caminho A, confira se copiou a connection
string inteira. No caminho B, veja se o serviço `postgresql` está rodando
nos Serviços do Windows.

**A porta 3000 já está em uso**
Rode `npm run dev -- -p 3001` e acesse na porta 3001.

**Esqueci a senha do painel**
```powershell
npm run usuario -- senha luiz@corz.com.br
```
Gera uma nova e derruba todas as sessões abertas.

---

## Comandos que existem no projeto

| Comando | O que faz |
|---|---|
| `npm run dev` | sobe o site em modo desenvolvimento |
| `npm run build` | gera a versão de produção |
| `npm start` | roda a versão de produção (precisa do build antes) |
| `npm run db:migrar` | aplica as migrações no banco |
| `npm run db:estudio` | abre uma interface visual para ver o banco |
| `npm run semear` | popula categorias e artigos iniciais |
| `npm run usuario -- listar` | lista as contas do painel |
| `npm run usuario -- criar "Nome" email PAPEL` | cria conta (`ADMIN`, `EDITOR` ou `AUTOR`) |
| `npm run usuario -- senha email` | gera nova senha |
| `npm run publicar:agendados` | publica os artigos agendados que venceram |

---

## Sobre o agendamento em ambiente local

Rodando na sua máquina, o artigo agendado **aparece no site** na hora
marcada normalmente — a consulta do blog já considera isso.

O comando `npm run publicar:agendados` só normaliza o status no banco.
Em produção ele roda sozinho por cron; localmente, você pode rodar na mão
quando quiser, ou simplesmente ignorar.
