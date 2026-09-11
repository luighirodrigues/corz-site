"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { clsx } from "clsx";

/**
 * Caixa sólida no título — o gesto mais reconhecível da marca.
 *
 * A regra é que ela nunca se parta em duas linhas. Em `inline-block`
 * com `nowrap`, quando não cabe na linha atual a caixa inteira desce
 * para a próxima, que é o comportamento certo. O problema aparece
 * quando a frase é mais larga que a própria coluna: aí não existe
 * linha nenhuma onde ela caiba, e no celular isso era garantido —
 * "sua operação não pode perder." não entra em 350px com a fonte de
 * título no piso.
 *
 * A saída não é proibir a quebra e deixar vazar, nem encolher só a
 * caixa (uma tarja menor que o resto da frase fica pior que a quebra).
 * É medir e encolher o título inteiro no tanto exato que falta.
 *
 * Como funciona: depois da montagem, o componente limpa qualquer ajuste
 * anterior, mede a largura real da caixa contra a largura útil do
 * bloco em que ela vive, e — se não couber — grava um `font-size` em
 * pixel no título. Um `ResizeObserver` refaz a conta quando a coluna
 * muda de largura, o que cobre rotação de tela e redimensionamento de
 * janela sem listener global.
 *
 * O piso de 0,62 existe para o ajuste nunca virar caso patológico: se
 * uma frase precisar de menos que isso para caber, o texto é longo
 * demais para ser destaque e o certo é reescrever, não espremer.
 *
 * Se o JavaScript não rodar, a tarja volta a poder quebrar em duas
 * linhas. É feio, mas é legível — degradação, não quebra.
 */

const PISO = 0.62;

export default function Destaque({
  children,
  tom = "azul",
}: {
  children: ReactNode;
  tom?: "azul" | "ciano" | "negativo" | "positivo";
}) {
  const caixa = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = caixa.current;
    if (!el) return;

    /* O bloco que manda na largura: o título, o parágrafo, o que for. */
    const dono = el.closest("h1, h2, h3, h4, h5, h6, p") as HTMLElement | null;
    if (!dono) return;

    const ajustar = () => {
      /* Zera antes de medir: medir com o ajuste anterior aplicado faria
         o valor convergir para baixo a cada chamada. */
      dono.style.fontSize = "";

      /* Aqui está a parte que não é óbvia. Medir a largura do bloco com
         a caixa ainda no fluxo dá um número errado: sendo `nowrap`, ela
         infla a largura mínima da própria coluna que a segura, e o
         bloco chega a medir mais que a tela. A conta daria "cabe" e a
         página continuaria vazando.
         Tirar a caixa do fluxo por um instante desfaz esse laço: a
         coluna volta à largura que realmente tem, e a caixa, absoluta e
         sem quebra, passa a medir exatamente a largura de uma linha. */
      const antes = el.style.cssText;
      el.style.position = "absolute";
      el.style.whiteSpace = "nowrap";
      el.style.visibility = "hidden";

      const util = dono.clientWidth;
      const largura = el.getBoundingClientRect().width;

      el.style.cssText = antes;

      if (!util || !largura || largura <= util) return;

      const razao = Math.max(PISO, util / largura);
      const base = parseFloat(getComputedStyle(dono).fontSize);
      dono.style.fontSize = `${base * razao}px`;
    };

    ajustar();

    const observador = new ResizeObserver(ajustar);
    observador.observe(dono);
    /* Fontes web entram depois da primeira medida e mudam a largura. */
    document.fonts?.ready.then(ajustar).catch(() => {});

    return () => {
      observador.disconnect();
      dono.style.fontSize = "";
    };
  }, [children]);

  const tons = {
    azul: "bg-[#1D4FD8] text-branco",
    ciano: "bg-ciano text-tinta-950",
    negativo: "bg-negativo text-branco",
    positivo: "bg-positivo text-tinta-950",
  } as const;

  return (
    <span
      ref={caixa}
      className={clsx(
        "inline-block px-[0.28em] pt-[0.14em] pb-[0.06em] -mx-[0.04em]",
        // Canto vivo: é assim que a caixa aparece no material da marca,
        // e arredondá-la enfraquecia o gesto mais reconhecível dela.
        "box-decoration-clone whitespace-nowrap",
        tons[tom]
      )}
    >
      {children}
    </span>
  );
}
