/**
 * Ícones das quatro frentes.
 *
 * Desenhados na mesma métrica: caixa de 48, traço de 1.4, extremidades
 * retas e nenhum preenchimento. São diagramas pequenos, não pictogramas
 * genéricos de biblioteca: cada um mostra a topologia do que a frente
 * resolve, e é isso que os torna reconhecíveis lado a lado.
 *
 * O traço herda `currentColor`, então quem usa decide a cor.
 */

import type { SVGProps } from "react";

export type ChaveIcone =
  | "conectividade"
  | "cloud"
  | "workplace"
  | "seguranca";

type Props = SVGProps<SVGSVGElement> & { className?: string };

function Base({ children, className = "h-12 w-12", ...resto }: Props) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden
      className={className}
      {...resto}
    >
      {children}
    </svg>
  );
}

/**
 * Conectividade e Redes: dois caminhos até a unidade, o principal e o
 * que assume, e a rede interna se abrindo do outro lado do comutador.
 */
export function IconeConectividade(p: Props) {
  return (
    <Base {...p}>
      <circle cx="6" cy="14" r="2.5" />
      <path d="M8.5 14h6" />
      <path d="M14.5 14h6a4 4 0 0 1 4 4v2" />
      <path d="M14.5 14v14a4 4 0 0 0 4 4h6" strokeDasharray="3 3" />
      <rect x="18" y="20" width="12" height="6" rx="1.5" />
      <path d="M21 23h.01M24 23h.01M27 23h.01" strokeWidth={2.2} strokeLinecap="round" />
      <path d="M30 23h5v-9M30 23h5v9" />
      <rect x="35" y="10" width="9" height="8" rx="1.5" />
      <rect x="35" y="28" width="9" height="8" rx="1.5" />
      <path d="M24 26v10" />
      <rect x="19" y="36" width="10" height="6" rx="1.5" />
    </Base>
  );
}

/** Cloud e Datacenter: a nuvem sobre as lâminas dedicadas. */
export function IconeCloud(p: Props) {
  return (
    <Base {...p}>
      <path d="M14 20a7 7 0 0 1 13.4-2.8A6 6 0 0 1 36 22.7" />
      <path d="M14 20a5.5 5.5 0 0 0 .3 11h20a5.5 5.5 0 0 0 1.7-10.7" />
      <rect x="12" y="34" width="24" height="4" rx="1" />
      <rect x="12" y="40" width="24" height="4" rx="1" />
      <path d="M16 36h.01M16 42h.01" strokeWidth={2.2} strokeLinecap="round" />
    </Base>
  );
}

/**
 * Modern Workplace: a estação de quem trabalha, com o dispositivo
 * móvel ao lado e a pessoa no centro. É o único dos quatro que tem
 * gente, e isso é proposital.
 */
export function IconeWorkplace(p: Props) {
  return (
    <Base {...p}>
      <rect x="4" y="9" width="28" height="19" rx="2" />
      <path d="M12 34h12M18 28v6" />
      <circle cx="18" cy="16" r="3.5" />
      <path d="M12 23.5a6 6 0 0 1 12 0" />
      <rect x="36" y="18" width="8" height="14" rx="2" />
      <path d="M39 29h2" strokeWidth={2} strokeLinecap="round" />
    </Base>
  );
}

/** Cibersegurança: escudo com a verificação e a costura das camadas. */
export function IconeSeguranca(p: Props) {
  return (
    <Base {...p}>
      <path d="M24 4 8 10v12c0 10 7 18 16 22 9-4 16-12 16-22V10L24 4Z" />
      <path d="M24 4v40" strokeDasharray="2 4" opacity={0.5} />
      <path d="M17 23.5 22 28.5 31.5 19" strokeWidth={1.8} />
    </Base>
  );
}

/**
 * Cor de texto legível sobre um fundo sólido.
 *
 * O acento de cada frente vai do ciano ao carmim, e um par fixo de tons
 * erra metade das vezes: texto escuro sobre o carmim some, texto claro
 * sobre um tom claro também. A luminância relativa decide.
 *
 * O corte em 0,55 segue a prática usual para a razão de contraste da
 * WCAG com este conjunto de cores.
 */
export function tintaSobre(cor: string) {
  const hex = cor.replace("#", "");
  const canal = (i: number) => parseInt(hex.slice(i, i + 2), 16) / 255;
  const linear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const luz =
    0.2126 * linear(canal(0)) +
    0.7152 * linear(canal(2)) +
    0.0722 * linear(canal(4));
  return luz > 0.55 ? "#00131f" : "#ffffff";
}

const MAPA = {
  conectividade: IconeConectividade,
  cloud: IconeCloud,
  workplace: IconeWorkplace,
  seguranca: IconeSeguranca,
} as const;

/** Seletor pela chave que vem do conteúdo. */
export default function Icone({ nome, ...resto }: Props & { nome: ChaveIcone }) {
  const Componente = MAPA[nome] ?? IconeConectividade;
  return <Componente {...resto} />;
}
