/**
 * Conteúdo de vitrine do blog.
 *
 * Serve para o site rodar inteiro sem banco de dados. Enquanto
 * `DATABASE_URL` não estiver definida, a camada de artigos entrega estes
 * registros e o blog fica navegável de ponta a ponta: listagem,
 * categorias, artigo aberto, relacionados e RSS.
 *
 * Assim que o Postgres entrar no ar, nada aqui é usado. A troca é
 * automática e não exige mexer em nenhuma página. O painel
 * administrativo continua sendo a única forma de publicar de verdade.
 *
 * As datas são fixas de propósito: data calculada na importação faria o
 * conteúdo estático mudar a cada compilação.
 */

export type CategoriaDemo = {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  cor: string;
  ordem: number;
};

export const categoriasDemo: CategoriaDemo[] = [
  {
    id: "cat-continuidade",
    slug: "continuidade",
    nome: "Continuidade",
    descricao: "Disponibilidade, contingência e custo de parada.",
    cor: "#00ADE7",
    ordem: 1,
  },
  {
    id: "cat-seguranca",
    slug: "ciberseguranca",
    nome: "Cibersegurança",
    descricao: "Proteção de borda, acessos, backup e resposta a incidente.",
    cor: "#E20D50",
    ordem: 2,
  },
  {
    id: "cat-redes",
    slug: "redes",
    nome: "Redes e telecom",
    descricao: "Projeto de rede, links, contratos e auditoria.",
    cor: "#3F39BD",
    ordem: 3,
  },
  {
    id: "cat-gestao",
    slug: "gestao",
    nome: "Gestão de TI",
    descricao: "Governança, indicadores e decisão de infraestrutura.",
    cor: "#89E20D",
    ordem: 4,
  },
];

export type ArtigoDemo = {
  id: string;
  slug: string;
  titulo: string;
  subtitulo: string | null;
  resumo: string;
  capaUrl: string | null;
  capaAlt: string | null;
  tempoLeitura: number;
  destaque: boolean;
  publicadoEm: Date;
  agendadoPara: Date | null;
  atualizadoEm: Date;
  criadoEm: Date;
  categoriaNome: string | null;
  categoriaSlug: string | null;
  categoriaCor: string | null;
  autorNome: string | null;
  autorCargo: string | null;
  autorBio: string | null;
  conteudo: string;
  textoPuro: string;
  respostaCurta: string | null;
  faq: { pergunta: string; resposta: string }[] | null;
  seoTitulo: string | null;
  seoDescricao: string | null;
  seoImagem: string | null;
  canonical: string | null;
  noindex: boolean;
};

/** Reduz repetição: só o que muda entra em cada artigo. */
function artigo(
  base: Pick<
    ArtigoDemo,
    | "id"
    | "slug"
    | "titulo"
    | "subtitulo"
    | "resumo"
    | "tempoLeitura"
    | "respostaCurta"
    | "conteudo"
    | "faq"
  > & {
    categoria: CategoriaDemo;
    data: string;
    autor: string;
    cargo: string;
    destaque?: boolean;
  }
): ArtigoDemo {
  const quando = new Date(base.data);
  return {
    id: base.id,
    slug: base.slug,
    titulo: base.titulo,
    subtitulo: base.subtitulo,
    resumo: base.resumo,
    capaUrl: null,
    capaAlt: null,
    tempoLeitura: base.tempoLeitura,
    destaque: base.destaque ?? false,
    publicadoEm: quando,
    agendadoPara: null,
    atualizadoEm: quando,
    criadoEm: quando,
    categoriaNome: base.categoria.nome,
    categoriaSlug: base.categoria.slug,
    categoriaCor: base.categoria.cor,
    autorNome: base.autor,
    autorCargo: base.cargo,
    autorBio:
      "Escreve a partir do que a CORZ opera todos os dias em redes com múltiplas unidades.",
    conteudo: base.conteudo,
    textoPuro: base.conteudo.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
    respostaCurta: base.respostaCurta,
    faq: base.faq,
    seoTitulo: null,
    seoDescricao: base.resumo,
    seoImagem: null,
    canonical: null,
    noindex: false,
  };
}

const [continuidade, ciberseguranca, redes, gestao] = categoriasDemo as [
  CategoriaDemo,
  CategoriaDemo,
  CategoriaDemo,
  CategoriaDemo,
];

export const artigosDemo: ArtigoDemo[] = [
  artigo({
    id: "art-custo-hora-parada",
    slug: "quanto-custa-uma-hora-de-operacao-parada",
    titulo: "Quanto custa, de verdade, uma hora de operação parada",
    subtitulo: "A conta que quase nenhuma empresa fez, e que muda a decisão",
    resumo:
      "A maioria das empresas discute o preço do contrato de TI sem saber quanto vale uma hora da própria operação. Feita a conta, a discussão muda de lugar.",
    tempoLeitura: 6,
    destaque: true,
    categoria: continuidade,
    data: "2026-07-28T12:00:00Z",
    autor: "Equipe CORZ",
    cargo: "Operações",
    respostaCurta:
      "Para estimar o custo de uma hora parada, divida o faturamento mensal pelas horas efetivas de operação no mês. Uma empresa que fatura R$ 4 milhões em 312 horas úteis perde cerca de R$ 12.800 por hora, sem contar folha parada, retrabalho e clientes que não voltam.",
    conteudo: `
<p>Quando a operação para, o prejuízo aparece em três lugares diferentes, e só um deles costuma ser calculado. O primeiro é a receita não realizada, que é a conta óbvia. O segundo é o custo fixo que continua correndo com todo mundo parado. O terceiro é o mais caro e o mais invisível: o cliente que desistiu de esperar e resolveu o problema dele em outro lugar.</p>
<h2>A conta mínima</h2>
<p>Comece pelo mais simples. Pegue o faturamento mensal e divida pelo número real de horas de operação no mês. Uma empresa que fatura R$ 4 milhões e opera 26 dias por mês, 12 horas por dia, tem 312 horas úteis. Cada hora vale, em média, cerca de R$ 12.800.</p>
<p>Quatro horas paradas em um mês, algo absolutamente banal em operação sem monitoramento, custam mais de R$ 51 mil. No ano, passa de R$ 600 mil.</p>
<blockquote>O contrato de infraestrutura raramente é o item caro do orçamento. O item caro é o que acontece quando ele não existe.</blockquote>
<h2>O que a conta simples não mostra</h2>
<ul>
<li>A folha continua correndo com a equipe sem conseguir trabalhar.</li>
<li>O retrabalho depois que o sistema volta consome mais horas produtivas.</li>
<li>Prazos contratuais descumpridos podem gerar multa.</li>
<li>O pico de demanda represado nem sempre é recuperado depois.</li>
</ul>
<h2>Por que isso muda a decisão</h2>
<p>Quem não fez a conta compara o custo de um contrato de gestão com zero. Quem fez compara com o valor da parada. São conversas completamente diferentes, e apenas a segunda leva a uma decisão informada.</p>
<h3>Como medir na sua empresa</h3>
<p>Você não precisa de um projeto para isso. Precisa de três números: faturamento mensal, horas de operação por mês e quantas horas a operação ficou indisponível no último trimestre. O terceiro é o que quase ninguém tem, e a ausência dele já é a resposta.</p>
`,
    faq: [
      {
        pergunta: "Como saber quantas horas minha operação ficou parada?",
        resposta:
          "Sem monitoramento ativo, não dá para saber com precisão: o registro depende de alguém ter anotado. Com monitoramento por unidade, cada indisponibilidade fica registrada com horário de início, duração e causa, e o número deixa de ser estimativa.",
      },
      {
        pergunta: "Vale a pena investir em redundância para todas as unidades?",
        resposta:
          "Nem sempre. A redundância é dimensionada por criticidade: uma unidade que fatura o dobro justifica um investimento que outra não justifica. O critério é o custo da hora parada daquele ponto específico, não um padrão único para toda a rede.",
      },
    ],
  }),

  artigo({
    id: "art-borda-unidade",
    slug: "a-matriz-esta-protegida-e-as-outras-unidades",
    titulo: "A matriz está protegida. E as outras unidades?",
    subtitulo: "O ataque entra por onde ninguém está olhando",
    resumo:
      "É comum encontrar o firewall mais caro do contrato na matriz enquanto cada unidade acessa a internet por um roteador de operadora com senha de fábrica.",
    tempoLeitura: 7,
    categoria: ciberseguranca,
    data: "2026-07-14T12:00:00Z",
    autor: "Equipe CORZ",
    cargo: "Cibersegurança",
    respostaCurta:
      "Proteger apenas a matriz deixa a operação exposta: cada unidade conectada à rede corporativa é uma porta de entrada. A proteção precisa estar na borda de cada ponto, com política padronizada, segmentação de rede e backup com restauração testada.",
    conteudo: `
<p>Existe um padrão que se repete em quase toda operação com múltiplas unidades. O investimento em segurança se concentra onde fica a diretoria, e as demais unidades ficam com o equipamento que a operadora instalou, configuração de fábrica e senha que nunca mudou.</p>
<h2>Por que o atacante prefere a unidade</h2>
<p>Porque é mais fácil. O caminho de menor resistência não passa pelo firewall bem configurado da matriz, passa pelo ponto onde ninguém revisou nada nos últimos três anos. E, uma vez dentro, a rede corporativa costuma ser plana o bastante para permitir caminhar até onde estão os sistemas centrais.</p>
<h2>Três correções que mudam o cenário</h2>
<h3>Borda protegida em cada ponto</h3>
<p>Firewall gerenciado na entrada de cada unidade, com a mesma política aplicada em todas. Não é sobre comprar o equipamento mais caro, é sobre não deixar nenhum ponto sem controle.</p>
<h3>Segmentação real</h3>
<p>Sistemas críticos, câmeras, estações administrativas e Wi-Fi de visitante em redes que não se enxergam. Um dispositivo comprometido precisa continuar isolado do que sustenta o faturamento.</p>
<h3>Backup que já foi restaurado</h3>
<p>Backup que nunca voltou não é backup, é uma expectativa. O teste de restauração precisa ser periódico e o tempo real de recuperação precisa estar registrado.</p>
<h2>A pergunta que resume tudo</h2>
<p>Sua empresa sobreviveria a 48 horas sem acesso aos sistemas? Não é uma pergunta retórica: é o tempo médio que uma operação leva para voltar quando não havia plano definido antes.</p>
`,
    faq: [
      {
        pergunta: "Antivírus e firewall não bastam?",
        resposta:
          "Não. São controles, não uma estratégia. Sem segmentação de rede, gestão de credenciais, backup testado e um plano de resposta, um único clique em uma unidade ainda derruba a operação inteira.",
      },
    ],
  }),

  artigo({
    id: "art-auditoria-telecom",
    slug: "por-que-a-fatura-de-telecom-quase-nunca-bate",
    titulo: "Por que a fatura de telecom quase nunca bate com o contrato",
    subtitulo: "Circuitos desativados, serviços que ninguém pediu e reajustes silenciosos",
    resumo:
      "Auditoria de telecom raramente encontra uma cobrança grande e errada. Encontra dezenas de pequenas, repetidas todo mês, há anos.",
    tempoLeitura: 5,
    categoria: redes,
    data: "2026-06-30T12:00:00Z",
    autor: "Equipe CORZ",
    cargo: "Telecom",
    respostaCurta:
      "As divergências mais comuns em faturas de telecom são circuitos de endereços desativados que continuam sendo cobrados, serviços adicionais nunca solicitados, reajustes acima do previsto em contrato e velocidade cobrada acima da entregue. A conferência exige cruzar fatura, contrato e uso medido.",
    conteudo: `
<p>Uma empresa com trinta unidades pode ter mais de cem itens cobrados por mês entre links, linhas, serviços adicionais e taxas. Ninguém confere isso linha a linha, e é exatamente por isso que a divergência se acumula.</p>
<h2>O que costuma aparecer</h2>
<ul>
<li>Circuitos de endereços já desativados, ainda ativos na fatura.</li>
<li>Serviços adicionais habilitados sem solicitação registrada.</li>
<li>Reajuste aplicado acima do índice previsto em contrato.</li>
<li>Velocidade contratada diferente da efetivamente entregue.</li>
<li>Multa de fidelidade cobrada fora do prazo de vigência.</li>
</ul>
<h2>Por que a conferência interna raramente funciona</h2>
<p>Não é falta de competência, é falta de tempo e de base de comparação. Conferir exige ter em mãos o contrato original de cada circuito, o histórico de alteração e a medição real de uso. Esse conjunto costuma estar espalhado entre financeiro, TI e a caixa de e-mail de quem contratou.</p>
<h2>O ganho não é só financeiro</h2>
<p>O inventário que a auditoria produz vale tanto quanto o crédito recuperado. Saber exatamente quantos circuitos existem, onde estão, quanto custam e o que entregam é o que permite negociar a próxima renovação com argumento técnico em vez de com estimativa.</p>
`,
    faq: [
      {
        pergunta: "Quanto tempo leva uma auditoria de telecom?",
        resposta:
          "O inventário inicial costuma levar de duas a quatro semanas, dependendo do número de unidades e da organização documental. As contestações protocoladas junto às operadoras seguem prazos próprias de cada empresa e são acompanhadas até o crédito aparecer.",
      },
    ],
  }),

  artigo({
    id: "art-rede-plana",
    slug: "o-link-esta-perfeito-e-mesmo-assim-tudo-esta-lento",
    titulo: "O link está perfeito e mesmo assim tudo está lento",
    subtitulo: "Quando o problema não é a internet, é a rede de dentro",
    resumo:
      "O gerente jura que a internet caiu. A operadora jura que o link está estável. Os dois estão certos, e o problema está em outro lugar.",
    tempoLeitura: 6,
    categoria: redes,
    data: "2026-06-16T12:00:00Z",
    autor: "Equipe CORZ",
    cargo: "Redes",
    respostaCurta:
      "Lentidão com link estável costuma ter origem na rede interna: switch saturado, Wi-Fi de visitante dividindo banda com sistemas críticos, cabeamento fora de padrão ou ausência de segmentação. O diagnóstico exige medir dentro da unidade, não apenas o circuito da operadora.",
    conteudo: `
<p>Esta é uma das conversas mais repetidas em operações com várias unidades. A unidade reclama de lentidão, a operadora apresenta um relatório impecável de disponibilidade do circuito, e a discussão trava.</p>
<h2>Onde costuma estar</h2>
<h3>Rede plana</h3>
<p>Sistemas críticos, câmeras, estações administrativas e Wi-Fi de visitante disputando a mesma rede. Uma câmera enviando gravação em horário de pico compete diretamente com o sistema que fecha a venda.</p>
<h3>Wi-Fi dimensionado para a unidade vazia</h3>
<p>A cobertura foi testada em um dia calmo. No horário de maior movimento, com o dobro de dispositivos conectados, o mesmo ponto de acesso não dá conta.</p>
<h3>Topologia que só existe na memória de alguém</h3>
<p>Sem documentação, cada diagnóstico começa do zero. E cada troca de equipamento vira um dia de obra em vez de dez minutos de restauração de configuração.</p>
<h2>Como sair do impasse</h2>
<p>Medindo dentro. Enquanto a única medição disponível for a da operadora, a discussão continua sendo uma questão de palavra contra palavra. Com monitoramento interno por unidade, o gargalo aparece com nome e horário.</p>
`,
    faq: null,
  }),

  artigo({
    id: "art-indicadores-ti",
    slug: "quatro-indicadores-que-a-diretoria-deveria-cobrar-da-ti",
    titulo: "Quatro indicadores que a diretoria deveria cobrar da TI",
    subtitulo: "Sem eles, a decisão de infraestrutura é feita no escuro",
    resumo:
      "Não é preciso entender de rede para cobrar TI. É preciso cobrar os quatro números que traduzem infraestrutura em risco de negócio.",
    tempoLeitura: 5,
    categoria: gestao,
    data: "2026-05-29T12:00:00Z",
    autor: "Equipe CORZ",
    cargo: "Gestão",
    respostaCurta:
      "Os quatro indicadores essenciais são: disponibilidade real por unidade, tempo médio de recuperação, custo de telecom por unidade e cobertura de backup com restauração testada. Juntos, eles traduzem infraestrutura em risco operacional mensurável.",
    conteudo: `
<p>Infraestrutura costuma ser discutida em vocabulário técnico, e isso afasta quem decide. Mas os quatro números que realmente importam não exigem conhecimento de rede para serem interpretados.</p>
<h2>1. Disponibilidade real por unidade</h2>
<p>Não a prometida em contrato, a medida. Quantas horas cada ponto ficou indisponível no último trimestre. É o número que transforma uma reclamação difusa em fato.</p>
<h2>2. Tempo médio de recuperação</h2>
<p>Quando algo falha, quanto tempo leva até voltar. Uma operação pode ter poucas falhas e ainda assim um risco altíssimo, se cada falha significar meio dia parado.</p>
<h2>3. Custo de telecom por unidade</h2>
<p>Comparável entre pontos semelhantes. Diferenças grandes entre unidades do mesmo porte quase sempre indicam contrato desatualizado ou serviço cobrado sem uso.</p>
<h2>4. Cobertura de backup com restauração testada</h2>
<p>Percentual dos sistemas críticos cujo backup foi efetivamente restaurado em teste no último período. Backup não testado é uma linha de contrato, não uma proteção.</p>
<h2>Se algum desses números não existe</h2>
<p>A ausência do indicador é a informação. Não dá para gerenciar risco que ninguém está medindo, e a primeira entrega de qualquer trabalho sério de infraestrutura é justamente produzir esses quatro números.</p>
`,
    faq: [
      {
        pergunta: "Com que frequência esses indicadores devem ser revisados?",
        resposta:
          "Disponibilidade e tempo de recuperação fazem sentido em relatório mensal. Custo de telecom e cobertura de backup funcionam bem em revisão trimestral, acompanhando o ciclo de contratos e de mudanças na operação.",
      },
    ],
  }),

  artigo({
    id: "art-abertura-unidade",
    slug: "abrir-uma-unidade-nova-sem-improviso-no-dia-da-inauguracao",
    titulo: "Abrir uma unidade nova sem improviso no dia da inauguração",
    subtitulo: "O padrão replicável que evita a corrida de última hora",
    resumo:
      "Toda expansão tem uma inauguração em que o link não chegou a tempo. Isso é sintoma de processo, não de azar.",
    tempoLeitura: 5,
    categoria: gestao,
    data: "2026-05-12T12:00:00Z",
    autor: "Equipe CORZ",
    cargo: "Projetos",
    respostaCurta:
      "Abrir uma unidade sem improviso exige três coisas definidas antes da obra: prazo real de instalação do link contratado com antecedência, um padrão de rede replicável já documentado e um plano de contingência para operar caso o circuito principal atrase.",
    conteudo: `
<p>A cena se repete em quase toda expansão. A obra terminou, a equipe está treinada, o estoque chegou, e o link de internet tem previsão de instalação para depois da data de inauguração.</p>
<h2>Por que acontece</h2>
<p>Porque a contratação do circuito costuma ser tratada como item de última hora, quando na prática é um dos poucos itens do projeto cujo prazo não depende da empresa. Uma instalação de link dedicado pode levar semanas, e nenhuma pressão interna acelera obra de operadora.</p>
<h2>O que resolve</h2>
<ul>
<li>Contratar o circuito assim que o endereço estiver definido, não quando a obra terminar.</li>
<li>Ter um padrão de rede documentado que qualquer técnico consegue replicar.</li>
<li>Definir a contingência antes: link móvel de reserva permite abrir operando, mesmo com o principal atrasado.</li>
<li>Manter um inventário de equipamentos de abertura, evitando compra emergencial.</li>
</ul>
<h2>O ganho invisível</h2>
<p>Um padrão replicável não serve só para a inauguração. Serve para todo dia depois dela: quem resolve um problema em uma unidade resolve em qualquer outra, porque todas são iguais por dentro.</p>
`,
    faq: null,
  }),
];
