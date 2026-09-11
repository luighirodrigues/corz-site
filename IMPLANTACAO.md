# Implantação em VPS

Guia para colocar o site no ar em um servidor próprio. Do zero ao HTTPS
funcionando leva cerca de 40 minutos.

A pilha é: **Caddy** na frente resolvendo HTTPS → **Next.js** →
**PostgreSQL**. Tudo em contêineres, subindo com um comando.

---

## O que contratar

Qualquer VPS com **Ubuntu 24.04 LTS**, 2 vCPU e 4 GB de RAM. Na Hostinger
é o plano KVM 2, cerca de R$ 35/mês.

Dá para rodar com 1 vCPU e 2 GB, mas o `docker compose build` fica no
limite de memória e pode ser interrompido pelo sistema. Se for esse o
caso, veja "Build em máquina pequena" no final.

Anote o **IP do servidor** que a hospedagem fornecer.

---

## 1. Apontar o domínio

Faça isto **antes** de subir a aplicação: o Caddy só consegue emitir o
certificado depois que o DNS já resolve para o servidor, e a propagação
leva alguns minutos.

No painel do seu registrador (Registro.br ou onde o `corz.com.br` está),
crie dois registros:

| Tipo | Nome | Valor |
|---|---|---|
| A | `@` | IP do servidor |
| A | `www` | IP do servidor |

Confira daqui a alguns minutos:

```bash
nslookup corz.com.br
```

Só siga quando o IP correto aparecer.

> **Atenção:** isso tira o site atual do ar assim que propagar. Se
> preferir testar antes, aponte primeiro um subdomínio como
> `novo.corz.com.br`, valide tudo, e só depois mova o domínio principal.

---

## 2. Preparar o servidor

Acesse por SSH:

```bash
ssh root@IP_DO_SERVIDOR
```

### Atualizar e criar um usuário sem privilégios

Trabalhar como root o tempo todo transforma qualquer erro de digitação em
um incidente.

```bash
apt update && apt upgrade -y
adduser corz
usermod -aG sudo corz
```

### Chave SSH em vez de senha

No **seu computador** (PowerShell), gere e envie a chave:

```powershell
ssh-keygen -t ed25519 -C "corz"
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh corz@IP_DO_SERVIDOR "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
```

Teste em uma janela nova — `ssh corz@IP_DO_SERVIDOR` deve entrar sem pedir
senha. **Só depois de confirmar que funciona**, desligue o acesso por
senha no servidor:

```bash
sudo nano /etc/ssh/sshd_config
```

Ajuste estas três linhas e salve:

```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
```

```bash
sudo systemctl restart ssh
```

> Não feche a sessão atual antes de abrir uma nova e confirmar que ainda
> consegue entrar. É o jeito mais comum de se trancar para fora do próprio
> servidor.

### Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

Só três portas abertas. O PostgreSQL nunca é publicado — os contêineres
falam entre si por uma rede interna que não existe fora do servidor.

### Bloqueio de tentativas de invasão

```bash
sudo apt install -y fail2ban
sudo systemctl enable --now fail2ban
```

---

## 3. Instalar o Docker

```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker corz
```

Saia e entre de novo no SSH para o grupo valer. Confira:

```bash
docker --version
docker compose version
```

---

## 4. Subir o site

```bash
sudo mkdir -p /opt/corz && sudo chown corz:corz /opt/corz
cd /opt/corz
```

Envie o projeto. Do **seu computador**:

```powershell
scp C:\caminho\site-corz.zip corz@IP_DO_SERVIDOR:/opt/corz/
```

De volta no servidor:

```bash
cd /opt/corz
sudo apt install -y unzip
unzip site-corz.zip && mv corz/* corz/.[!.]* . 2>/dev/null; rmdir corz
```

### Criar o arquivo de configuração

```bash
cp .env.producao.exemplo .env
```

Gere os quatro segredos — **um comando por vez**, cada um produz um valor
diferente:

```bash
echo "POSTGRES_PASSWORD=$(openssl rand -base64 32)"
echo "SESSAO_SEGREDO=$(openssl rand -base64 48)"
echo "CIFRA_SEGREDO=$(openssl rand -base64 32)"
echo "CRON_SEGREDO=$(openssl rand -base64 32)"
```

Abra o `.env` e cole cada valor no campo correspondente, ajustando também
o domínio e o e-mail:

```bash
nano .env
```

```
DOMINIO=corz.com.br
NEXT_PUBLIC_SITE_URL=https://corz.com.br
EMAIL_TLS=ti@corz.com.br
```

Proteja o arquivo — ele contém as chaves do sistema inteiro:

```bash
chmod 600 .env
```

### Construir e subir

```bash
docker compose build
docker compose up -d
```

A primeira construção demora de 3 a 8 minutos. Acompanhe:

```bash
docker compose ps
docker compose logs -f site
```

### Preparar o banco

```bash
docker compose exec site npx drizzle-kit migrate
docker compose exec site npx tsx scripts/semear.ts
docker compose exec site npx tsx scripts/usuario.ts criar "Luiz Schorn Coimbra" luiz@corz.com.br ADMIN
```

O último comando imprime a senha do painel. **Copie agora** — ela não é
mostrada de novo.

### Conferir

Abra `https://corz.com.br`. O certificado é emitido automaticamente no
primeiro acesso; se der erro de HTTPS, espere um minuto e recarregue.

```bash
curl -I https://corz.com.br
docker compose exec site wget -qO- http://127.0.0.1:3000/api/saude
```

Deve responder `{"ok":true,"banco":"ok",...}`.

---

## 5. Backup automático

```bash
chmod +x scripts/backup.sh
./scripts/backup.sh
```

Se gerou o arquivo em `backups/`, agende para todo dia às 3h:

```bash
crontab -e
```

Acrescente:

```
0 3 * * * cd /opt/corz && ./scripts/backup.sh >> backups/backup.log 2>&1
```

Guarda 14 dias e apaga o resto sozinho.

**Teste a restauração pelo menos uma vez por trimestre.** O passo a passo
está comentado no fim do `scripts/backup.sh`. Backup que nunca foi
restaurado não é backup — é uma suposição. Vocês dizem isso aos clientes;
vale para casa também.

Melhor ainda: copie os dumps para fora do servidor. Um backup que mora no
mesmo disco do banco não protege contra a perda do disco.

---

## 6. Atualizar o site depois

Quando houver alteração no código:

```bash
cd /opt/corz
# envie os arquivos novos, então:
docker compose build site
docker compose up -d site
```

Só o contêiner do site reinicia. O banco continua rodando e nenhum dado é
tocado. A parada dura poucos segundos.

Se a alteração mexeu no banco:

```bash
docker compose exec site npx drizzle-kit migrate
```

---

## Comandos do dia a dia

| Situação | Comando |
|---|---|
| Ver o que está rodando | `docker compose ps` |
| Acompanhar os registros | `docker compose logs -f site` |
| Reiniciar tudo | `docker compose restart` |
| Parar tudo | `docker compose down` |
| Subir de novo | `docker compose up -d` |
| Backup agora | `./scripts/backup.sh` |
| Listar contas do painel | `docker compose exec site npx tsx scripts/usuario.ts listar` |
| Nova senha para alguém | `docker compose exec site npx tsx scripts/usuario.ts senha email@corz.com.br` |
| Desativar uma conta | `docker compose exec site npx tsx scripts/usuario.ts desativar email@corz.com.br` |
| Publicar agendados na mão | `docker compose exec site npx tsx scripts/publicar-agendados.ts` |
| Espaço em disco | `df -h && docker system df` |
| Limpar imagens antigas | `docker system prune -af` |

---

## Quando algo dá errado

**O HTTPS não é emitido**
O DNS ainda não propagou ou a porta 80 está fechada. Confira com
`nslookup corz.com.br` e `sudo ufw status`. Veja o motivo em
`docker compose logs proxy`.

**`502 Bad Gateway`**
O site subiu mas ainda não está pronto, ou caiu. `docker compose logs site`
mostra a causa. Quase sempre é `DATABASE_URL` errado no `.env`.

**O contêiner do site reinicia sem parar**
Alguma variável obrigatória está faltando. Os registros dizem qual:
`docker compose logs --tail 50 site`.

**O build é interrompido sem mensagem**
Falta de memória. Veja "Build em máquina pequena", abaixo.

**Esqueci a senha do painel**
```bash
docker compose exec site npx tsx scripts/usuario.ts senha luiz@corz.com.br
```

**Perdi o acesso ao 2FA**
Use um dos códigos de recuperação salvos na ativação. Se não tiver
nenhum, um administrador desativa pelo banco:
```bash
docker compose exec banco psql -U corz -d corz -c "update usuarios set dois_fatores=false, segredo_2fa=null where email='luiz@corz.com.br';"
```

**Preciso voltar um backup**
```bash
gunzip -c backups/corz_ARQUIVO.sql.gz | docker compose exec -T banco psql -U corz -d corz
```

---

## Build em máquina pequena

Em VPS de 1 vCPU e 2 GB, o `docker compose build` pode ser interrompido
por falta de memória. Duas saídas:

**Ativar memória de troca** (mais simples):
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**Ou construir no seu computador** e enviar a imagem pronta:
```powershell
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://corz.com.br -t corz-site .
docker save corz-site | ssh corz@IP "docker load"
```

---

## Depois que estiver no ar

- [ ] Ativar o 2FA em todas as contas do painel
- [ ] Configurar os redirecionamentos 301 das URLs antigas (ver `MIGRACAO.md`)
- [ ] Enviar o sitemap ao Google Search Console
- [ ] Copiar os backups para fora do servidor
- [ ] Testar uma restauração
- [ ] Monitorar `https://corz.com.br/api/saude` pelo monitoramento da CORZ: o site
      da casa merece a mesma vigilância que vocês vendem
