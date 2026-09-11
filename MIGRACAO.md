# Migração do site atual para o novo

Registro do que muda de endereço e do que precisa de decisão antes de
publicar. Guardar isto evita perder o posicionamento já conquistado pelas
páginas antigas.

## Redirecionamentos 301

O site atual (WordPress + Bricks) usa endereços diferentes do novo sitemap.
Sem redirecionamento, cada URL antiga vira um 404 e a autoridade acumulada
se perde.

| Endereço antigo | Novo | Observação |
|---|---|---|
| `/sobre-nos/` | `/sobre` | |
| `/solucoes-completas-em-tecnologia-corporativa/` | `/solucoes` | URL antiga longa demais; a nova é mais forte |
| `/suporte/` | `/suporte` | mantém |
| `/contato/` | `/contato` | mantém |
| `/blog/` | `/blog` | mantém |
| `/podcast/` | `/podcast` | mantém |

### Artigos do blog antigo

Os 14 artigos publicados entre setembro e outubro de 2024 estão em
endereços de raiz (`/servidor-em-nuvem-como-funciona-e-quais-as-vantagens/`,
por exemplo), não sob `/blog/`. Duas opções:

1. **Migrar o conteúdo** para o novo blog com o mesmo slug sob `/blog/` e
   redirecionar 301 da raiz. Preserva o histórico.
2. **Redirecionar tudo para `/blog`.** Mais simples, mas descarta o
   posicionamento individual de cada artigo.

Recomendação: opção 1 para os artigos que já recebem tráfego (verificar no
Search Console) e opção 2 para o resto. Vale reescrever os textos sob a
nova diretriz antes de republicar — a maioria fala de tecnologia, não de
continuidade operacional.

A tabela `redirecionamentos` no banco já existe para isso, e o middleware
pode consultá-la se optarem por gerenciar os 301 pelo painel em vez de
pelo servidor web.

---

## Decisões pendentes

### 1. Ano de fundação — inconsistência real

Três fontes, três respostas:

| Fonte | Diz |
|---|---|
| Apresentação institucional 2026 | "Desde 2012 · 14 anos" |
| Site atual (`/sobre-nos`) | "Desde 2011" e "Há 12 anos" no rodapé |
| Instagram | "Desde 2011 nossa obsessão" |

O novo site adota **2012 / 14 anos**, seguindo o documento mais recente.
Precisa de confirmação — e, seja qual for a resposta, o Instagram e o
material comercial devem ser alinhados. Número institucional divergente
entre canais é o tipo de detalhe que um comprador corporativo nota.

Onde alterar: `src/conteudo/site.ts` (`fundacao`) e o texto "14 anos" em
`provas`, `src/app/(site)/sobre/page.tsx` e `src/conteudo/faq.ts`.

### 2. Tempo de primeira resposta

O site atual promete "até 3 minutos"; o Instagram diz "até 5". O novo site
usa **3 minutos**. Confirmar qual é o compromisso real — é uma promessa de
SLA exposta publicamente.

### 3. WhatsApp

`site.whatsappUrl` aponta para o número fixo (53) 3027-2698, que é o mesmo
link do site atual. Se existir um número de celular dedicado ao suporte,
substituir em `src/conteudo/site.ts`.

### 4. Conteúdo que ainda precisa de material real

Estas seções estão escritas e estruturadas, mas usam conteúdo
representativo que a CORZ precisa substituir:

- **`/sobre/equipe`** — descreve as áreas, não as pessoas. Faltam nomes,
  cargos e fotos. A estrutura já suporta.
- **`/podcast`** — os seis episódios listados vieram dos títulos reais do
  Instagram ("Papo com o Sócio" #06 a #11), mas faltam os arquivos de
  áudio e os links das plataformas.
- **`/sobre/imprensa`** — falta o pacote de arquivos vetoriais da marca
  para download.
- **Fotografia** — nenhuma imagem foi usada. A diretriz é explícita:
  nada de servidores genéricos, escudos ou cadeados. O que ela pede é
  operação real — caixas parados, filas, gestores preocupados, centros de
  distribuição, dashboards, mapas de unidades. Vale uma sessão de fotos
  nas redes atendidas (Nicolini, Peruzzo) em vez de banco de imagens.
- **Linha do tempo em `/sobre`** — 2021 (PABX com IA) e 2024
  (monitoramento próprio 24h) são datas inferidas do material. Confirmar.

### 5. Cases

O deck cita "99,7% de operação garantidos no Nicolini" e a Urcamp
escalando infraestrutura. Viram duas páginas de case fortes — hoje são
apenas menções. Vale produzir com número e depoimento, no formato
dor → risco → consequência → solução.

---

## Antes de apontar o domínio

- [ ] Segredos de produção gerados (`SESSAO_SEGREDO`, `CIFRA_SEGREDO`, `CRON_SEGREDO`)
- [ ] `NEXT_PUBLIC_SITE_URL=https://corz.com.br`
- [ ] Redirecionamentos 301 configurados
- [ ] Cron de publicação agendada ativo
- [ ] Contas do painel criadas e 2FA ativado em todas
- [ ] Sitemap enviado ao Search Console e ao Bing Webmaster Tools
- [ ] `/llms.txt` acessível publicamente
- [ ] Backup automático do Postgres configurado e uma restauração testada

---

## Revisão de agosto de 2026

Segunda rodada de ajustes, a partir da leitura do cliente sobre a
primeira versão. O que mudou:

### Estrutura e conteúdo

- **A plataforma de gestão não é mais nomeada em lugar nenhum.** Onde
  havia uma seção inteira sobre ela, entrou *Ninguém compra ferramenta,
  compra continuidade operacional*, com as três camadas de atuação.
  Quando o texto precisa mencionar que a CORZ opera uma plataforma
  própria de monitoramento, menciona sem dar nome.
- **Fim dos níveis Essencial, Avançado e Crítico.** No lugar entram
  **TI Estratégica, TI Tática e TI Operacional**, do post institucional
  da empresa. Não são pacotes de cardápio: são camadas de profundidade
  da parceria. Vivem em `conteudo/solucoes.ts`, no export `pilares`.
- **Oito soluções viraram seis.** Conectividade absorveu *Elo entre
  telecom e TI*; Laboratório absorveu *Desenvolvimento de sistemas*;
  Segurança virou **Cibersegurança**. Os três endereços antigos têm
  redirecionamento 301 em `next.config.ts`.
- **Varejo saiu do centro do argumento.** A estratégia comercial segue
  mirando redes, mas a copy fala de "unidade" e "sistemas críticos" em
  vez de loja e PDV, para não afastar indústria, serviços e ensino. O
  case Nicolini foi removido da home.
- **Suporte sem hierarquia de fila.** "Nem todo chamado tem a mesma
  pressa" saiu. A página agora afirma que todo cliente tem prioridade e
  que a classificação serve para contextualizar, não para ordenar.
- **Sem olhos de seção clichê.** "O contexto", "A consequência", "A
  dor", "A solução", "A tese", "O risco" e "Resposta direta" foram
  removidos. Onde o rótulo não nomeia algo concreto, não há rótulo.
- **Sem travessão** no corpo de texto e nos subtítulos.

### Desenho

- **Rótulos deixaram de ser monoespaçados em caixa-alta.** O par
  mono + versalete + entreletra larga é hoje uma assinatura de página
  gerada. O utilitário `rotulo` usa a fonte do corpo, em caixa normal.
- **O quadriculado virou coluna.** `malha` desenha apenas verticais
  largas e fracas, e sobrou em três lugares (herói, topo de página e
  rodapé) em vez de aparecer em toda seção escura.
- **Cantos mais macios.** `--radius-peca` foi de 4px para 10px e
  `--radius-bloco` (14px) entrou para blocos maiores.
- **Fim das grades de células coladas.** O padrão `gap-px` com fundo de
  fio deu lugar a cartões espaçados com borda própria.

### Peças novas

- `components/marca/Icones.tsx` — seis diagramas, um por solução, na
  mesma métrica. Usados nos cartões, no topo das páginas de solução e
  na faixa de "continue explorando".
- `components/inicio/QuatroPerguntas.tsx` — as quatro perguntas em um
  bloco só, com seleção. Mesma interação no celular e no desktop.
- `components/inicio/CamadasTI.tsx` — a pilha das três camadas, com fio
  contínuo ligando as três.
- `components/sobre/LinhaDoTempo.tsx` — cronologia com fio que muda de
  cor ao longo do percurso e ano ganhando presença conforme se aproxima
  de hoje.
- `components/blocos/FaixaComercial.tsx` — chamada comercial no meio das
  páginas de solução, com formulário e WhatsApp.
- `conteudo/artigos-demo.ts` — seis artigos completos que fazem o blog
  funcionar sem banco de dados.
- `conteudo/lideranca.ts` — as cinco pessoas da liderança.
- `conteudo/podcast.ts` — episódios com campo para o vídeo do YouTube.

### Pendências para o cliente

1. **Confirmar os nomes em `conteudo/lideranca.ts`.** Vieram de registro
   público de CNPJ e de perfil profissional, sem validação da empresa. O
   gerente operacional está como marcador.
2. **Foto da equipe** (`conteudo/lideranca.ts`, campo `fotoDoTime`).
   Enquanto for nula, a página mostra um espaço reservado desenhado.
3. **Vídeos do podcast** (`conteudo/podcast.ts`, campo `youtube` de cada
   episódio) e o endereço do canal, em `canal`.
4. **Retratos da liderança**, opcionais. Sem eles o cartão mostra o
   monograma da pessoa em cor da marca.

---

## Revisão de setembro de 2026

### A página em branco

O sintoma era entrar no endereço e receber uma tela vazia, com a
navegação só funcionando depois de passar por outra rota. A causa
estava na ordem das coisas: o HTML nascia com todo o conteúdo escondido
e dependia do JavaScript da página para revelá-lo. Qualquer coisa que
impedisse esse JavaScript de rodar, e um chunk defasado logo depois de
uma publicação é o caso mais comum, entregava a página vazia.

A ordem foi invertida. O conteúdo agora nasce visível e um script no
`<head>` liga a animação antes da primeira pintura, com um vigia que a
desliga se a hidratação não acontecer em 3 segundos. A pior falha
possível passou a devolver o site sem animação, que é um site que
funciona.

Junto vieram três reforços:

- `sharp` virou dependência declarada. Sem ele, o otimizador de imagem
  falha em produção e as imagens quebram.
- `error.tsx` e `global-error.tsx` substituem a tela em branco por uma
  página da marca com um botão de tentar de novo.
- `not-found.tsx` transforma o 404 em caminho para as quatro frentes.

### Quatro frentes no lugar de seis

O catálogo passou a espelhar o recorte da empresa:

| Frente | Escopo |
| --- | --- |
| Conectividade & Redes | Conectividade, WAN e rede interna das unidades |
| Cloud & Datacenter | Hospedar, processar, armazenar e recuperar ambientes |
| Modern Workplace | Sustentar usuários, dispositivos, colaboração e produtividade |
| Cibersegurança | Proteger identidades, dispositivos, aplicações, dados e redes |

PABX em nuvem deixou de ser frente e virou capacidade dentro de Modern
Workplace. Laboratório e Desenvolvimento saíram. Os oito endereços
antigos têm redirecionamento permanente em `next.config.ts`.

Cada página de frente ganhou um inventário de capacidades logo abaixo
do topo, agrupado por tema. Ele responde de olhos a pergunta que a
pessoa traz ao abrir a página, e entrega ao buscador os termos técnicos
que as pessoas efetivamente pesquisam (SD-WAN, EDR, XDR, MDR, ZTNA,
IDaaS, RPO, RTO, FinOps). O mesmo inventário vai estruturado em
JSON-LD e para o `llms.txt`.

### Home reordenada

Herói, o que a CORZ pratica, quem confia, e só então o argumento longo.
Quem chega quer saber o que a empresa faz e para quem antes de ouvir
qualquer tese.

Na faixa de provas, "1ª central PABX com IA do Brasil" deu lugar a
"3 minutos de SLA de primeira resposta".

### Herói

O painel de monitoramento saiu e entrou o símbolo da marca em branco,
animado: halo que respira em ciano e violeta, dois anéis girando em
sentidos opostos, as três faces do sinal acendendo em sequência e uma
lâmina de luz que atravessa de tempos em tempos. Tudo em CSS, nada
depende de hidratação para aparecer, e a resposta ao ponteiro acelera
os anéis e abre o brilho.

### Clientes

Rissul e Macromix saíram. Entraram Lifemed, UCPel, Termolar e Contato
Seguro. A faixa mudou de fundo escuro para claro: oito marcas com
paletas próprias sobre escuro exigiriam versões monocromáticas, o que
descaracteriza logo de cliente.

### Áreas fora do ar

Nosso Time, CORZ na Mídia, Blog e Podcast foram desligados sem serem
apagados. `lib/visibilidade.ts` é o interruptor: as rotas saem de todos
os menus, do rodapé, do mapa do site, do `llms.txt` e do grafo de dados
estruturados, e passam a responder 404. Para trazer qualquer uma de
volta, tire a linha de `ROTAS_OCULTAS` e o `oculto: true` correspondente
em `conteudo/site.ts`.

### Outros

- Assinatura "Feito por Manche" abaixo do rodapé, com link para
  `manche.ac`.
- LinkedIn corrigido para `linkedin.com/company/corztecnologia`.
- Formulários de contato e de chamado seguem o novo recorte de frentes.

---

## Ajustes de setembro de 2026, segunda rodada

### Marca e identidade

- **Favicon** refeito a partir do símbolo branco sobre o azul da marca,
  em `.ico` com seis tamanhos, `.svg`, ícone da Apple e os dois tamanhos
  do manifesto. O `.svg` reaproveita os mesmos três caminhos já
  desenhados em `components/marca/Logo.tsx`, para não existirem duas
  versões da marca podendo divergir.
- **Logo da Manche** corrigida. O olho é pintado em cinza claro opaco no
  arquivo original, e a conversão anterior pintava "tudo que é opaco" de
  branco, apagando justamente ele. Agora a luminância vira opacidade: o
  escuro fica branco e sólido, o claro fica vazado.

### Herói

O símbolo ficou bem maior e a iluminação saiu de dentro dele. Os
florescimentos agora são camadas da seção inteira, então a claridade
atravessa o título e morre sem aresta, em vez de terminar na borda de
uma caixa e desenhar um retângulo claro no fundo escuro. A lâmina de luz
que varre a marca passou a ser recortada pela silhueta dela.

### Forma

- Selo de homologação removido.
- A caixa azul de destaque voltou ao canto vivo, e a caixa do menu
  suspenso também. Os botões seguem arredondados.
- "CORZ" em caixa alta em todo botão que cita a marca.
- "Próximo passo" em `/sobre` com o destaque cabendo em uma linha.

### Interação

- **Conectividade** deixou de ser um diagrama parado. O barramento agora
  simula a queda do link: a linha fica vermelha, os sistemas apagam em
  cascata e a consequência de cada um acende ao lado. Roda sozinho em
  ciclo enquanto está na tela e para assim que alguém toca no botão.
- **Quatro perguntas** virou um bloco de abas que cabe em pouco mais de
  uma dobra. No celular a tira de abas rola na horizontal em vez de
  empilhar, então a interação é a mesma em qualquer tela. As setas do
  teclado andam entre as abas.

### Conteúdo

Cada uma das quatro frentes passou a listar os produtos que a compõem
com nome e uma explicação curta: são 43 itens no total, do acesso
dedicado e da fibra apagada ao ZTNA, ao FinOps e ao backup de SaaS. O
nome é o que a pessoa pesquisa, e a linha embaixo é o que faz a lista
informar em vez de só enfileirar siglas. O mesmo detalhamento vai para o
`llms.txt` e para os dados estruturados da página.

### Anos de operação

O "14 anos" virou cálculo. `anosDeOperacao()` soma um ano em março, no
fuso de São Paulo, e a home e a página Sobre passaram a reconstruir uma
vez por dia para o número não congelar na data da compilação.

---

## Ajustes de setembro de 2026, terceira rodada

### A moldura em volta do símbolo

A causa não era o efeito, era o componente de revelação. A regra
`.revelar[data-visivel="sim"]` aplicava `clip-path: inset(0 0 0 0)` a
todo elemento revelado, e não só ao modo "fio", que é o único que
precisa disso. O resultado era um recorte na caixa de cada bloco, mesmo
depois de revelado, e no herói isso cortava o halo do símbolo exatamente
na borda do contêiner.

Com o `clip-path` restrito ao modo "fio", o halo passou a transbordar. O
florescimento de seção que eu havia acrescentado na rodada anterior foi
removido: a luz voltou a sair do próprio símbolo, como antes, só que
agora sem barreira. O símbolo também cresceu um pouco, na mesma posição.

### Tarja azul e botões em uma linha

- `Destaque` ganhou `sm:whitespace-nowrap`. Sendo `inline-block`, quando
  a caixa não cabe na linha atual ela desce inteira para a próxima em
  vez de se partir no meio. No celular a quebra segue permitida: com a
  fonte no piso do `clamp`, proibi-la faria a frase vazar a tela.
- Os botões ganharam `whitespace-nowrap`, e os rótulos longos demais
  foram encurtados para caber no bloco estreito do topo das páginas de
  solução.
- Três títulos de frente foram reescritos para a tarja caber em uma
  linha em qualquer largura de desktop.

### Conectividade

O botão de simular saiu. A queda e o retorno agora acontecem em ciclo
constante e rápido, com a normalidade durando menos que a falha, porque
o quadro vermelho é o que carrega o argumento. Continua parando quando o
bloco sai da tela e sob `prefers-reduced-motion`.

### Quatro perguntas

O botão do painel passou a dizer "Quero esses dados em meu negócio".
