# Correção do erro de build

## O que aconteceu

```
Error: Failed to collect configuration for /api/chamados
  [cause]: Error: DATABASE_URL ausente.
```

O erro apontava para a variável faltando, mas a causa real era um defeito
meu: `src/db/index.ts` montava a conexão com o banco **no topo do
arquivo**, durante a importação.

Isso importa porque, ao compilar, o Next avalia todos os módulos das
rotas para descobrir a configuração de cada uma. Como a rota
`/api/chamados` importa o banco, compilar passava a exigir um PostgreSQL
no ar — o que é absurdo, porque compilar não consulta nada.

Resultado: qualquer servidor sem `DATABASE_URL` reprovava o build mesmo
com tudo correto. Foi exatamente o que aconteceu com você.

## O que mudou

A conexão agora é criada **na primeira consulta de verdade**, já em
execução. Compilar não toca no banco.

Verificado aqui, nesta ordem:

1. `npm run build` com a variável removida do ambiente → **compila**.
2. Servidor de produção rodando → leitura do blog, escrita de artigo,
   login com Argon2, sessão, CSRF, formulários e cron → **tudo funciona**.

Também migrei `middleware.ts` para `proxy.ts`, que era o outro aviso do
seu log. O Next 16.3 renomeou a convenção e o antigo nome sairá em uma
versão futura.

---

## O que fazer agora

### 1. Substituir os arquivos

Baixe o zip novo e substitua o projeto no servidor. Os arquivos alterados
foram `src/db/index.ts` e `src/proxy.ts` (que era `src/middleware.ts` —
**apague o antigo**, senão o Next reclama de convenção duplicada).

### 2. Definir as variáveis de ambiente

O build agora passa sem elas, mas o **site em execução precisa delas**.
Em hospedagem com painel, geralmente há uma seção de variáveis de
ambiente na configuração da aplicação Node.js. Defina:

| Variável | Valor |
|---|---|
| `DATABASE_URL` | a string de conexão do seu PostgreSQL |
| `SESSAO_SEGREDO` | gere com o comando abaixo |
| `CIFRA_SEGREDO` | gere com o comando abaixo |
| `CRON_SEGREDO` | gere com o comando abaixo |
| `NEXT_PUBLIC_SITE_URL` | `https://corz.com.br` |
| `NODE_ENV` | `production` |

Para gerar os três segredos, rode **um comando por vez**:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Se o painel não tiver campo para variáveis, crie um arquivo `.env` na
raiz do projeto com o mesmo conteúdo.

> **Atenção sobre `NEXT_PUBLIC_SITE_URL`:** essa é a única que precisa
> existir **no momento do build**, não só na execução. Variáveis com
> prefixo `NEXT_PUBLIC_` são embutidas no código compilado. Se ela não
> estiver definida quando você rodar `npm run build`, o site vai gerar
> links apontando para `https://corz.com.br` (o valor padrão) — o que
> por acaso está certo no seu caso, mas não conte com isso se o domínio
> mudar.

### 3. Criar as tabelas

Uma vez só, depois que `DATABASE_URL` estiver definida:

```bash
npx drizzle-kit migrate
npx tsx scripts/semear.ts
npx tsx scripts/usuario.ts criar "Luiz Schorn Coimbra" luiz@corz.com.br ADMIN
```

O último comando imprime a senha do painel. Copie na hora.

### 4. Configurar o arquivo de inicialização

Se a hospedagem pede um "arquivo de inicialização" ou "startup file",
depende de como você fez o build:

- **Build normal** (`.next` completo na pasta): o comando de início é
  `npm start`, ou o arquivo `node_modules/next/dist/bin/next` com o
  argumento `start`.
- **Modo standalone** (recomendado, e é como o projeto está
  configurado): o arquivo é `.next/standalone/server.js`.

No modo standalone, `public` e `.next/static` precisam estar dentro de
`.next/standalone` — o Next não copia sozinho, e sem elas o servidor
responde 200 no HTML e 404 em todo CSS, JavaScript e imagem. A página
chega ao navegador inteira e sem estilo nenhum: setas pretas gigantes,
links em azul, texto em serifa. Não aparece erro em lugar nenhum, o que
faz esse defeito ser quase sempre diagnosticado como outra coisa.

**Isso agora é automático.** O `npm run build` roda em seguida o
`postbuild`, que faz as duas cópias e avisa no terminal:

```
  ✓ public → .next/standalone
  ✓ .next/static → .next/standalone
```

Se essas duas linhas não aparecerem no fim do build, a publicação vai
sair sem estilo — não continue. O script é
`scripts/preparar-standalone.mjs`, e o equivalente manual é:

```bash
cp -r public .next/standalone/public
cp -r .next/static .next/standalone/.next/static
```

### 5. Conferir se subiu

```bash
curl https://corz.com.br/api/saude
```

Deve responder `{"ok":true,"banco":"ok","ms":...}`.

Se vier `{"ok":false,"banco":"indisponivel"}`, o site está de pé mas não
alcança o banco — verifique a `DATABASE_URL` e, se o banco for externo,
se a hospedagem libera saída na porta 5432.

---

## Se o build travar por memória

`npm run build` costuma pedir de 2 a 4 GB. Em hospedagem compartilhada,
o processo pode ser encerrado sem mensagem clara.

Nesse caso, construa no seu computador e envie só o resultado:

```powershell
npm run build
```

Depois envie para o servidor as pastas `.next/standalone`, `public` e
`.next/static`, junto com `package.json`. Não precisa enviar
`node_modules` — o standalone já traz o que usa.
