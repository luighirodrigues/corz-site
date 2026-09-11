"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";
import { clsx } from "clsx";

/**
 * Revelação na entrada de viewport.
 *
 * Deliberadamente contida: 14px de deslocamento e 0.7s. Animação de
 * entrada grande é o que faz um site parecer template. Aqui o movimento
 * serve para dar ordem de leitura, não para chamar atenção.
 *
 * Usa IntersectionObserver e classes CSS — sem biblioteca de animação,
 * sem re-render, sem custo de hidratação por elemento.
 */
export default function Revelar({
  children,
  className,
  atraso = 0,
  como: Como = "div",
  modo = "subir",
}: {
  children: ReactNode;
  className?: string;
  /** Atraso em milissegundos. Use múltiplos de 60 para escalonar listas. */
  atraso?: number;
  como?: ElementType;
  modo?: "subir" | "surgir" | "fio";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /**
     * Avisa ao vigia do <head> que a hidratação aconteceu, para ele não
     * desligar a animação achando que o JavaScript morreu no caminho.
     */
    document.documentElement.dataset.hidratado = "sim";

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.dataset.visivel = "sim";
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            (entrada.target as HTMLElement).dataset.visivel = "sim";
            observador.unobserve(entrada.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    observador.observe(el);

    /**
     * Rede de segurança. Se por qualquer motivo o observador não
     * disparar — rolagem programática muito rápida, aba em segundo
     * plano, leitor de tela pulando direto para o fim — o conteúdo
     * aparece assim mesmo. Conteúdo invisível é um defeito, não um
     * efeito.
     */
    const resgate = window.setTimeout(() => {
      el.dataset.visivel = "sim";
      observador.unobserve(el);
    }, 2500);

    return () => {
      window.clearTimeout(resgate);
      observador.disconnect();
    };
  }, []);

  return (
    <Como
      ref={ref}
      data-visivel="nao"
      data-modo={modo}
      style={{ transitionDelay: `${atraso}ms` }}
      className={clsx("revelar", className)}
    >
      {children}
    </Como>
  );
}
