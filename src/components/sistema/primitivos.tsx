import Link from "next/link";
import type { ReactNode } from "react";
import { clsx } from "clsx";

/* ============================================================
   Primitivos de interface CORZ
   Traduzem para a web os dispositivos do sistema da marca:
   a caixa sólida no título, o rótulo mono, o fio de 1px.
   ============================================================ */

/**
 * A caixa sólida do título mora em `Destaque.tsx`: ela precisa medir a
 * si mesma para nunca quebrar em duas linhas, e isso exige componente
 * de cliente. Fica reexportada aqui para quem já importava daqui não
 * ter que saber da mudança.
 */
export { default as Destaque } from "./Destaque";

/** Rótulo de seção: mono, caixa-alta, com marcador de fio. */
export function Rotulo({
  children,
  cor = "ciano",
  className,
}: {
  children: ReactNode;
  cor?: "ciano" | "petroleo" | "branco";
  className?: string;
}) {
  const cores = {
    ciano: "text-ciano",
    petroleo: "text-petroleo",
    branco: "text-branco/70",
  } as const;

  return (
    <span
      className={clsx(
        "rotulo inline-flex items-center gap-2.5",
        cores[cor],
        className
      )}
    >
      <span aria-hidden className="h-px w-6 bg-current opacity-50" />
      {children}
    </span>
  );
}

/** Numeração editorial de seção — 01, 02, 03. */
export function Indice({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[0.6875rem] tabular-nums tracking-[0.14em] opacity-40">
      {children}
    </span>
  );
}

type BotaoProps = {
  children: ReactNode;
  href?: string;
  tipo?: "primario" | "secundario" | "fantasma" | "claro";
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  externo?: boolean;
};

/**
 * Botão. Sem sombra, sem gradiente decorativo: o realce vem de uma
 * lâmina de cor que desliza no hover, não de um brilho difuso.
 */
export function Botao({
  children,
  href,
  tipo = "primario",
  className,
  type = "button",
  disabled,
  onClick,
  externo,
}: BotaoProps) {
  const base = clsx(
    "group/botao relative inline-flex items-center justify-center gap-2.5",
    "overflow-hidden whitespace-nowrap rounded-[10px] px-6 py-3.5",
    "font-sans text-[0.9375rem] font-semibold leading-none tracking-[-0.01em]",
    "transition-colors duration-300 ease-[var(--ease-corz)]",
    "disabled:opacity-40 disabled:pointer-events-none"
  );

  const tipos = {
    primario: "bg-[#1D4FD8] text-branco hover:bg-[#153bab]",
    secundario:
      "border border-petroleo/30 text-petroleo hover:border-petroleo hover:bg-petroleo hover:text-branco",
    fantasma:
      "border border-branco/25 text-branco hover:border-branco hover:bg-branco hover:text-tinta-900",
    claro: "bg-branco text-tinta-900 hover:bg-ciano hover:text-tinta-950",
  } as const;

  const conteudo = (
    <>
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-corz)] group-hover/botao:translate-x-1"
      >
        <path
          d="M2 8h11M9 4l4 4-4 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="square"
        />
      </svg>
    </>
  );

  const classes = clsx(base, tipos[tipo], className);

  if (href) {
    if (externo) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          data-cursor="externo"
        >
          {conteudo}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} data-cursor="acao">
        {conteudo}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      data-cursor="acao"
    >
      {conteudo}
    </button>
  );
}

/** Container de largura de leitura, com a malha técnica opcional. */
export function Secao({
  children,
  className,
  escura,
  id,
  como: Como = "section",
}: {
  children: ReactNode;
  className?: string;
  escura?: boolean;
  id?: string;
  como?: "section" | "div" | "header" | "footer";
}) {
  return (
    <Como
      id={id}
      className={clsx(
        "relative",
        escura && "sup-escura bg-tinta-950 text-branco",
        className
      )}
    >
      {children}
    </Como>
  );
}

export function Envelope({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("mx-auto w-full max-w-[84rem] px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/**
 * Cartão do sistema: fio de 1px, preenchimento translúcido mínimo,
 * raio pequeno. A separação de plano vem do fio, não de sombra.
 */
export function Cartao({
  children,
  className,
  escuro,
  interativo,
}: {
  children: ReactNode;
  className?: string;
  escuro?: boolean;
  interativo?: boolean;
}) {
  return (
    <div
      className={clsx(
        "relative rounded-[var(--radius-peca)] border p-6 transition-colors duration-300 ease-[var(--ease-corz)]",
        escuro
          ? "border-branco/12 bg-branco/[0.025]"
          : "border-petroleo/14 bg-papel-050",
        interativo &&
          (escuro
            ? "hover:border-ciano/50 hover:bg-branco/[0.05]"
            : "hover:border-petroleo/35 hover:bg-branco"),
        className
      )}
    >
      {children}
    </div>
  );
}
