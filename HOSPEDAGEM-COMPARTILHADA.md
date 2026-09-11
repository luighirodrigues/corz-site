# A minha hospedagem serve?

"Tem suporte a Node.js" é um dos quatro requisitos — e normalmente não é
o que reprova. Confira os quatro antes de decidir.

---

## Os quatro requisitos

### 1. Node.js 20.9 ou superior — eliminatório

O Next.js 16 exige `>=20.9.0`. Muita hospedagem compartilhada ainda
oferece Node 16 ou 18. Se a sua para no 18, **não roda**, e não há
contorno razoável.

Onde ver: no cPanel, em **Setup Node.js App**, a lista de versões
disponíveis. Ou por SSH:

```bash
node -v
```

### 2. Processo que fica de pé — eliminatório

O site é um servidor que roda continuamente, não um script chamado a cada
visita. Precisa de algo como o **Phusion Passenger** (é o que está por
trás do "Setup Node.js App" do cPanel) ou acesso a `pm2`/`systemd`.

Se a hospedagem só executa Node em resposta a requisição, no modelo CGI,
não serve.

### 3. Um banco PostgreSQL — **contornável**

Aqui está a boa notícia, e é o ponto que mais confunde: **o banco não
precisa estar na mesma hospedagem.**

Se a sua só oferece MySQL — o caso mais comum —, dá para usar um Postgres
externo:

- [Neon](https://neon.com) — plano gratuito, suficiente para começar
- [Supabase](https://supabase.com) — plano gratuito também

O site conecta pela `DATABASE_URL` e não faz ideia de onde o banco mora.

### 4. Conexão de saída liberada — precisa confirmar

Se o banco for externo, a hospedagem precisa deixar o site abrir conexão
para fora na **porta 5432**. Algumas compartilhadas bloqueiam saída para
portas fora de 80 e 443, o que inviabiliza o banco externo.

Teste por SSH, se você tiver:

```bash
nc -zv ep-seu-projeto.neon.tech 5432
```

Sem SSH, pergunte ao suporte: *"a hospedagem permite conexão de saída na
porta 5432 para um banco PostgreSQL externo?"*

---

## O que perguntar ao suporte

Copie e envie ao atendimento. As quatro respostas decidem tudo:

> 1. Qual a versão máxima do Node.js disponível no plano? Preciso de
>    20.9 ou superior.
> 2. O plano permite manter uma aplicação Node.js rodando de forma
>    contínua, via Passenger ou pm2?
> 3. Vocês oferecem PostgreSQL? Se não, a hospedagem permite conexão de
>    saída na porta 5432 para um banco externo?
> 4. Tenho acesso SSH e posso rodar `npm install` e `npm run build`?
>    Qual o limite de memória por processo?

---

## Como ler as respostas

| Situação | Veredito |
|---|---|
| Node 20+, processo contínuo, Postgres próprio ou saída liberada | **Serve.** Preparo a configuração para a sua hospedagem. |
| Node 20+, processo contínuo, mas saída bloqueada e só MySQL | Dá para adaptar o site para MySQL — cerca de meio dia de trabalho. Me avise que eu faço. |
| Node 18 ou inferior | **Não serve.** Não há como contornar. |
| Sem processo contínuo (só CGI) | **Não serve.** |
| Sem SSH e sem build remoto | Serve, mas você precisa construir no seu computador e enviar a pasta pronta. Eu monto esse fluxo. |

---

## Sobre o build

`npm run build` costuma pedir de 2 a 4 GB de memória. Hospedagem
compartilhada em geral limita bem abaixo disso.

Se for o seu caso, o caminho é construir na sua máquina e enviar só o
resultado — o site já está configurado em modo `standalone` justamente
para isso, e a pasta final fica em torno de 200 MB em vez de 1 GB.

---

## O que você perde em relação ao VPS

Sendo honesto sobre o outro lado da escolha:

- **HTTPS** passa a depender do painel da hospedagem, em vez de ser
  automático pelo Caddy.
- **Backup do banco** vira responsabilidade sua ou do provedor do banco
  externo. O `scripts/backup.sh` que preparei assume Docker.
- **A publicação agendada** precisa do cron do painel chamando
  `/api/cron/publicar`, em vez do contêiner que faz isso sozinho.
- **Atualizar o site** deixa de ser um comando e passa a ser envio de
  arquivos por FTP ou git.
- **Diagnóstico** fica mais difícil: sem acesso completo aos registros,
  um erro intermitente vira adivinhação.

Nada disso impede o site de funcionar. São mais pontos de manutenção
manual.
