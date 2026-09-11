import Link from "next/link";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import Revelar from "@/components/sistema/Revelar";
import Icone from "@/components/marca/Icones";
import { solucoes } from "@/conteudo/solucoes";

/**
 * As quatro frentes da CORZ.
 *
 * É a segunda seção da home de propósito. Quem chega quer saber o que a
 * empresa faz antes de ouvir qualquer argumento, e adiar essa resposta
 * custa visita. Cada frente abre com o próprio diagrama e a própria cor,
 * então dá para reconhecer a que interessa antes mesmo de ler o nome.
 *
 * Não são pacotes fechados para comprar. São as frentes em que a CORZ
 * atua; a profundidade de cada uma é decidida no diagnóstico.
 */
export default function GradeSolucoes() {
  return (
    <section className="border-t border-petroleo/12 bg-papel-050 py-20 sm:py-28">
      <Envelope>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <Revelar className="max-w-[36rem]">
            <Rotulo cor="petroleo">O que a CORZ pratica</Rotulo>
            <h2 className="mt-5 font-display text-[clamp(1.875rem,4vw,3.25rem)] font-bold leading-[1] tracking-[-0.04em] text-tinta-900">
              Uma operação inteira, cuidada ponta a ponta.
            </h2>
            <p className="mt-5 max-w-[46ch] text-[1rem] leading-[1.68] text-tinta-900/62">
              Quatro frentes que se sustentam entre si: a rede que conecta, o
              ambiente que processa, as pessoas que produzem e a segurança que
              protege as três. É por isso que respondemos pelo conjunto.
            </p>
          </Revelar>
          <Revelar atraso={100}>
            <Link
              href="/solucoes"
              data-cursor="acao"
              className="group inline-flex items-center gap-2.5 text-[0.9375rem] font-semibold text-[#1D4FD8]"
            >
              Ver todas as soluções
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
              </svg>
            </Link>
          </Revelar>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {solucoes.map((solucao, i) => (
            <Revelar key={solucao.slug} atraso={(i % 2) * 70} como="li">
              <Link
                href={`/solucoes/${solucao.slug}`}
                data-cursor="acao"
                className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-bloco)] border border-petroleo/12 bg-papel-000 p-7 transition-all duration-400 ease-[var(--ease-corz)] hover:-translate-y-1 hover:border-petroleo/25 sm:p-9"
              >
                {/* Véu de cor que sobe no hover, no lugar da sombra. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-32 origin-bottom scale-y-0 opacity-0 transition-all duration-500 ease-[var(--ease-corz)] group-hover:scale-y-100 group-hover:opacity-100"
                  style={{
                    background: `linear-gradient(0deg, ${solucao.cor}18 0%, transparent 100%)`,
                  }}
                />

                <span
                  aria-hidden
                  className="relative flex h-16 w-16 items-center justify-center rounded-[14px] transition-transform duration-500 ease-[var(--ease-corz)] group-hover:scale-105"
                  style={{ background: `${solucao.cor}14`, color: solucao.cor }}
                >
                  <Icone nome={solucao.icone} className="h-9 w-9" />
                </span>

                <h3 className="relative mt-6 font-display text-[clamp(1.25rem,2.2vw,1.625rem)] font-bold leading-[1.12] tracking-[-0.03em] text-tinta-900">
                  {solucao.nome}
                </h3>

                <p className="relative mt-2 text-[0.875rem] font-medium text-tinta-900/45">
                  {solucao.escopo}
                </p>

                <p className="relative mt-4 flex-1 text-[0.9375rem] leading-[1.68] text-tinta-900/65">
                  {solucao.chamada}
                </p>

                <span className="relative mt-7 inline-flex items-center gap-2.5 text-[0.875rem] font-semibold text-[#1D4FD8]">
                  Ver como funciona
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                  </svg>
                </span>
              </Link>
            </Revelar>
          ))}
        </ul>
      </Envelope>
    </section>
  );
}
