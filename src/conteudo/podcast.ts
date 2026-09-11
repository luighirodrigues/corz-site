/**
 * Papo com o Sócio.
 *
 * O podcast é gravado em vídeo e fica hospedado no YouTube. O site não
 * guarda arquivo de mídia: cada episódio precisa apenas do identificador
 * do vídeo, que é o trecho depois de `v=` no endereço.
 *
 *   https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *                                   └──────────┘
 *                                   é isto que entra em `youtube`
 *
 * Enquanto `youtube` for nulo, o episódio aparece na lista sem player e
 * o destaque mostra um espaço reservado. Preencher o campo é tudo o que
 * falta para o vídeo entrar no ar.
 *
 * `canal` é o endereço do canal ou da playlist, usado no botão que leva
 * para a lista completa.
 */

export type Episodio = {
  numero: string;
  titulo: string;
  resumo: string;
  duracao: string;
  /** Identificador do vídeo no YouTube. Nulo enquanto não publicado. */
  youtube: string | null;
};

export const canal = "https://www.youtube.com/@corztecnologia";

export const episodios: Episodio[] = [
  {
    numero: "11",
    titulo: "A fatura de TI não fecha",
    resumo:
      "Por que a conta de telecom cresce sozinha, onde moram os custos invisíveis e como uma auditoria muda a conversa com a operadora.",
    duracao: "38 min",
    youtube: null,
  },
  {
    numero: "10",
    titulo: "Inovação e tecnologia na operação",
    resumo:
      "O que muda na infraestrutura quando uma empresa abre unidades mais rápido do que consegue padronizar.",
    duracao: "44 min",
    youtube: null,
  },
  {
    numero: "09",
    titulo: "Quando a unidade fica sem internet",
    resumo:
      "A anatomia de uma queda: o que acontece do minuto zero até a operação voltar, e onde o tempo é realmente perdido.",
    duracao: "41 min",
    youtube: null,
  },
  {
    numero: "08",
    titulo: "Perda de previsibilidade",
    resumo:
      "Gestão por achismo contra gestão por dado de disponibilidade. O que a liderança deixa de enxergar sem histórico.",
    duracao: "36 min",
    youtube: null,
  },
  {
    numero: "07",
    titulo: "A IA ainda é muito nova?",
    resumo:
      "Onde inteligência artificial já entrega resultado na operação e onde ainda é promessa cara.",
    duracao: "47 min",
    youtube: null,
  },
  {
    numero: "06",
    titulo: "Transparência nos contratos",
    resumo:
      "Por que renovação automática é o modelo de negócio da operadora, e como sair dele sem perder qualidade.",
    duracao: "33 min",
    youtube: null,
  },
];

/** Primeiro episódio já com vídeo publicado, para o destaque da página. */
export const episodioDestaque = episodios.find((e) => e.youtube) ?? null;
