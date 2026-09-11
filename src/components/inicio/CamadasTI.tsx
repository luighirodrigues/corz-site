import Link from "next/link";
import { Envelope, Rotulo, Destaque } from "@/components/sistema/primitivos";
import Revelar from "@/components/sistema/Revelar";
import { pilares } from "@/conteudo/solucoes";

/**
 * As três camadas de atuação.
 *
 * É a posição da empresa dita inteira: a CORZ não vende ferramenta pela
 * ferramenta, vende continuidade operacional, e ela se sustenta em três
 * planos que existem ao mesmo tempo.
 *
 * O desenho é uma pilha, não uma grade de três cartões iguais: um fio
 * contínuo desce pela lateral e liga os três, porque a ideia central é
 * justamente que nenhum funciona sozinho. Estratégica em cima, porque
 * decide; Operacional embaixo, porque sustenta.
 */
export default function CamadasTI() {
  return (
    <section className="sup-escura relative overflow-hidden bg-tinta-950 py-20 text-branco sm:py-28">
      <div aria-hidden className="absolute inset-0">
                <div
          className="absolute left-1/2 top-[-18%] h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-25"
          style={{
            background: "radial-gradient(circle, #2C3191 0%, transparent 66%)",
          }}
        />
      </div>
      <Envelope className="relative">
        <div className="max-w-[50rem]">
          <Revelar>
            <Rotulo cor="ciano">O que a CORZ entrega de fato</Rotulo>
            <h2 className="mt-6 font-display text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1] tracking-[-0.042em]">
              Ninguém compra ferramenta. Compra{" "}
              <Destaque>continuidade operacional.</Destaque>
            </h2>
          </Revelar>
          <Revelar atraso={100}>
            <p className="mt-6 max-w-[56ch] text-[1.0625rem] leading-[1.62] text-branco/58">
              Firewall, link, servidor e monitoramento são meios. O que sustenta
              uma operação que não pode parar são três camadas trabalhando ao
              mesmo tempo, e é assim que a CORZ se organiza para atender.
            </p>
          </Revelar>
        </div>

        {/* Pilha */}
        <div className="relative mt-14 sm:mt-16">
          {/* Fio contínuo: o que amarra as três camadas. */}
          <div
            aria-hidden
            className="absolute left-[1.0625rem] top-4 bottom-4 w-px sm:left-[1.5625rem]"
            style={{
              background:
                "linear-gradient(180deg, #00ADE7 0%, #3F39BD 50%, #89E20D 100%)",
              opacity: 0.55,
            }}
          />

          <ol className="space-y-4">
            {pilares.map((pilar, i) => (
              <Revelar key={pilar.chave} atraso={i * 110} como="li">
                <div className="relative pl-12 sm:pl-20">
                  {/* Nó no fio */}
                  <span
                    aria-hidden
                    className="absolute left-0 top-8 flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full border bg-tinta-950 sm:h-[3.125rem] sm:w-[3.125rem]"
                    style={{ borderColor: pilar.cor }}
                  >
                    <span
                      className="h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5"
                      style={{ background: pilar.cor }}
                    />
                  </span>

                  <div className="rounded-[var(--radius-bloco)] border border-branco/10 bg-branco/[0.028] p-7 transition-colors duration-400 hover:border-branco/20 hover:bg-branco/[0.055] sm:p-9">
                    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12">
                      <div>
                        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                          <h3
                            className="font-display text-[clamp(1.5rem,2.8vw,2.125rem)] font-bold tracking-[-0.034em]"
                            style={{ color: pilar.cor }}
                          >
                            {pilar.nome}
                          </h3>
                          <span className="text-[0.9375rem] font-medium text-branco/45">
                            {pilar.resumo}
                          </span>
                        </div>

                        <p className="mt-4 max-w-[48ch] text-[1rem] leading-[1.68] text-branco/62">
                          {pilar.descricao}
                        </p>

                        <p className="mt-6 max-w-[46ch] font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.02em] text-branco/90">
                          {pilar.pergunta}
                        </p>
                      </div>

                      <ul className="mt-7 grid gap-2.5 border-t border-branco/10 pt-7 sm:grid-cols-2 lg:mt-0 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
                        {pilar.itens.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 text-[0.875rem] leading-snug text-branco/62"
                          >
                            <span
                              aria-hidden
                              className="mt-[0.5rem] h-[3px] w-3 shrink-0 rounded-full"
                              style={{ background: pilar.cor, opacity: 0.8 }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Revelar>
            ))}
          </ol>
        </div>

        <Revelar atraso={160}>
          <div className="mt-12 flex flex-col items-start gap-5 rounded-[var(--radius-bloco)] border border-branco/10 bg-branco/[0.028] p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <p className="max-w-[52ch] text-[1rem] leading-[1.6] text-branco/70">
              As três camadas não são pacotes para escolher em um cardápio. São
              a profundidade da parceria, e o desenho começa por onde a operação
              está mais exposta hoje.
            </p>
            <Link
              href="/contato"
              data-cursor="acao"
              className="group inline-flex shrink-0 items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] bg-branco px-6 py-3.5 text-[0.9375rem] font-semibold text-tinta-900 transition-colors duration-300 hover:bg-ciano hover:text-tinta-950"
            >
              Falar com a CORZ
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
              </svg>
            </Link>
          </div>
        </Revelar>
      </Envelope>
    </section>
  );
}
