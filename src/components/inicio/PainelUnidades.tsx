"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";

/**
 * Painel de unidades: o monitoramento da CORZ em forma visível.
 *
 * Não é um gráfico decorativo: reproduz a sequência real que a diretriz
 * descreve. Uma unidade cai, o alerta dispara no segundo da queda, a
 * contingência assume e a operação continua. É a demonstração do argumento
 * da página, não um enfeite.
 *
 * A animação só começa depois da montagem (evita divergência de hidratação)
 * e é interrompida sob prefers-reduced-motion, quando o painel exibe o
 * estado estável.
 */

type Estado = "ok" | "queda" | "contingencia";

const UNIDADES = [
  { nome: "Matriz · Pelotas", link: "Dedicado 500 Mbps", disp: "99,9%" },
  { nome: "CD · Rio Grande", link: "Dedicado 300 Mbps", disp: "99,8%" },
  { nome: "Unidade 07 · Bagé", link: "Fibra 300 Mbps", disp: "99,7%" },
  { nome: "Unidade 12 · Camaquã", link: "Fibra 200 Mbps", disp: "99,6%" },
  { nome: "Unidade 21 · Canguçu", link: "Fibra 200 Mbps", disp: "99,8%" },
] as const;

const ROTEIRO: { estados: Estado[]; evento: string | null; tom: "neutro" | "alerta" | "positivo" }[] = [
  { estados: ["ok", "ok", "ok", "ok", "ok"], evento: null, tom: "neutro" },
  { estados: ["ok", "ok", "ok", "ok", "ok"], evento: null, tom: "neutro" },
  {
    estados: ["ok", "ok", "queda", "ok", "ok"],
    evento: "Unidade 07 · Bagé, link primário sem resposta",
    tom: "alerta",
  },
  {
    estados: ["ok", "ok", "contingencia", "ok", "ok"],
    evento: "Contingência assumiu · operação segue rodando",
    tom: "positivo",
  },
  {
    estados: ["ok", "ok", "contingencia", "ok", "ok"],
    evento: "Chamado 4471 aberto na operadora pela CORZ",
    tom: "positivo",
  },
  {
    estados: ["ok", "ok", "ok", "ok", "ok"],
    evento: "Link primário restabelecido · 4 min 12 s",
    tom: "positivo",
  },
];

export default function PainelUnidades() {
  // Começa no quadro estável. Se a animação nunca iniciar — por
  // preferência de movimento reduzido ou por render no servidor — é
  // exatamente este quadro que fica na tela, e ele já faz sentido
  // sozinho: todas as unidades no ar.
  const [passo, setPasso] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setPasso((p) => (p + 1) % ROTEIRO.length), 2600);
    return () => clearInterval(t);
  }, []);

  const quadro = ROTEIRO[passo]!;

  return (
    <div className="relative overflow-hidden rounded-[12px] border border-branco/12 bg-tinta-900/70 backdrop-blur-sm">
      {/* Barra de título */}
      <div className="flex items-center justify-between border-b border-branco/10 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-positivo opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-positivo" />
          </span>
          <span className="rotulo text-branco/70">Monitoramento CORZ</span>
        </div>
        <span className="font-mono text-[0.625rem] tracking-[0.1em] text-branco/35">
          MONITORAMENTO 24/7
        </span>
      </div>

      {/* Unidades */}
      <ul className="divide-y divide-branco/[0.07]">
        {UNIDADES.map((unidade, i) => {
          const estado = quadro.estados[i];
          return (
            <li
              key={unidade.nome}
              className={clsx(
                "flex items-center gap-4 px-5 py-3.5 transition-colors duration-500",
                estado === "queda" && "bg-negativo/[0.07]",
                estado === "contingencia" && "bg-alerta/[0.06]"
              )}
            >
              <span
                aria-hidden
                className={clsx(
                  "h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300",
                  estado === "ok" && "bg-positivo",
                  estado === "queda" && "bg-negativo",
                  estado === "contingencia" && "bg-alerta"
                )}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[0.8125rem] font-medium text-branco/90">
                  {unidade.nome}
                </p>
                <p className="truncate font-mono text-[0.625rem] tracking-[0.06em] text-branco/35">
                  {unidade.link}
                </p>
              </div>
              <span
                className={clsx(
                  "shrink-0 font-mono text-[0.6875rem] tabular-nums transition-colors duration-300",
                  estado === "ok" && "text-branco/45",
                  estado === "queda" && "text-negativo",
                  estado === "contingencia" && "text-alerta"
                )}
              >
                {estado === "ok" && unidade.disp}
                {estado === "queda" && "SEM SINAL"}
                {estado === "contingencia" && "BACKUP"}
              </span>
            </li>
          );
        })}
      </ul>

      {/* Faixa de evento */}
      <div className="border-t border-branco/10 bg-tinta-950/60 px-5 py-3.5">
        <p
          aria-live="polite"
          className={clsx(
            "flex items-center gap-2.5 font-mono text-[0.6875rem] leading-relaxed tracking-[0.04em] transition-colors duration-300",
            quadro.tom === "alerta" && "text-negativo",
            quadro.tom === "positivo" && "text-positivo",
            quadro.tom === "neutro" && "text-branco/35"
          )}
        >
          <span aria-hidden className="opacity-60">
            {quadro.evento ? "›" : "·"}
          </span>
          {quadro.evento ?? "Todas as unidades operando dentro do esperado"}
        </p>
      </div>
    </div>
  );
}
