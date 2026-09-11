"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Rolagem suave CORZ.
 *
 * A roda do mouse deixa de mover a página em degraus e passa a puxá-la
 * com inércia. É o efeito mais barato que existe para tirar a sensação
 * de página estática, e o mais fácil de exagerar: passando de ~1,2s a
 * página vira elástico e a leitura sofre. A curva aqui é exponencial
 * de saída — arranca rápido e assenta devagar, que é o gesto físico de
 * algo pesado sendo empurrado, não de mola.
 *
 * As regras de CSS que o Lenis exige (`html.lenis { height: auto }` e
 * companhia) estão em globals.css, na seção "Rolagem suave". Sem elas
 * a biblioteca inicializa e não engata — é a falha silenciosa clássica
 * de quem esquece de importar o `lenis.css`.
 *
 * Desligada por completo em prefers-reduced-motion, e fora do toque,
 * onde a rolagem nativa do sistema é melhor do que qualquer emulação.
 *
 * Também expõe --progresso-rolagem no <html> para barras e indicadores,
 * sem precisar de listener adicional em cada componente.
 */
export default function RolagemSuave() {
  useEffect(() => {
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduzido.matches) return;

    const lenis = new Lenis({
      /* 1,15s: suavidade que se percebe sem atrasar quem quer descer
         a página rápido. */
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      /* O toque fica com o sistema: emular inércia no celular briga
         com o gesto nativo e sempre perde. */
      syncTouch: false,
      autoRaf: false,
    });

    const raiz = document.documentElement;

    lenis.on("scroll", ({ progress }: { progress: number }) => {
      raiz.style.setProperty("--progresso-rolagem", String(progress));
    });

    let quadro = 0;
    const laco = (tempo: number) => {
      lenis.raf(tempo);
      quadro = requestAnimationFrame(laco);
    };
    quadro = requestAnimationFrame(laco);

    /* O documento muda de altura depois que fontes e imagens entram.
       Sem remedir, o fim da página fica inalcançável. */
    const medidor = new ResizeObserver(() => lenis.resize());
    medidor.observe(document.body);

    // Âncoras internas passam pelo Lenis para manter a mesma curva.
    const aoClicar = (e: MouseEvent) => {
      const alvo = (e.target as HTMLElement)?.closest?.('a[href^="#"]');
      if (!alvo) return;
      const id = alvo.getAttribute("href");
      if (!id || id === "#") return;
      const destino = document.querySelector(id);
      if (!destino) return;
      e.preventDefault();
      lenis.scrollTo(destino as HTMLElement, { offset: -96 });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", aoClicar);

    return () => {
      cancelAnimationFrame(quadro);
      medidor.disconnect();
      document.removeEventListener("click", aoClicar);
      lenis.destroy();
    };
  }, []);

  return null;
}
