# Ambiente de homologação

O site vai primeiro para `sitecorz.agenciafleck.com.br`, para revisão
antes de assumir o domínio definitivo.

---

## O problema que isso cria

Um ambiente de teste com o SEO ligado é indexado pelo Google como
qualquer outro site. O resultado é uma cópia do site da CORZ competindo
com o original nos resultados de busca — conteúdo duplicado, autoridade
dividida e, no pior caso, o endereço da agência aparecendo quando alguém
procura pela CORZ.

Limpar isso depois leva semanas de reindexação. É bem mais barato não
deixar acontecer.

## Como está resolvido

O site descobre sozinho onde está servindo. Se o endereço não for
`corz.com.br`, ele se tranca:

| Proteção | Homologação | Produção |
|---|---|---|
| `robots.txt` | `Disallow: /` | regras completas, com bots de IA liberados |
| `sitemap.xml` | vazio | 30 URLs |
| `<meta robots>` | `noindex, nofollow, nocache` | `index, follow` |
| Cabeçalho `X-Robots-Tag` | em toda resposta | ausente |
| `/llms.txt` | só um aviso | resumo completo da empresa |
| Selo na tela | visível | ausente |

A regra é **derivada, não configurada por bandeira**. Bandeira se
esquece; endereço não mente. Ao apontar o domínio real e recompilar,
tudo volta ao normal sozinho — não há nada para lembrar de destravar.

Verificado nos dois sentidos antes da entrega.

### O selo

Um marcador discreto no canto inferior esquerdo, para que ninguém confunda
o ambiente de teste com o site no ar nem mande o endereço errado para
alguém. É pequeno de propósito: o ambiente serve para revisar design, e um
aviso grande atrapalharia justamente o que se foi ali fazer.

---

## Como compilar para homologação

`NEXT_PUBLIC_SITE_URL` precisa estar definida **no momento do build** —
o valor é embutido no código compilado, não lido em execução.

```bash
NEXT_PUBLIC_SITE_URL=https://sitecorz.agenciafleck.com.br npm run build
```

No Windows (PowerShell):

```powershell
$env:NEXT_PUBLIC_SITE_URL="https://sitecorz.agenciafleck.com.br"
npm run build
```

Se a hospedagem define variáveis pelo painel, basta cadastrar
`NEXT_PUBLIC_SITE_URL` lá antes de mandar compilar.

O build anuncia em qual modo compilou, logo no início:

```
  ▲ HOMOLOGAÇÃO — https://sitecorz.agenciafleck.com.br
    Bloqueado para buscadores: noindex, robots negando tudo, sitemap vazio.
```

Se aparecer `● PRODUÇÃO` quando você esperava homologação, a variável não
chegou ao build. Pare e corrija antes de subir.

---

## Quando for para o domínio definitivo

**Recompilar é obrigatório.** Trocar a variável no servidor sem
recompilar não muda nada — testei, e o site continua bloqueado.

```bash
NEXT_PUBLIC_SITE_URL=https://corz.com.br npm run build
```

Confirme que o build imprimiu `● PRODUÇÃO`. Depois:

```bash
curl -s https://corz.com.br/robots.txt | head -3
```

Se ainda vier `Disallow: /`, o build saiu em modo homologação. Repita com
a variável correta.

### Restante da virada

- [ ] Recompilar com o domínio definitivo e conferir o aviso `● PRODUÇÃO`
- [ ] Redirecionamentos 301 das URLs antigas (ver `MIGRACAO.md`)
- [ ] Enviar o sitemap ao Google Search Console
- [ ] Confirmar que `robots.txt` e `/llms.txt` respondem corretamente
- [ ] Desativar ou proteger o endereço de homologação, para não ficarem
      dois sites idênticos no ar

---

## Enquanto estiver em homologação

Vale saber o que já funciona e o que ainda não:

- **Formulários gravam de verdade.** Contato e abertura de chamado
  inserem no banco. Se for o mesmo banco da produção depois, limpe os
  registros de teste antes da virada:
  ```sql
  delete from leads where criado_em < '2026-09-01';
  ```
- **O painel é o painel real.** Artigos escritos ali continuam existindo
  quando o domínio mudar, desde que seja o mesmo banco. Escrever conteúdo
  durante a homologação não é trabalho perdido.
- **O agendamento funciona normalmente**, inclusive publicando sozinho.
- **Links compartilhados apontam para o endereço de homologação.** Se
  alguém colar um link do site no WhatsApp, vai o endereço da agência.
  Vale avisar quem estiver revisando.
