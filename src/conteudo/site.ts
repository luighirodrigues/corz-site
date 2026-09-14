/**
 * Configuração global do site e dados institucionais verificados.
 * Fonte: apresentação institucional CORZ 2026, diretriz de comunicação 2026
 * e dados públicos da empresa.
 */

export const site = {
  nome: "CORZ",
  nomeCompleto: "CORZ Tecnologia",
  razaoSocial: "CORZ Tecnologia Ltda",
  assinatura: "Tecnologia sem dor de cabeça.",
  descricao:
    "A CORZ mantém no ar a operação de empresas com múltiplas unidades: conectividade gerenciada, redes corporativas, segurança e continuidade operacional monitoradas 24/7 a partir de Pelotas/RS.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://corz.com.br",
  cnpj: "43.144.676/0001-61",
  fundacao: "2012",
  cidade: "Pelotas",
  uf: "RS",
  endereco: {
    logradouro: "Av. Dom Joaquim, 1014",
    bairro: "Três Vendas",
    cidade: "Pelotas",
    uf: "RS",
    cep: "96020-000",
    pais: "BR",
    latitude: -31.7376,
    longitude: -52.3335,
  },
  telefone: "(53) 3027-2698",
  telefoneE164: "+555330272698",
  whatsapp: "5553999999999",
  whatsappUrl: "https://api.whatsapp.com/send?phone=555330272698",
  email: "contato@corz.com.br",
  emailSuporte: "suporte@corz.com.br",
  redes: {
    instagram: "https://www.instagram.com/corztecnologia/",
    linkedin: "https://linkedin.com/company/corztecnologia",
  },
  atendimento: {
    comercial: "Segunda a sexta, 8h30 às 18h",
    suporte: "24 horas por dia, 7 dias por semana",
    slaPrimeiraResposta: "3 minutos",
  },
} as const;

/**
 * Anos completos de operação.
 *
 * A CORZ nasceu em março de 2012, então o número vira sozinho todo mês
 * de março. Antes disso, no mesmo ano civil, ainda vale o ano anterior.
 *
 * A conta é feita no fuso de São Paulo, e não no do servidor. Uma
 * hospedagem em UTC viraria o ano às 21h do dia 28 de fevereiro para
 * quem está no Brasil, que é justamente o tipo de detalhe que ninguém
 * confere e que alguém acaba notando.
 */
const MES_DO_ANIVERSARIO = 3; // março

export function anosDeOperacao(referencia: Date = new Date()) {
  const [ano, mes] = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "numeric",
  })
    .format(referencia)
    .split("/")
    .map(Number)
    .reverse() as [number, number];

  const bruto = ano - Number(site.fundacao);
  return mes >= MES_DO_ANIVERSARIO ? bruto : bruto - 1;
}

/**
 * Números que a CORZ pode provar. Nada aqui é estimativa.
 *
 * É uma função, e não uma constante, porque o primeiro número depende
 * da data. Congelado numa constante, ele pararia no ano da compilação.
 */
export function provasDeAgora() {
  return [
  {
    valor: String(anosDeOperacao()),
    sufixo: " anos",
    rotulo: "de operação contínua",
    detalhe: `Desde ${site.fundacao}, em ${site.cidade}/${site.uf}`,
  },
  {
    valor: "99,7",
    sufixo: "%",
    rotulo: "de disponibilidade média",
    detalhe: "Medida nas redes que gerenciamos",
  },
  {
    valor: "3",
    sufixo: " min",
    rotulo: "tempo médio de primeira resposta",
    detalhe: "Agilidade no atendimento, sem fila preferencial",
  },
  {
    valor: "4",
    sufixo: " bi de reais",
    prefixo: "+ ",
    rotulo: "em operações protegidas",
    detalhe: "Faturamento sob nossa cibersegurança",
  },
  ] as const;
}

/**
 * Empresas atendidas.
 *
 * Arquivos em cor cheia sobre fundo transparente, todos preparados para
 * ler sobre superfície clara, que é onde a faixa vive. `largura` e
 * `altura` são as do arquivo, usadas para reservar o espaço e evitar
 * salto de layout enquanto a imagem carrega.
 */
export const clientes = [
  {
    nome: "Lifemed",
    setor: "Indústria da saúde",
    arquivo: "/clientes/mural/lifemed.png",
    largura: 480,
    altura: 200,
  },
  {
    nome: "UCPel",
    setor: "Ensino superior",
    arquivo: "/clientes/mural/ucpel.png",
    largura: 480,
    altura: 200,
  },
  {
    nome: "Termolar",
    setor: "Indústria",
    arquivo: "/clientes/mural/termolar.png",
    largura: 480,
    altura: 200,
  },
  {
    nome: "Contato Seguro",
    setor: "Compliance",
    arquivo: "/clientes/mural/contato-seguro.png",
    largura: 480,
    altura: 200,
  },
  {
    nome: "Nicolini Supermercados",
    setor: "Supermercados",
    arquivo: "/clientes/mural/nicolini.png",
    largura: 480,
    altura: 200,
  },
  {
    nome: "Peruzzo",
    setor: "Supermercados",
    arquivo: "/clientes/mural/peruzzo.png",
    largura: 480,
    altura: 200,
  },
  {
    nome: "Rede Vivo",
    setor: "Supermercados",
    arquivo: "/clientes/mural/rede-vivo.png",
    largura: 480,
    altura: 200,
  },
  {
    nome: "Urcamp",
    setor: "Ensino superior",
    arquivo: "/clientes/mural/urcamp.png",
    largura: 480,
    altura: 200,
  },
] as const;

/**
 * Mural do "Sobre".
 *
 * Os mesmos clientes da home mais sete, em arquivos próprios: todos
 * numa tela de 480×200 com o logotipo nivelado pela área de tinta, e
 * não pela caixa. Sem esse nivelamento um selo redondo pesa o dobro de
 * um logotipo em linha do mesmo "tamanho", e a fita passa parecendo
 * desalinhada mesmo com todo mundo na mesma altura de CSS.
 *
 * A ordem alterna marca larga e marca compacta de propósito: como a
 * fita corre sem parar, é a alternância que evita blocos visuais
 * pesados passando juntos.
 *
 * Fica separado de `clientes` porque a home não usa esta versão — lá a
 * grade continua com os arquivos originais.
 */
export const clientesMural = [
  { nome: "Lifemed", arquivo: "/clientes/mural/lifemed.png" },
  { nome: "Saúde Maior", arquivo: "/clientes/mural/saude-maior.png" },
  { nome: "UCPel", arquivo: "/clientes/mural/ucpel.png" },
  { nome: "Grupo Michigan", arquivo: "/clientes/mural/michigan.png" },
  { nome: "Termolar", arquivo: "/clientes/mural/termolar.png" },
  { nome: "Tterrasul", arquivo: "/clientes/mural/tterrasul.png" },
  { nome: "Contato Seguro", arquivo: "/clientes/mural/contato-seguro.png" },
  { nome: "Ferraçosul", arquivo: "/clientes/mural/ferracosul.png" },
  { nome: "Nicolini Supermercados", arquivo: "/clientes/mural/nicolini.png" },
  { nome: "Novara Laboratório", arquivo: "/clientes/mural/novara.png" },
  { nome: "Peruzzo", arquivo: "/clientes/mural/peruzzo.png" },
  { nome: "Tordilho Alimentos", arquivo: "/clientes/mural/tordilho.png" },
  { nome: "Rede Vivo", arquivo: "/clientes/mural/rede-vivo.png" },
  { nome: "Birck", arquivo: "/clientes/mural/birck.png" },
  { nome: "Urcamp", arquivo: "/clientes/mural/urcamp.png" },
];

/** Tela única de todo arquivo do mural. */
export const MURAL_LARGURA = 480;
export const MURAL_ALTURA = 200;

export type ItemNavegacao = {
  rotulo: string;
  href: string;
  /** Retira o item de menus, rodapé, mapa do site e llms.txt. */
  oculto?: boolean;
};

export type GrupoNavegacao = ItemNavegacao & { filhos?: ItemNavegacao[] };

/**
 * Navegação.
 *
 * `oculto` retira o item de todos os menus, do rodapé, do mapa do site e
 * do resumo para assistentes, sem apagar a rota do repositório. É como
 * uma aba sai do ar temporariamente sem que o trabalho feito nela seja
 * perdido: o dia em que voltar, é uma linha que muda.
 *
 * A lista das rotas efetivamente ocultas vive em `lib/visibilidade`, que
 * é quem faz as páginas responderem 404 enquanto durar a ocultação.
 */
export const navegacao: GrupoNavegacao[] = [
  {
    rotulo: "Soluções",
    href: "/solucoes",
    filhos: [
      { rotulo: "Conectividade & Redes", href: "/solucoes/conectividade-redes" },
      { rotulo: "Cloud & Datacenter", href: "/solucoes/cloud-datacenter" },
      { rotulo: "Modern Workplace", href: "/solucoes/modern-workplace" },
      { rotulo: "Cibersegurança", href: "/solucoes/ciberseguranca" },
    ],
  },
  {
    rotulo: "Sobre",
    href: "/sobre",
    filhos: [
      { rotulo: "Nosso time", href: "/sobre/equipe", oculto: true },
      { rotulo: "Trabalhe conosco", href: "/sobre/carreiras" },
      { rotulo: "CORZ na mídia", href: "/sobre/imprensa", oculto: true },
    ],
  },
  {
    rotulo: "Suporte",
    href: "/suporte",
    filhos: [
      { rotulo: "Abrir chamado", href: "/suporte/abrir-chamado" },
      { rotulo: "Perguntas frequentes", href: "/suporte/faq" },
    ],
  },
  { rotulo: "Blog", href: "/blog", oculto: true },
  { rotulo: "Podcast", href: "/podcast", oculto: true },
  { rotulo: "Contato", href: "/contato" },
];

export const rodape: Record<
  "institucional" | "solucoes" | "conteudo" | "legal",
  ItemNavegacao[]
> = {
  institucional: [
    { rotulo: "Sobre a CORZ", href: "/sobre" },
    { rotulo: "Nosso time", href: "/sobre/equipe", oculto: true },
    { rotulo: "Trabalhe conosco", href: "/sobre/carreiras" },
    { rotulo: "CORZ na mídia", href: "/sobre/imprensa", oculto: true },
    { rotulo: "Contato", href: "/contato" },
  ],
  solucoes: [
    { rotulo: "Conectividade & Redes", href: "/solucoes/conectividade-redes" },
    { rotulo: "Cloud & Datacenter", href: "/solucoes/cloud-datacenter" },
    { rotulo: "Modern Workplace", href: "/solucoes/modern-workplace" },
    { rotulo: "Cibersegurança", href: "/solucoes/ciberseguranca" },
  ],
  conteudo: [
    { rotulo: "Blog", href: "/blog", oculto: true },
    { rotulo: "Podcast", href: "/podcast", oculto: true },
    { rotulo: "Abrir chamado", href: "/suporte/abrir-chamado" },
    { rotulo: "Perguntas frequentes", href: "/suporte/faq" },
  ],
  legal: [
    { rotulo: "Privacidade e LGPD", href: "/legal/privacidade" },
    { rotulo: "Termos de uso", href: "/legal/termos" },
    { rotulo: "Política de cookies", href: "/legal/cookies" },
  ],
};
