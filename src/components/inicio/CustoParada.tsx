"use client";

import { useMemo, useState } from "react";
import { Envelope, Rotulo, Destaque } from "@/components/sistema/primitivos";
import Revelar from "@/components/sistema/Revelar";
import Link from "next/link";

/**
 * Calculadora de custo de parada.
 *
 * A diretriz manda começar pela dor e mostrar a consequência em número.
 * Esta é a peça que faz isso: a pessoa move dois controles e vê, com o
 * próprio faturamento, quanto custa uma hora de operação parada.
 *
 * Também é o ativo mais citável do site — responde a uma pergunta que as
 * pessoas efetivamente digitam ("quanto custa uma hora de sistema parado").
 */

const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 0,
});

const HORAS_UTEIS_MES = 26 * 12; // 26 dias de operação, 12 horas por dia

export default function CustoParada() {
  const [faturamento, setFaturamento] = useState(4_000_000);
  const [horas, setHoras] = useState(4);

  const { porHora, perda } = useMemo(() => {
    const porHora = faturamento / HORAS_UTEIS_MES;
    return { porHora, perda: porHora * horas };
  }, [faturamento, horas]);

  return (
    <section className="relative overflow-hidden border-y border-petroleo/12 bg-papel-050 py-20 sm:py-28">
      <Envelope className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Revelar>
              <Rotulo cor="petroleo">Calculadora de parada</Rotulo>
              <h2 className="mt-5 font-display text-[clamp(1.875rem,3.8vw,3rem)] font-bold leading-[1.02] tracking-[-0.038em] text-tinta-900">
                Quanto custa{" "}
                <Destaque>uma hora parada?</Destaque>
              </h2>
            </Revelar>
            <Revelar atraso={100}>
              <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-[1.62] text-tinta-900/68">
                A maioria das empresas nunca calculou. Move os dois controles
                com os seus números e veja o valor que a operação deixa de
                faturar quando para.
              </p>
              <p className="mt-5 max-w-[44ch] text-[0.875rem] leading-relaxed text-tinta-900/50">
                Base de cálculo: 26 dias de operação por mês, 12 horas por dia.
                A conta considera apenas a receita não realizada. Não inclui
                folha parada, retrabalho, multa contratual nem o cliente que não
                volta.
              </p>
            </Revelar>
          </div>

          <div className="lg:col-span-7">
            <Revelar atraso={140}>
              <div className="rounded-[12px] border border-petroleo/14 bg-branco p-7 sm:p-9">
                <div className="space-y-8">
                  <label className="block">
                    <span className="flex items-baseline justify-between">
                      <span className="rotulo text-petroleo/60">
                        Faturamento mensal
                      </span>
                      <span className="font-wide text-[1.375rem] font-bold tabular-nums tracking-[-0.02em] text-tinta-900">
                        {moeda.format(faturamento)}
                      </span>
                    </span>
                    <input
                      type="range"
                      min={200_000}
                      max={60_000_000}
                      step={200_000}
                      value={faturamento}
                      onChange={(e) => setFaturamento(Number(e.target.value))}
                      className="controle mt-4"
                      aria-label="Faturamento mensal da empresa"
                    />
                  </label>

                  <label className="block">
                    <span className="flex items-baseline justify-between">
                      <span className="rotulo text-petroleo/60">
                        Horas paradas no mês
                      </span>
                      <span className="font-wide text-[1.375rem] font-bold tabular-nums tracking-[-0.02em] text-tinta-900">
                        {horas} h
                      </span>
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={48}
                      step={1}
                      value={horas}
                      onChange={(e) => setHoras(Number(e.target.value))}
                      className="controle mt-4"
                      aria-label="Horas de operação parada por mês"
                    />
                  </label>
                </div>

                <div className="mt-9 grid gap-px overflow-hidden rounded-[10px] border border-petroleo/14 bg-petroleo/12 sm:grid-cols-2">
                  <div className="bg-papel-050 p-6">
                    <p className="rotulo text-petroleo/55">
                      Cada hora parada custa
                    </p>
                    <p className="mt-3 font-wide text-[clamp(1.5rem,3vw,2rem)] font-bold tabular-nums tracking-[-0.03em] text-tinta-900">
                      {moeda.format(porHora)}
                    </p>
                  </div>
                  <div className="bg-tinta-950 p-6">
                    <p className="rotulo text-branco/45">Perda no mês</p>
                    <p className="mt-3 font-wide text-[clamp(1.5rem,3vw,2rem)] font-bold tabular-nums tracking-[-0.03em] text-negativo">
                      {moeda.format(perda)}
                    </p>
                    <p className="mt-2 text-[0.8125rem] text-branco/45">
                      {moeda.format(perda * 12)} por ano
                    </p>
                  </div>
                </div>

                <p className="mt-7 text-[0.9375rem] leading-relaxed text-tinta-900/70">
                  Redundância e monitoramento ativo não eliminam a falha.
                  Eliminam a{" "}
                  <strong className="font-semibold text-tinta-900">espera</strong>.
                  É a diferença entre quatro horas paradas e quatro minutos.
                </p>

                <Link
                  href="/contato"
                  data-cursor="acao"
                  /* O rótulo antigo — "Descobrir quanto a minha
                     operação parou" — não cabia em 390px: sendo
                     `nowrap` e centralizado, o texto sumia pelas duas
                     pontas e sobrava "escobrir quanto a minha operação
                     parou". Botão não quebra linha por regra, então o
                     que tinha que encolher era a frase. */
                  className="group mt-7 flex w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] bg-[#1D4FD8] px-5 py-4 text-[0.9375rem] font-semibold text-branco transition-colors duration-300 hover:bg-[#153bab] sm:w-auto sm:px-8"
                >
                  Quero medir a minha operação
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                  </svg>
                </Link>

                <p className="mt-3 text-[0.8125rem] leading-relaxed text-tinta-900/45">
                  Levantamos a disponibilidade real de cada unidade no último
                  período. O resultado é seu, com ou sem contrato.
                </p>
              </div>
            </Revelar>
          </div>
        </div>
      </Envelope>
    </section>
  );
}
