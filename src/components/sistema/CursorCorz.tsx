"use client";

import { useEffect, useRef } from "react";

/**
 * Cursor CORZ
 *
 * Dois corpos: um ponto de precisão sem atraso e um anel com massa
 * (interpolação linear). O anel comunica estado; o ponto comunica alvo.
 *
 * Estados via atributo `data-cursor` em qualquer elemento:
 *   link | acao | texto | midia | arrastar | externo | bloqueado
 * Rótulo opcional via `data-cursor-rotulo="VER PROJETO"`.
 *
 * Não roda em ponteiro grosso (toque), nem sob prefers-reduced-motion,
 * nem antes do primeiro movimento real do mouse — assim o cursor nunca
 * aparece "solto" no canto da tela ao carregar.
 */

type Estado =
  | "padrao"
  | "link"
  | "acao"
  | "texto"
  | "midia"
  | "arrastar"
  | "externo"
  | "bloqueado";

const GEOMETRIA: Record<Estado, { anel: number; ponto: number; raio: string }> = {
  padrao: { anel: 34, ponto: 5, raio: "50%" },
  link: { anel: 46, ponto: 0, raio: "50%" },
  acao: { anel: 48, ponto: 0, raio: "50%" },
  texto: { anel: 2, ponto: 0, raio: "1px" },
  midia: { anel: 68, ponto: 0, raio: "50%" },
  arrastar: { anel: 76, ponto: 0, raio: "50%" },
  externo: { anel: 46, ponto: 0, raio: "50%" },
  bloqueado: { anel: 40, ponto: 0, raio: "50%" },
};

export default function CursorCorz() {
  const anelRef = useRef<HTMLDivElement>(null);
  const pontoRef = useRef<HTMLDivElement>(null);
  const rotuloRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const finoEDesejado =
      window.matchMedia("(pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finoEDesejado) return;

    const anel = anelRef.current;
    const ponto = pontoRef.current;
    const rotulo = rotuloRef.current;
    if (!anel || !ponto || !rotulo) return;

    const raiz = document.documentElement;

    let alvoX = window.innerWidth / 2;
    let alvoY = window.innerHeight / 2;
    let anelX = alvoX;
    let anelY = alvoY;
    let ativo = false;
    let pressionado = false;
    let estado: Estado = "padrao";
    let quadro = 0;

    const aplicarEstado = (novo: Estado, textoRotulo: string | null) => {
      if (novo === estado && !textoRotulo) return;
      estado = novo;
      const g = GEOMETRIA[novo];
      anel.style.setProperty("--anel", `${g.anel}px`);
      anel.style.setProperty("--raio", g.raio);
      ponto.style.setProperty("--ponto", `${g.ponto}px`);
      anel.dataset.estado = novo;
      rotulo.textContent = textoRotulo ?? "";
      rotulo.dataset.visivel = textoRotulo ? "sim" : "nao";
    };

    const lerAlvo = (el: Element | null): [Estado, string | null] => {
      if (!el) return ["padrao", null];
      const marcado = el.closest<HTMLElement>("[data-cursor]");
      if (marcado) {
        return [
          (marcado.dataset.cursor as Estado) || "padrao",
          marcado.dataset.cursorRotulo || null,
        ];
      }
      const interativo = el.closest<HTMLElement>(
        'a, button, [role="button"], summary, label[for], select'
      );
      if (interativo) {
        if (
          interativo instanceof HTMLAnchorElement &&
          interativo.target === "_blank"
        ) {
          return ["externo", null];
        }
        if (
          interativo.hasAttribute("disabled") ||
          interativo.getAttribute("aria-disabled") === "true"
        ) {
          return ["bloqueado", null];
        }
        return [interativo.tagName === "A" ? "link" : "acao", null];
      }
      if (el.closest("p, h1, h2, h3, h4, blockquote, li, td")) {
        return ["texto", null];
      }
      return ["padrao", null];
    };

    const aoMover = (e: PointerEvent) => {
      alvoX = e.clientX;
      alvoY = e.clientY;
      if (!ativo) {
        ativo = true;
        anelX = alvoX;
        anelY = alvoY;
        raiz.classList.add("cursor-corz");
        anel.dataset.pronto = "sim";
        ponto.dataset.pronto = "sim";
      }
      const [novo, texto] = lerAlvo(
        document.elementFromPoint(e.clientX, e.clientY)
      );
      aplicarEstado(novo, texto);
    };

    const aoSair = () => {
      anel.dataset.pronto = "nao";
      ponto.dataset.pronto = "nao";
    };
    const aoEntrar = () => {
      if (!ativo) return;
      anel.dataset.pronto = "sim";
      ponto.dataset.pronto = "sim";
    };
    const aoPressionar = () => {
      pressionado = true;
      anel.dataset.pressionado = "sim";
    };
    const aoSoltar = () => {
      pressionado = false;
      anel.dataset.pressionado = "nao";
    };

    const laco = () => {
      // Atraso menor quando pressionado: resposta mais firme ao clique.
      const fator = pressionado ? 0.32 : 0.19;
      anelX += (alvoX - anelX) * fator;
      anelY += (alvoY - anelY) * fator;
      anel.style.transform = `translate3d(${anelX}px, ${anelY}px, 0) translate(-50%, -50%)`;
      ponto.style.transform = `translate3d(${alvoX}px, ${alvoY}px, 0) translate(-50%, -50%)`;
      quadro = requestAnimationFrame(laco);
    };
    quadro = requestAnimationFrame(laco);

    window.addEventListener("pointermove", aoMover, { passive: true });
    window.addEventListener("pointerdown", aoPressionar, { passive: true });
    window.addEventListener("pointerup", aoSoltar, { passive: true });
    document.addEventListener("pointerleave", aoSair);
    document.addEventListener("pointerenter", aoEntrar);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("pointermove", aoMover);
      window.removeEventListener("pointerdown", aoPressionar);
      window.removeEventListener("pointerup", aoSoltar);
      document.removeEventListener("pointerleave", aoSair);
      document.removeEventListener("pointerenter", aoEntrar);
      raiz.classList.remove("cursor-corz");
    };
  }, []);

  return (
    <div aria-hidden className="cursor-camada">
      <div ref={anelRef} className="cursor-anel" data-pronto="nao">
        <span ref={rotuloRef} className="cursor-rotulo" data-visivel="nao" />
        <svg className="cursor-seta" viewBox="0 0 24 24" fill="none">
          <path
            d="M7 17 17 7M17 7H9M17 7v8"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
          />
        </svg>
        <svg className="cursor-barra" viewBox="0 0 24 24" fill="none">
          <path
            d="M5 12h14M13 6l6 6-6 6M11 6 5 12l6 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="square"
          />
        </svg>
        <svg className="cursor-bloqueio" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6l12 12M18 6 6 18"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="square"
          />
        </svg>
      </div>
      <div ref={pontoRef} className="cursor-ponto" data-pronto="nao" />
    </div>
  );
}
