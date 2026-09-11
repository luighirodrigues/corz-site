"use client";

import { useState } from "react";
import { clsx } from "clsx";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import Revelar from "@/components/sistema/Revelar";

/**
 * Perguntas frequentes.
 *
 * O conteúdo fica sempre no HTML (nada é carregado no clique), porque é
 * exatamente esse texto que buscadores e modelos de linguagem leem para
 * citar a CORZ. O acordeão controla altura, não existência.
 */
export default function Perguntas({
  itens,
  titulo = "Perguntas que a diretoria costuma fazer",
  rotulo = "Dúvidas frequentes",
  escuro,
}: {
  itens: { pergunta: string; resposta: string }[];
  titulo?: string;
  rotulo?: string;
  escuro?: boolean;
}) {
  const [aberta, setAberta] = useState<number | null>(0);

  return (
    <section
      className={clsx(
        "py-20 sm:py-28",
        escuro ? "sup-escura bg-tinta-950 text-branco" : "bg-papel-000"
      )}
    >
      <Envelope>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Revelar>
              <Rotulo cor={escuro ? "branco" : "petroleo"}>{rotulo}</Rotulo>
              <h2 className="mt-6 font-display text-[clamp(1.875rem,3.4vw,2.75rem)] font-bold leading-[1] tracking-[-0.035em]">
                {titulo}
              </h2>
            </Revelar>
          </div>

          <div className="lg:col-span-8">
            <dl
              className={clsx(
                "border-t",
                escuro ? "border-branco/12" : "border-petroleo/14"
              )}
            >
              {itens.map((item, i) => {
                const ativa = aberta === i;
                return (
                  <div
                    key={item.pergunta}
                    className={clsx(
                      "border-b",
                      escuro ? "border-branco/12" : "border-petroleo/14"
                    )}
                  >
                    <dt>
                      <button
                        type="button"
                        onClick={() => setAberta(ativa ? null : i)}
                        aria-expanded={ativa}
                        data-cursor="acao"
                        className="flex w-full items-start gap-5 py-6 text-left"
                      >
                        <span
                          className={clsx(
                            "mt-1 text-[0.8125rem] font-semibold tabular-nums",
                            escuro ? "text-branco/30" : "text-petroleo/40"
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="flex-1 font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.02em] sm:text-[1.1875rem]">
                          {item.pergunta}
                        </span>
                        <span
                          aria-hidden
                          className={clsx(
                            "relative mt-1.5 block h-3 w-3 shrink-0",
                            escuro ? "text-branco/50" : "text-petroleo/50"
                          )}
                        >
                          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                          <span
                            className={clsx(
                              "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-400 ease-[var(--ease-corz)]",
                              ativa ? "scale-y-0" : "scale-y-100"
                            )}
                          />
                        </span>
                      </button>
                    </dt>
                    <dd
                      className={clsx(
                        "grid transition-[grid-template-rows] duration-500 ease-[var(--ease-corz)]",
                        ativa ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p
                          className={clsx(
                            "max-w-[62ch] pb-7 pl-[2.4rem] pr-8 text-[0.9375rem] leading-[1.68]",
                            escuro ? "text-branco/60" : "text-tinta-900/70"
                          )}
                        >
                          {item.resposta}
                        </p>
                      </div>
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </Envelope>
    </section>
  );
}
