"use client";

import { useId, useRef, useState } from "react";
import { clsx } from "clsx";
import Link from "next/link";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import Revelar from "@/components/sistema/Revelar";

/**
 * As quatro perguntas.
 *
 * Já foram quatro caixas empilhadas, depois uma lista com painel ao
 * lado. As duas versões tinham o mesmo defeito: gastavam uma tela
 * inteira para entregar quatro frases. Agora a seção inteira cabe em
 * pouco mais de uma dobra e o conteúdo troca no lugar.
 *
 * É um padrão de abas, e é o mesmo em qualquer tela. No desktop as
 * quatro ficam lado a lado; no celular viram uma tira que rola na
 * horizontal, sem virar acordeão e sem esticar a página. Uma marcação
 * só, um estado só, nenhum conteúdo duplicado para o navegador esconder.
 *
 * Teclado: as setas andam entre as abas e movem o foco junto, que é o
 * comportamento que o padrão de abas exige e o que quem navega sem
 * mouse espera encontrar.
 */

type Pergunta = {
  chave: string;
  tema: string;
  pergunta: string;
  resposta: string;
  consequencia: string;
  cor: string;
};

const PERGUNTAS: Pergunta[] = [
  {
    chave: "continuidade",
    tema: "Continuidade",
    pergunta: "Quanto tempo sua empresa consegue operar sem internet?",
    resposta:
      "Falha vai acontecer. Link cai, equipamento queima, operadora erra. O que separa a empresa madura da empresa exposta não é evitar a falha, é o que já estava pronto antes dela.",
    consequencia: "Sem plano, a média para voltar é medida em horas.",
    cor: "#00ADE7",
  },
  {
    chave: "redes",
    tema: "Redes",
    pergunta: "Quem sabe como está montada a rede da sua unidade mais nova?",
    resposta:
      "Dezenas de pontos com fornecedores diferentes, padrões diferentes e nenhuma documentação é uma conta que sempre vence na pior hora. Normalmente no dia em que a pessoa que sabia está de férias.",
    consequencia: "Rede sem documentação é rede que depende de uma pessoa.",
    cor: "#3F39BD",
  },
  {
    chave: "seguranca",
    tema: "Cibersegurança",
    pergunta: "Sua empresa sobreviveria a 48 horas sem acesso aos sistemas?",
    resposta:
      "O ataque não entra pela matriz blindada. Entra pela unidade que ninguém está olhando e caminha até onde estão os dados que sustentam a operação inteira.",
    consequencia: "A folha continua correndo. O faturamento, não.",
    cor: "#E20D50",
  },
  {
    chave: "escala",
    tema: "Escala",
    pergunta: "Sua infraestrutura suporta o plano de expansão já aprovado?",
    resposta:
      "O problema nunca é crescer, é crescer sem sustentação. Mais unidades, mais usuários, mais sistemas, e a mesma estrutura de cinco anos atrás segurando tudo.",
    consequencia: "A estrutura avisa que não aguentava depois de não aguentar.",
    cor: "#89E20D",
  },
];

export default function QuatroPerguntas() {
  const [ativa, setAtiva] = useState(0);
  const base = useId();
  const abas = useRef<(HTMLButtonElement | null)[]>([]);

  const item = PERGUNTAS[ativa]!;

  const aoTeclar = (e: React.KeyboardEvent) => {
    const passo =
      e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    const proxima = (ativa + passo + PERGUNTAS.length) % PERGUNTAS.length;
    setAtiva(proxima);
    abas.current[proxima]?.focus();
  };

  return (
    <section className="border-t border-petroleo/12 bg-papel-000 py-16 sm:py-20">
      <Envelope>
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
          {/* Título */}
          <Revelar className="min-w-0 lg:col-span-4">
            <Rotulo cor="petroleo">Como pensamos infraestrutura</Rotulo>
            <h2 className="mt-4 font-display text-[clamp(1.625rem,3.2vw,2.375rem)] font-bold leading-[1.04] tracking-[-0.038em] text-tinta-900">
              Quatro perguntas que sustentam toda operação crítica.
            </h2>
            <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed text-tinta-900/55">
              Se alguma delas ficou sem resposta na sua empresa, é por ali que a
              conversa começa.
            </p>
          </Revelar>

          {/* Abas e painel */}
          <Revelar atraso={100} className="min-w-0 lg:col-span-8">
            <div className="overflow-hidden rounded-[var(--radius-bloco)] border border-petroleo/14 bg-papel-050">
              {/* No celular a tira rola em vez de empilhar: mantém a
                  seção curta e a interação idêntica à do desktop. */}
              <div
                role="tablist"
                aria-label="Quatro perguntas"
                onKeyDown={aoTeclar}
                /* A tira rola por conta própria; o Lenis não deve
                   sequestrar o gesto quando o dedo está sobre ela. */
                data-lenis-prevent
                className="flex overflow-x-auto border-b border-petroleo/12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {PERGUNTAS.map((p, i) => {
                  const atual = i === ativa;
                  return (
                    <button
                      key={p.chave}
                      ref={(el) => {
                        abas.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`${base}-aba-${p.chave}`}
                      aria-selected={atual}
                      aria-controls={`${base}-painel`}
                      tabIndex={atual ? 0 : -1}
                      onClick={() => setAtiva(i)}
                      data-cursor="acao"
                      className={clsx(
                        "relative shrink-0 grow px-4 py-4 text-[0.875rem] font-semibold whitespace-nowrap transition-colors duration-300 sm:px-5",
                        atual
                          ? "bg-papel-000 text-tinta-900"
                          : "text-tinta-900/50 hover:bg-papel-000/60 hover:text-tinta-900/80"
                      )}
                    >
                      {p.tema}
                      <span
                        aria-hidden
                        className={clsx(
                          "absolute inset-x-0 bottom-0 h-[3px] origin-left transition-transform duration-400 ease-[var(--ease-corz)]",
                          atual ? "scale-x-100" : "scale-x-0"
                        )}
                        style={{ background: p.cor }}
                      />
                    </button>
                  );
                })}
              </div>

              <div
                role="tabpanel"
                id={`${base}-painel`}
                aria-labelledby={`${base}-aba-${item.chave}`}
                /* A chave força a remontagem a cada troca, e é ela que
                   dá o fade de entrada sem nenhuma linha de JavaScript
                   de animação. */
                key={item.chave}
                className="painel-pergunta bg-papel-000 p-7 sm:p-9"
              >
                <p className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold leading-[1.12] tracking-[-0.03em] text-tinta-900">
                  {item.pergunta}
                </p>
                <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-[1.7] text-tinta-900/68">
                  {item.resposta}
                </p>

                <div className="mt-6 flex flex-col gap-4 border-t border-petroleo/12 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="flex items-start gap-3 text-[0.9375rem] font-medium leading-snug text-tinta-900/85">
                    <span
                      aria-hidden
                      className="mt-[0.5rem] h-[3px] w-6 shrink-0 rounded-full"
                      style={{ background: item.cor }}
                    />
                    {item.consequencia}
                  </p>
                  <Link
                    href="/contato"
                    data-cursor="acao"
                    className="group inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap text-[0.875rem] font-semibold text-[#1D4FD8] transition-colors hover:text-[#153bab]"
                  >
                    Quero esses dados em meu negócio
                    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </Revelar>
        </div>
      </Envelope>
    </section>
  );
}
