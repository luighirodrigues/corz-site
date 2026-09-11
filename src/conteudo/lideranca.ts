/**
 * Liderança da CORZ.
 *
 * ┌─────────────────────────────────────────────────────────────────┐
 * │  CONFIRMAR ANTES DE PUBLICAR EM PRODUÇÃO                         │
 * │                                                                 │
 * │  Os nomes dos três sócios vieram do quadro societário público    │
 * │  registrado em bases de CNPJ, e o do gerente comercial de perfil │
 * │  profissional público. Nenhum foi confirmado pela empresa.       │
 * │  O gerente operacional está como marcador.                       │
 * │                                                                 │
 * │  Confira nome, grafia e cargo de cada pessoa neste arquivo. É o  │
 * │  único lugar onde essa informação existe no site.                │
 * └─────────────────────────────────────────────────────────────────┘
 *
 * As cores são as da paleta institucional, não semânticas: verde e
 * âmbar carregam significado de estado no resto do site e não devem
 * identificar pessoa. Todas foram escolhidas escuras o bastante para o
 * monograma ficar legível sobre o próprio fundo claro.
 *
 * O campo `foto` é opcional. Sem arquivo, o cartão exibe o monograma
 * da pessoa em cor da marca, que é uma ausência desenhada em vez de um
 * quadrado cinza de imagem quebrada. Para usar retrato de verdade,
 * coloque o arquivo em `public/time/` e aponte aqui.
 */

export type Pessoa = {
  nome: string;
  cargo: string;
  /** Uma frase sobre o que essa pessoa responde na prática. */
  atuacao: string;
  /** Caminho a partir de /public. Opcional. */
  foto?: string;
  cor: string;
};

export const socios: Pessoa[] = [
  {
    nome: "Antonio Barbosa Rodrigues Junior",
    cargo: "Sócio-administrador",
    atuacao:
      "Responde pela direção técnica. Participa das decisões de arquitetura dos clientes de operação crítica.",
    cor: "#00ADE7",
  },
  {
    nome: "Tiago Coimbra Rezende",
    cargo: "Sócio-administrador",
    atuacao:
      "Conduz a relação com os clientes e a estratégia comercial da CORZ desde a fundação.",
    cor: "#3F39BD",
  },
  {
    nome: "Aline Coimbra Rezende",
    cargo: "Sócia-administradora",
    atuacao:
      "Responde pela administração e pelos processos internos que sustentam a entrega.",
    cor: "#2C3191",
  },
];

export const gerencia: Pessoa[] = [
  {
    nome: "Maurício Barañano",
    cargo: "Gerente comercial",
    atuacao:
      "Primeiro contato de quem chega à CORZ. Conduz o diagnóstico e o desenho da proposta.",
    cor: "#1D4FD8",
  },
  {
    nome: "Gerente operacional",
    cargo: "Gerência operacional",
    atuacao:
      "Coordena o centro de operações e a fila de chamados. Responde pelo tempo de resposta prometido.",
    cor: "#00304D",
  },
];

/**
 * Foto geral da equipe.
 *
 * Enquanto `arquivo` for nulo, a página desenha um espaço reservado
 * explicando o que entra ali. Trocar por uma foto é preencher o campo.
 */
export const fotoDoTime: {
  arquivo: string | null;
  alt: string;
  legenda: string;
} = {
  arquivo: null,
  alt: "Equipe da CORZ Tecnologia reunida na sede em Pelotas",
  legenda:
    "O time que atende quando a operação para. Sede da CORZ, Pelotas/RS.",
};

/** Iniciais para o monograma, no máximo duas letras. */
export function iniciais(nome: string) {
  const partes = nome
    .split(/\s+/)
    .filter((p) => p.length > 2 && !/^(de|da|do|dos|das)$/i.test(p));
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1]![0] : "";
  return (primeira + ultima).toUpperCase();
}
