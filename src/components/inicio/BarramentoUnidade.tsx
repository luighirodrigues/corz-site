"use client";

import { useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

/**
 * O barramento da unidade, caindo e voltando em ciclo.
 *
 * A versão anterior era um diagrama parado, e um diagrama parado ao lado
 * de um texto que fala de queda de link não prova nada. Aqui o argumento
 * acontece na tela: o link cai, os sistemas apagam em cascata com a
 * consequência escrita ao lado, e a operação volta.
 *
 * Roda sozinho, rápido e sem botão. Um controle exigiria que a pessoa
 * descobrisse que podia clicar, e quem só passa os olhos, que é a
 * maioria, nunca veria a demonstração.
 *
 * O ciclo é assimétrico de propósito: a queda fica mais tempo na tela
 * que a normalidade, porque o quadro vermelho é o que carrega o
 * argumento. E só roda enquanto o bloco está visível, para não gastar
 * bateria animando o que ninguém está olhando.
 */

const DEPENDE = [
  { nome: "Sistemas de gestão", falha: "O pedido não entra" },
  { nome: "Pagamentos e PIX", falha: "O cliente não paga" },
  { nome: "Emissão fiscal", falha: "A nota não sai" },
  { nome: "Telefonia", falha: "Ninguém atende" },
  { nome: "Câmeras e controle de acesso", falha: "A unidade fica cega" },
  { nome: "Integrações entre sistemas", falha: "O dado congela" },
];

/** Tempo em cada estado, em milissegundos. */
const NO_AR = 1500;
const FORA = 2300;

export default function BarramentoUnidade() {
  const [caiu, setCaiu] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let relogio: number | undefined;

    /**
     * Um `setTimeout` que se reagenda, e não um `setInterval`: é o que
     * permite os dois estados terem durações diferentes.
     */
    const agendar = (estado: boolean) => {
      relogio = window.setTimeout(
        () => {
          setCaiu(!estado);
          agendar(!estado);
        },
        estado ? FORA : NO_AR
      );
    };

    const observador = new IntersectionObserver(
      ([entrada]) => {
        window.clearTimeout(relogio);
        if (entrada?.isIntersecting) agendar(false);
      },
      { threshold: 0.3 }
    );
    observador.observe(el);

    return () => {
      window.clearTimeout(relogio);
      observador.disconnect();
    };
  }, []);

  return (
    <div
      ref={raiz}
      className="rounded-[var(--radius-bloco)] border border-branco/10 bg-branco/[0.025] p-7 sm:p-9"
    >
      {/* Barramento */}
      <div className="flex items-center gap-3">
        <span className="relative flex h-2 w-2 shrink-0">
          <span
            className={clsx(
              "absolute inline-flex h-full w-full rounded-full opacity-50",
              caiu ? "bg-negativo" : "animate-ping bg-ciano"
            )}
          />
          <span
            className={clsx(
              "relative inline-flex h-2 w-2 rounded-full transition-colors duration-300",
              caiu ? "bg-negativo" : "bg-ciano"
            )}
          />
        </span>
        <span className="text-[0.9375rem] font-semibold text-branco/90">
          Link da unidade
        </span>
        <span
          aria-live="polite"
          className={clsx(
            "text-[0.8125rem] font-semibold transition-colors duration-300",
            caiu ? "text-negativo" : "text-ciano"
          )}
        >
          {caiu ? "fora do ar" : "no ar"}
        </span>
        <span
          aria-hidden
          className="h-px flex-1 transition-all duration-500"
          style={{
            background: caiu
              ? "linear-gradient(90deg, #E20D50 0%, rgba(226,13,80,0.14) 100%)"
              : "linear-gradient(90deg, #00ADE7 0%, rgba(0,173,231,0.14) 100%)",
          }}
        />
      </div>

      <ul className="mt-1">
        {DEPENDE.map((item, i) => (
          <li
            key={item.nome}
            className="relative flex items-center gap-3 py-3.5 sm:gap-4"
          >
            <span
              aria-hidden
              className="absolute left-[3px] top-0 h-1/2 w-px bg-branco/12"
            />
            {/* A cascata: cada linha reage um instante depois da
                anterior, como a falha se propaga de verdade. */}
            <span
              aria-hidden
              className={clsx(
                "relative z-10 h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300",
                caiu ? "bg-negativo" : "bg-branco/30"
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            />
            <span
              aria-hidden
              className="hidden h-px w-5 shrink-0 bg-branco/12 sm:block"
            />
            <span
              className={clsx(
                "flex-1 text-[0.9375rem] font-medium leading-snug transition-colors duration-300 sm:text-[1rem]",
                caiu ? "text-branco/35" : "text-branco/85"
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {item.nome}
            </span>
            <span
              aria-hidden
              className={clsx(
                "shrink-0 text-right text-[0.8125rem] leading-snug text-negativo transition-all duration-300 sm:text-[0.875rem]",
                caiu ? "translate-x-0 opacity-100" : "translate-x-1 opacity-0"
              )}
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              {item.falha}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-7 border-t border-branco/10 pt-6 text-[1rem] leading-[1.6] text-branco/70">
        Quando o link cai, não cai a internet.{" "}
        <strong className="font-semibold text-branco">
          Cai o faturamento.
        </strong>
      </p>
    </div>
  );
}
