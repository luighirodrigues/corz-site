# Publicar o site da CORZ

Checklist da subida em `corz.com.br`. Cada item aqui é uma coisa que,
esquecida, aparece depois — geralmente na forma de "o site não está no
Google" ou "não chegou nenhum formulário".

---

## 1. Antes de compilar

### O domínio decide se o site é indexável

`NEXT_PUBLIC_SITE_URL` é embutida **durante a compilação**, não lida em
execução. Trocar depois, no servidor, não muda nada.

```
NEXT_PUBLIC_SITE_URL=https://corz.com.br
```

O site só se deixa indexar quando essa URL contém `corz.com.br`. Em
qualquer outro endereço ele entra em modo homologação sozinho: `noindex`
em toda página, `X-Robots-Tag` em toda resposta, robots negando tudo e
sitemap vazio. É regra derivada, não bandeira de configuração — bandeira
se esquece, e ambiente de teste indexado vira uma cópia do site
competindo com o original na busca.

O build diz em voz alta em qual modo compilou:

```
  ● PRODUÇÃO — https://corz.com.br
    O site será indexado por buscadores.
```

### Variáveis obrigatórias

Copie `.env.producao.exemplo` para `.env` e preencha. Sem estas quatro o
site não sobe:

| Variável | Como gerar |
|---|---|
| `DATABASE_URL` | string de conexão do Postgres |
| `SESSAO_SEGREDO` | `openssl rand -base64 48` |
| `CIFRA_SEGREDO` | `openssl rand -base64 32` |
| `CRON_SEGREDO` | `openssl rand -base64 32` |

`CIFRA_SEGREDO` cifra os segredos de 2FA. Trocá-lo depois que alguém
ativou o segundo fator invalida o que já está gravado, e todo mundo
precisa reconfigurar o aplicativo autenticador. Guarde junto com as
senhas do servidor.

---

## 2. Compilar

```bash
npm ci
npm run build
```

O `postbuild` roda sozinho e precisa terminar com estas duas linhas:

```
  ✓ public → .next/standalone
  ✓ .next/static → .next/standalone
```

**Se elas não aparecerem, não publique.** Sem essas duas pastas dentro
do standalone o servidor responde 200 no HTML e 404 em todo CSS,
JavaScript e imagem: a página chega ao navegador inteira e sem estilo
nenhum, e não aparece erro em lugar nenhum.

Início:

```bash
node .next/standalone/server.js
```

---

## 3. E-mail dos formulários

Cada formulário enviado grava no banco **e** dispara um e-mail. O banco
continua sendo a fonte da verdade; o e-mail é o aviso, para ninguém
depender de lembrar de abrir o painel.

```
SMTP_HOST=smtp.seuprovedor.com.br
SMTP_PORT=587
SMTP_USUARIO=nao-responda@corz.com.br
SMTP_SENHA=
SMTP_DE=CORZ Site <nao-responda@corz.com.br>

EMAIL_DESTINO=contato@corz.com.br
EMAIL_LEADS=comercial@corz.com.br
EMAIL_CHAMADOS=suporte@corz.com.br
```

Três coisas que costumam dar errado:

**O remetente precisa ser do próprio domínio.** Usar um Gmail ou o
endereço de quem recebe faz SPF e DMARC reprovarem, e a mensagem cai em
spam ou é recusada na entrada.

**A conexão precisa ser cifrada.** Em qualquer porta que não a 465 o
envio exige STARTTLS e falha se o servidor não oferecer. É proposital:
formulário de contato carrega nome, telefone e e-mail de gente real, e
isso não trafega em claro.

**Sem SMTP configurado nada quebra.** O site grava o formulário
normalmente e apenas registra no log que não enviou. Nenhum lead se
perde por causa de servidor de e-mail fora do ar — e a tela de
confirmação continua honesta, porque o dado está salvo.

Confira depois de subir:

```bash
curl https://corz.com.br/api/saude
# {"ok":true,"banco":"ok","email":true,"ms":4}
```

`"email":false` significa que as variáveis não chegaram ao processo.

---

## 4. Medição

Tudo opcional, tudo embutido na compilação. **Sem valor, a tag não
existe no HTML** — nenhuma requisição sai para o domínio do terceiro.

```
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=000000000000000
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXX
NEXT_PUBLIC_LINKEDIN_PARTNER_ID=0000000
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

Preencher depois exige **recompilar** — são `NEXT_PUBLIC_`.

Nada disso carrega antes de a pessoa aceitar na faixa de cookies, e
"Recusar" grava a recusa em vez de só fechar a faixa. É a diferença
entre cumprir a LGPD e apenas exibir um aviso. A faixa só aparece se
houver alguma medição configurada — site sem ferramenta de terceiro não
tem o que pedir.

Os formulários marcam conversão sozinhos ao serem enviados com sucesso:
`gerar_lead` no contato e `abrir_chamado` no suporte.

Se for verificar o Search Console por registro DNS — o método
preferível —, deixe `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` em branco.

---

## 5. Depois de subir

```bash
curl https://corz.com.br/api/saude       # banco e e-mail
curl https://corz.com.br/robots.txt      # deve liberar, não bloquear
curl https://corz.com.br/sitemap.xml     # 16 endereços com https://corz.com.br
curl https://corz.com.br/llms.txt        # resumo para assistentes de IA
curl -I https://corz.com.br | grep -i content-security
```

No Search Console: enviar `https://corz.com.br/sitemap.xml` e pedir
indexação da home. O restante o rastreador encontra sozinho pelo mapa.

### O que já está no ar sem configuração

- **Canônica** em toda página, apontando para `https://corz.com.br`
- **Metadescrição** própria em cada uma das 18 páginas
- **Open Graph e Twitter Card** com imagem gerada por página
- **JSON-LD** conectado por `@id`: organização, site, página, trilha,
  FAQ, serviço e endereço com coordenadas
- **llms.txt** com posicionamento, números verificados e as quatro
  frentes, para assistentes de IA citarem a CORZ corretamente
- **robots.txt** liberando explicitamente GPTBot, ClaudeBot,
  PerplexityBot e afins — ser citada em resposta de IA vale mais do que
  proteger texto institucional que já é público
- **Sitemap** com `lastModified` honesto

### Cabeçalhos de segurança em toda resposta

`Content-Security-Policy` (nonce e `strict-dynamic` no /admin),
`Strict-Transport-Security` com `preload`, `X-Content-Type-Options`,
`X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`,
`Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`.

O /admin ainda recebe `Cache-Control: no-store` e `noindex`, e nenhuma
tag de terceiro é liberada lá: é a superfície com sessão autenticada, e
marketing não tem o que fazer nela.

### Nos formulários

Validação com esquema no servidor, campo-armadilha contra robô, limite
de envios por IP, conferência de origem, e escape de tudo que vai para
o e-mail — inclusive remoção de quebra de linha no assunto, que é o
vetor clássico de injeção de cabeçalho SMTP.
