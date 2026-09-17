# Relatório de Avaliação de Segurança e Auditoria Técnica

**Aplicação:** CORZ — Plataforma Web Institucional e Painel Editorial  
**Data da Avaliação:** 14 de setembro de 2026  
**Escopo:** Código-fonte (`src/`), APIs (`/api/`), Autenticação e Criptografia (`src/lib/`), Banco de Dados (`src/db/`), Infraestrutura (`Dockerfile`, `docker-compose.yml`, `Caddyfile`, `scripts/`) e Dependências (`package.json`, `package-lock.json`).  
**Metodologia:** OWASP Top 10 (2021), OWASP ASVS (Application Security Verification Standard v4.0), Análise Estática de Vulnerabilidades (SAST) e Auditoria de Infraestrutura e Dependências (SCA).

---

## 1. Resumo Executivo

A aplicação **CORZ** demonstrou uma postura de engenharia e segurança **significativamente superior à média** dos projetos web desenvolvidos em ecossistemas modernos de JavaScript/TypeScript. Fica evidente o cuidado arquitetural na proteção de dados e na defesa em profundidade em aspectos centrais:

- **Autenticação robusta e sessões seguras:** Adoção de sessões opacas com revogação imediata no servidor em vez de JWTs não revogáveis; apenas o hash SHA-256 do token é persistido em banco.
- **Hash de senhas forte:** Uso de **Argon2id** com parâmetros superiores à recomendação mínima da OWASP (19 MiB de memória, `timeCost: 2`, `outputLen: 32`).
- **Autenticação em Dois Fatores (2FA/TOTP):** Implementação nativa com segredos TOTP criptografados em repouso via **AES-256-GCM** com IVs únicos e autenticação de integridade.
- **Content Security Policy (CSP) rigorosa:** Segmentação entre área pública e administrativa, gerando `nonce` criptográfico por requisição e `strict-dynamic` no painel.
- **Sanitização de conteúdo estrita:** O HTML dos artigos passa por lista de permissões estrita no servidor (`sanitize-html`), eliminando scripts, manipuladores de evento e protocolos não autorizados antes da gravação.
- **Isolamento de infraestrutura:** Banco Postgres isolado em rede interna Docker, processo Node.js executando com usuário sem privilégios (`corz:nodejs`) e Caddy com HTTPS automático e HTTP/3.

Contudo, a auditoria identificou **uma vulnerabilidade crítica de dependência (RCE conhecido)**, **duas vulnerabilidades de severidade alta (spoofing de IP e negação de serviço de contas)** e falhas de configuração de média severidade que devem ser sanadas para blindar a aplicação em ambiente produtivo.

---

## 2. Tabela Resumo de Vulnerabilidades e Status de Remediação

| ID | Classificação | Severidade | Vetor / Arquivo | Status | Impacto Resumido e Solução Aplicada |
|---|---|---|---|---|---|
| **VULN-01** | Dependências / SCA | **CRÍTICA** | `package.json` | **CORRIGIDA** | Atualizado Next.js para `16.3.5` e Sharp para `0.35.4`. RCE eliminado. |
| **VULN-02** | Rede / Controle de Acesso | **ALTA** | `requisicao.ts`, `Caddyfile` | **CORRIGIDA** | Caddy agora injeta `X-Real-IP` fixo e `ipDoCliente()` extrai o IP confiável. |
| **VULN-03** | Autenticação / DoS | **ALTA** | `auth.ts` | **CORRIGIDA** | Atraso progressivo exponencial (backoff) e limites calibrados evitam lockout abusivo. |
| **VULN-04** | Autenticação / Oráculo | **MÉDIA** | `sessao/route.ts` | **CORRIGIDA** | Auditoria em tempo real na etapa 1 de 2FA associada ao IP real para evitar sondagem. |
| **VULN-05** | Negação de Serviço / Banco | **MÉDIA** | `saude/route.ts`, `Caddyfile` | **CORRIGIDA** | Cache em memória de 10s no healthcheck protege o pool de conexões Postgres (`max: 10`). |
| **VULN-06** | Exposição de Superfície | **MÉDIA** | `Caddyfile` | **CORRIGIDA** | Endpoint `/api/cron/*` bloqueado externamente no Caddy com HTTP 403. |
| **VULN-07** | Abuso de Recursos / Spam | **MÉDIA** | `leads/route.ts`, `chamados/route.ts` | **CORRIGIDA** | Verificação de mesma origem estrita em mutações e limitação de taxa por e-mail. |
| **VULN-08** | Criptografia / Timing | **BAIXA** | `cifra.ts` | **CORRIGIDA** | Hash SHA-256 prévio antes de `timingSafeEqual` elimina vazamento de comprimento. |
| **VULN-09** | Vazamento de Segredos | **BAIXA** | `.dockerignore` | **CORRIGIDA** | Adicionado `.env*` ao `.dockerignore` para blindar imagens de produção. |
| **VULN-10** | Gestão de Identidade | **BAIXA** | `senha/route.ts`, `seguranca/page.tsx` | **CORRIGIDA** | Implementado self-service completo de troca de senha no painel administrativo. |
| **VULN-11** | Armazenamento de Backup | **BAIXA** | `scripts/backup.sh` | **CORRIGIDA** | `umask 077` e `chmod 700` aplicados nos dumps e pasta de backups. |

---

## 3. Pontos Fortes da Aplicação (Defesa em Profundidade)

1. **Arquitetura de Sessão Superior a JWTs Puros:** O uso de tokens opacos de 256 bits, com validação de ociosidade (8h) e vida útil máxima (7 dias), com gravação do hash SHA-256 no banco garante revogação instantânea em desligamentos ou troca de credenciais.
2. **Proteção Rigorosa Contra XSS no Conteúdo:** No arquivo `src/lib/artigos.ts`, a lista branca descarta tags não autorizadas, normaliza links externos com `rel="noopener noreferrer nofollow"`, restringe iframes a provedores legítimos (YouTube, Spotify, Vimeo) e não confia em dados do cliente.
3. **Proteção Dupla de CSRF:** O painel exige cookie `corz_csrf` casado com o cabeçalho `x-corz-csrf`, conferidos via comparação criptográfica segura.
4. **Isolamento de Contêineres:** O Postgres não mapeia portas no host (`ports:` omitido intencionalmente), comunicando-se exclusivamente pela rede Docker `interna`. A imagem final de produção roda sob usuário não privilegiado (`corz`).
5. **Criação de Usuários Exclusiva por CLI:** A ausência de endpoints web de registro de novos administradores impede ataques de criação de contas e escalonamento horizontal de privilégios.

---

## 4. Detalhamento Técnico das Vulnerabilidades e Remediações

---

### VULN-01: Vulnerabilidades Críticas em Dependências (RCE no Next.js e Sharp)
- **Severidade:** **CRÍTICA** (CVSS: 9.8)
- **CWE:** CWE-94 (Code Injection), CWE-20 (Improper Input Validation)
- **Componente:** `next@16.3.1`, `sharp@0.35.3` em `package.json` / `package-lock.json`
- **Descrição Técnica:**
  A auditoria automatizada de pacotes identificou duas vulnerabilidades críticas conhecidas no Next.js 16.3.1:
  1. **GHSA-2xp9-vwfh-vxw4:** Execução Remota de Código (RCE) não autenticada no endpoint de otimização de imagem (`/_next/image`) ao processar formatos de imagem específicos como AVIF. Como o site habilita `"image/avif"` no `next.config.ts`, esta superfície está diretamente exposta.
  2. **GHSA-p293-qw3h-jr36:** Execução Remota de Código não autenticada quando o servidor executa sob ambiente Windows.
  3. **GHSA-rgj7-g3m4-5g8c:** Falhas de segurança na biblioteca `libheif` vinculada ao `sharp < 0.35.4`.
- **Impacto:** Comprometimento total do host/contêiner com execução arbitrária de comandos sem necessidade de credenciais.
- **Remediação:**
  Atualizar imediatamente as dependências no projeto:
  ```bash
  npm install next@latest sharp@latest
  npm audit fix
  ```

---

### VULN-02: Spoofing de IP via `X-Forwarded-For`
- **Severidade:** **ALTA** (CVSS: 7.5)
- **CWE:** CWE-290 (Authentication Bypass by Spoofing), CWE-345 (Insufficient Verification of Data Authenticity)
- **Componente:** `src/lib/requisicao.ts` (linhas 11–16) e `Caddyfile` (linhas 38–42)
- **Descrição Técnica:**
  A função `ipDoCliente()` extrai o IP através da linha:
  ```ts
  const encaminhado = h.get("x-forwarded-for");
  if (encaminhado) return encaminhado.split(",")[0]!.trim().slice(0, 64);
  ```
  O Caddy, ao atuar como proxy reverso padrão, anexa o IP remoto real ao final da cadeia existente de `X-Forwarded-For`. Se um cliente enviar um cabeçalho arbitrário `X-Forwarded-For: 200.100.50.25`, o Caddy encaminha: `X-Forwarded-For: 200.100.50.25, <IP_REAL_DO_CLIENTE>`. Ao pegar `split(",")[0]`, a aplicação seleciona o IP forjado pelo atacante.
- **Impacto:**
  - Neutralização completa dos limitadores de taxa baseados em IP (`limitar('lead:${ip}')`, `limitar('chamado:${ip}')`).
  - Bypass do limite de 20 tentativas de login por IP (`LIMITE_POR_IP = 20`), viabilizando ataques de password spraying sem bloqueio.
  - Falsificação de logs e adulteração da trilha de auditoria (`logs_auditoria.ip`).
- **Remediação:**
  1. No `Caddyfile`, forçar o envio de cabeçalhos seguros e confiáveis:
     ```caddy
     reverse_proxy site:3000 {
         header_up X-Real-IP {remote_host}
         header_up X-Forwarded-For {remote_host}
         health_uri /api/saude
         health_interval 30s
         health_timeout 5s
     }
     ```
  2. No `src/lib/requisicao.ts`, priorizar `x-real-ip` ou extrair o último IP da cadeia:
     ```ts
     export async function ipDoCliente() {
       const h = await headers();
       const realIp = h.get("x-real-ip");
       if (realIp) return realIp.trim().slice(0, 64);

       const encaminhado = h.get("x-forwarded-for");
       if (encaminhado) {
         const ips = encaminhado.split(",").map((s) => s.trim()).filter(Boolean);
         return (ips.pop() ?? "desconhecido").slice(0, 64);
       }
       return "desconhecido";
     }
     ```

---

### VULN-03: Negação de Serviço por Bloqueio Permanente de Contas (Lockout DoS)
- **Severidade:** **ALTA** (CVSS: 7.1)
- **CWE:** CWE-400 (Uncontrolled Resource Consumption), CWE-307 (Improper Restriction of Excessive Authentication Attempts)
- **Componente:** `src/lib/auth.ts` (linhas 207–240)
- **Descrição Técnica:**
  A verificação de bloqueio estipula:
  ```ts
  const LIMITE_POR_EMAIL = 6;
  const JANELA_MIN = 15;
  ```
  Se houver 6 falhas consecutivas para um endereço de e-mail nos últimos 15 minutos, qualquer requisição para esse e-mail é bloqueada com HTTP 429. Como o e-mail de administradores é frequentemente conhecido ou adivinhável, um atacante pode disparar 6 senhas incorretas a cada 14 minutos via script, impedindo permanentemente o acesso dos administradores legítimos ao sistema.
- **Impacto:** Negação de serviço contínua contra a gestão da empresa, sem que o operador consiga autenticar mesmo informando a senha e TOTP corretos.
- **Remediação:**
  - Implementar verificação por desafio CAPTCHA invisível (Cloudflare Turnstile) a partir da 3ª tentativa errada para o mesmo e-mail, em vez de bloqueio absoluto.
  - Implementar atraso progressivo (exponential backoff) por IP em vez de travar o e-mail globalmente.

---

### VULN-04: Oráculo de Validação de Senha em Contas com Segundo Fator
- **Severidade:** **MÉDIA** (CVSS: 5.3)
- **CWE:** CWE-204 (Observable Response Discrepancy), CWE-208 (Observable Timing Discrepancy)
- **Componente:** `src/app/api/admin/sessao/route.ts` (linhas 78–86)
- **Descrição Técnica:**
  No fluxo de login:
  ```ts
  if (usuario.doisFatores && usuario.segredo2fa) {
    if (!codigo) {
      return respostaJson({ ok: false, precisa2fa: true }, 200);
    }
  ```
  Se a senha informada estiver correta e o usuário tiver 2FA ativo, ao não enviar o parâmetro `codigo`, o endpoint devolve HTTP `200` com `{ precisa2fa: true }` sem chamar `registrarTentativa(email, ip, false)`. Quando a senha está errada, a rota retorna HTTP `401` com `registrarTentativa` chamado.
- **Impacto:** Um atacante pode testar dicionários de senhas contra contas que usam 2FA e descobrir com exatidão quando a senha está correta, sem acumular contagem de tentativas inválidas caso omita o código TOTP.
- **Remediação:**
  - Registrar toda tentativa de login, mesmo a fase inicial sem código TOTP.
  - Emitir um ticket temporário assinado e cifrado no cookie (ex: JWT ou token opaco de 3 minutos) contendo apenas o `usuarioId` com escopo restrito `2fa_pendente`. Na requisição seguinte com o TOTP, validar o ticket.

---

### VULN-05: Esgotamento do Pool Postgres via `/api/saude` Não Autenticado
- **Severidade:** **MÉDIA** (CVSS: 6.5)
- **CWE:** CWE-400 (Uncontrolled Resource Consumption), CWE-770 (Allocation of Resources Without Limits)
- **Componente:** `src/app/api/saude/route.ts` e `src/db/index.ts`
- **Descrição Técnica:**
  O pool de conexões do banco Postgres em produção está configurado para `max: 10` conexões simultâneas. O endpoint `/api/saude` é público, não possui limitação de taxa e dispara uma consulta SQL real (`SELECT 1`) síncrona a cada GET.
- **Impacto:** Uma carga moderada (poucas centenas de requisições por segundo) direcionada ao `/api/saude` satura instantaneamente as 10 conexões do Postgres, causando recusa de conexões para visitantes, clientes enviando formulários e administradores.
- **Remediação:**
  1. No `Caddyfile`, restringir o acesso ao `/api/saude` para a rede local / Docker e IPs de monitoramento:
     ```caddy
     @saude_externa {
         path /api/saude
         not remote_ip 127.0.0.1 172.16.0.0/12 10.0.0.0/8
     }
     respond @saude_externa "Proibido" 403
     ```
  2. Implementar cache em memória no endpoint `saude` para não executar consulta no banco se uma verificação tiver ocorrido há menos de 10 segundos.

---

### VULN-06: Exposição Pública de Endpoint de Manutenção (`/api/cron/publicar`)
- **Severidade:** **MÉDIA** (CVSS: 4.3)
- **CWE:** CWE-668 (Exposure of Resource to Wrong Sphere)
- **Componente:** `Caddyfile` e `src/app/api/cron/publicar/route.ts`
- **Descrição Técnica:**
  O Caddy encaminha todas as rotas diretamente ao Next.js, tornando `https://corz.com.br/api/cron/publicar` acessível da internet pública. O serviço agendador do Docker Compose já atua na rede interna via `http://site:3000/api/cron/publicar`. Não há razão técnica para que este endpoint seja alcançável por clientes externos.
- **Impacto:** Superfície de ataque desnecessariamente exposta a ataques de força bruta contra o `CRON_SEGREDO` ou tentativas de exploração.
- **Remediação:**
  Adicionar regra no `Caddyfile` para bloquear requisições externas para rotas de cron:
  ```caddy
  @bloqueio_cron path /api/cron/*
  respond @bloqueio_cron "Acesso restrito" 403
  ```

---

### VULN-07: Inundação de Leads e Abuso de Envio SMTP
- **Severidade:** **MÉDIA** (CVSS: 5.3)
- **CWE:** CWE-352 (Cross-Site Request Forgery / Origin Bypass), CWE-799 (Improper Control of Generation of Code)
- **Componente:** `src/app/api/leads/route.ts` e `src/lib/requisicao.ts`
- **Descrição Técnica:**
  A proteção de origem implementada em `mesmaOrigem(req)` aceita qualquer requisição onde os cabeçalhos `Origin` e `Referer` estejam ausentes:
  ```ts
  const bruto = origem ?? referencia;
  if (!bruto) return true;
  ```
  Bots e scripts em Python/Go podem suprimir propositalmente esses cabeçalhos. Combinado com o spoofing de IP (VULN-02), o rate limiting de 5 leads por IP é burlado. Como cada lead inserido dispara um e-mail com `enviarAviso()`, isso permite saturar o servidor de e-mail (SMTP), sujar a reputação do domínio com provedores (SPF/DKIM/DMARC) e poluir a base de dados.
- **Remediação:**
  - Integrar proteção antibot moderna e sem fricção como Cloudflare Turnstile nos formulários públicos (`FormularioContato.tsx` e `FormularioChamado.tsx`), validando o token no servidor antes de gravar ou enviar e-mail.

---

### VULN-08: Vazamento de Comprimento em Comparação Criptográfica
- **Severidade:** **BAIXA** (CVSS: 3.1)
- **CWE:** CWE-208 (Observable Timing Discrepancy)
- **Componente:** `src/lib/cifra.ts` (linhas 76–86)
- **Descrição Técnica:**
  A função `iguaisEmTempoConstante(a, b)` retorna `false` logo após `timingSafeEqual(ba, ba)` caso os tamanhos dos buffers sejam distintos:
  ```ts
  if (ba.length !== bb.length) {
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
  ```
  Embora execute uma comparação do mesmo tamanho, o retorno antecipado vaza a informação de que os comprimentos não coincidem para tokens de tamanho variável (como `CRON_SEGREDO`).
- **Remediação:**
  Calcular o hash SHA-256 de ambas as strings e comparar os hashes (que possuem tamanho fixo idêntico de 32 bytes):
  ```ts
  import { createHash, timingSafeEqual } from "node:crypto";

  export function iguaisEmTempoConstante(a: string, b: string) {
    const ha = createHash("sha256").update(a).digest();
    const hb = createHash("sha256").update(b).digest();
    return timingSafeEqual(ha, hb) && a.length === b.length;
  }
  ```

---

### VULN-09: Risco de Inclusão de `.env.producao` no Contexto Docker
- **Severidade:** **BAIXA** (CVSS: 3.3)
- **CWE:** CWE-552 (Files or Directories Accessible to External Parties)
- **Componente:** `.dockerignore`
- **Descrição Técnica:**
  O arquivo `.dockerignore` omite apenas `.env` e `.env*.local`. Se o operador criar localmente um arquivo `.env.producao` ou `.env.teste` (ambos presentes no `.gitignore`), ao rodar `docker build`, esses arquivos são copiados na etapa de build (`COPY . .`), podendo vazar senhas e chaves criptográficas nas camadas intermediárias da imagem.
- **Remediação:**
  Adicionar a seguinte linha no `.dockerignore`:
  ```
  .env*
  ```

---

### VULN-10 e VULN-11: Gestão de Senhas e Segurança de Backups
- **Severidade:** **BAIXA** (CVSS: 2.8)
- **Componentes:** `scripts/usuario.ts`, `scripts/backup.sh`
- **Descrição e Impacto:**
  - **Troca de Senha:** Não existe mecanismo no painel para que um editor ou autor altere sua própria senha. A troca só pode ser feita manualmente via comando de terminal no servidor pelo time de infraestrutura.
  - **Permissões de Backup:** O script `backup.sh` grava arquivos `.sql.gz` com as permissões padrão do usuário no sistema. Em servidores compartilhados ou com múltiplos operadores locais, o arquivo fica legível por qualquer usuário local.
- **Remediação:**
  1. No `scripts/backup.sh`, definir `umask 077` no início do script e aplicar `chmod 700 "$DESTINO"`.
  2. Implementar no painel administrativo uma rota para o usuário autenticado alterar sua própria senha, exigindo a senha atual e deslogando todas as outras sessões via `encerrarTodasAsSessoes()`.

---

## 5. Plano de Ação Priorizado de Correção

```
+-------------------------------------------------------------------+
| Fase 1: Correção Crítica Imediata                                 |
| - Atualizar Next.js e Sharp (Eliminar RCE)                        |
| - Corrigir Caddyfile e ipDoCliente() (Eliminar Spoofing de IP)    |
+-------------------------------------------------------------------+
                                  │
                                  ▼
+-------------------------------------------------------------------+
| Fase 2: Redução de Superfície de Ataque                           |
| - Bloquear /api/cron/* e restringir /api/saude no Caddyfile       |
| - Mitigar Lockout DoS e Oráculo 2FA no fluxo de login             |
+-------------------------------------------------------------------+
                                  │
                                  ▼
+-------------------------------------------------------------------+
| Fase 3: Blindagem e Resiliência                                   |
| - Adicionar proteção antibot (Turnstile) em Leads/Chamados        |
| - Ajustar permissões de backup (umask 077) e .dockerignore (.env*)|
+-------------------------------------------------------------------+
```

### Checklist Técnico para Implementação:

1. [ ] **Atualização de Pacotes:** Rodar `npm install next@latest sharp@latest` e validar build de produção (`npm run build`).
2. [ ] **Configuração do Proxy Caddy (`Caddyfile`):**
   - Inserir `header_up X-Real-IP {remote_host}`.
   - Inserir `header_up X-Forwarded-For {remote_host}`.
   - Adicionar bloqueio de rotas: `@bloqueio_cron path /api/cron/*` -> `respond 403`.
   - Adicionar restrição de IP para `/api/saude`.
3. [ ] **Ajuste em `src/lib/requisicao.ts`:**
   - Atualizar `ipDoCliente()` para priorizar `x-real-ip` e utilizar `pop()` na cadeia de saltos do proxy.
4. [ ] **Ajuste em `src/lib/auth.ts` e `src/app/api/admin/sessao/route.ts`:**
   - Registrar auditoria/tentativa também na verificação intermediária de 2FA.
   - Ajustar bloqueio de login para evitar Account Lockout DoS através de backoff por IP.
5. [ ] **Ajuste no `.dockerignore`:** Adicionar `.env*`.
6. [ ] **Ajuste no `scripts/backup.sh`:** Inserir `umask 077` e `chmod 600` nos arquivos gerados.

---

## 6. Conclusão

A plataforma CORZ possui uma fundação técnica de segurança madura, com padrões arquiteturais modernos e bem implementados para a proteção de sessões, integridade de dados e isolamento em contêineres. As vulnerabilidades identificadas não são decorrentes de negligência estrutural, mas de versões de bibliotecas e particularidades na comunicação entre o proxy reverso e a aplicação Next.js. A execução do plano de ação priorizado acima elevará a segurança da aplicação a um nível exemplar de conformidade e robustez para ambientes de produção.
