import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import ChamadaFinal from "@/components/blocos/ChamadaFinal";
import Revelar from "@/components/sistema/Revelar";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import { canal, episodios, episodioDestaque } from "@/conteudo/podcast";
import { metadados, DadosEstruturados, grafo, pagina, trilha, abs } from "@/lib/seo";
import { rotaOculta } from "@/lib/visibilidade";

export const metadata: Metadata = metadados({
  titulo: "Papo com o Sócio: o podcast da CORZ",
  descricao:
    "Conversas em vídeo, sem roteiro, sobre infraestrutura crítica, custo de parada, cibersegurança e o que realmente derruba a operação de uma empresa com múltiplas unidades.",
  caminho: "/podcast",
});

/**
 * Player do YouTube.
 *
 * Usa o domínio sem cookie de rastreamento e só carrega o iframe quando
 * ele se aproxima da tela. Um player embutido carregado de imediato é um
 * dos maiores pesos que uma página institucional pode carregar, e aqui
 * ele não é o primeiro elemento que a pessoa vê.
 */
function Player({ id, titulo }: { id: string; titulo: string }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[var(--radius-bloco)] border border-branco/10 bg-tinta-900">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
        title={titulo}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}

export default function PaginaPodcast() {
  if (rotaOculta("/podcast")) notFound();

  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Papo com o Sócio: podcast da CORZ",
            descricao:
              "Podcast em vídeo da CORZ Tecnologia sobre infraestrutura crítica e continuidade operacional.",
            caminho: "/podcast",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Podcast", caminho: "/podcast" },
          ]),
          {
            "@type": "PodcastSeries",
            name: "Papo com o Sócio",
            url: abs("/podcast"),
            description:
              "Conversas sobre infraestrutura crítica, custo de parada e continuidade operacional, com os sócios da CORZ Tecnologia.",
            inLanguage: "pt-BR",
            webFeed: canal,
          }
        )}
      />

      <CabecalhoPagina
        rotulo="Papo com o Sócio"
        titulo="Conversa sem roteiro sobre"
        destaque="o que derruba operação."
        texto="Sem apresentação institucional e sem jargão. Os sócios da CORZ sentam para falar de caso real: o que quebrou, quanto custou e o que teria evitado."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Podcast", caminho: "/podcast" },
        ]}
      />

      {/* Episódio em destaque */}
      <section className="sup-escura relative overflow-hidden border-t border-branco/10 bg-tinta-950 py-16 text-branco sm:py-20">
                <Envelope className="relative">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
            <div className="lg:col-span-7">
              <Revelar>
                {episodioDestaque ? (
                  <Player
                    id={episodioDestaque.youtube!}
                    titulo={`Papo com o Sócio, episódio ${episodioDestaque.numero}: ${episodioDestaque.titulo}`}
                  />
                ) : (
                  /* Espaço reservado. Sai do ar assim que o primeiro
                     episódio receber o identificador do vídeo em
                     `conteudo/podcast.ts`. */
                  <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 rounded-[var(--radius-bloco)] border border-dashed border-branco/18 bg-branco/[0.025] px-8 text-center">
                    <span
                      aria-hidden
                      className="flex h-16 w-16 items-center justify-center rounded-full border border-branco/20"
                    >
                      <svg viewBox="0 0 12 12" className="ml-1 h-5 w-5 text-branco/45" fill="currentColor">
                        <path d="M2 1l8 5-8 5z" />
                      </svg>
                    </span>
                    <p className="max-w-[42ch] text-[0.9375rem] leading-relaxed text-branco/45">
                      Espaço reservado para o vídeo do episódio. Assim que o
                      link do YouTube for informado, o player aparece aqui.
                    </p>
                  </div>
                )}
              </Revelar>
            </div>

            <div className="lg:col-span-5">
              <Revelar atraso={100}>
                <Rotulo cor="ciano">Episódio em destaque</Rotulo>
                <h2 className="mt-5 font-display text-[clamp(1.5rem,3vw,2.125rem)] font-bold leading-[1.08] tracking-[-0.034em]">
                  {episodioDestaque?.titulo ?? episodios[0]!.titulo}
                </h2>
                <p className="mt-4 max-w-[46ch] text-[1rem] leading-[1.68] text-branco/58">
                  {episodioDestaque?.resumo ?? episodios[0]!.resumo}
                </p>
                <a
                  href={canal}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="externo"
                  className="group mt-8 inline-flex items-center gap-2.5 rounded-[10px] border border-branco/22 px-6 py-3.5 text-[0.9375rem] font-semibold text-branco transition-colors duration-300 hover:border-branco hover:bg-branco hover:text-tinta-900"
                >
                  <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
                    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8ZM9.6 15.6V8.4l6.2 3.6-6.2 3.6Z" />
                  </svg>
                  Ver todos no YouTube
                </a>
              </Revelar>
            </div>
          </div>
        </Envelope>
      </section>

      {/* Lista de episódios */}
      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <Revelar>
            <Rotulo cor="petroleo">Episódios</Rotulo>
          </Revelar>

          <ol className="mt-10 space-y-3">
            {episodios.map((ep, i) => {
              const Conteudo = (
                <>
                  <span className="font-wide text-[2rem] font-bold leading-none tabular-nums tracking-[-0.04em] text-petroleo/20 transition-colors duration-300 group-hover:text-[#1D4FD8] sm:col-span-1">
                    {ep.numero}
                  </span>
                  <div className="sm:col-span-7">
                    <h2 className="font-display text-[1.1875rem] font-semibold leading-snug tracking-[-0.026em] text-tinta-900">
                      {ep.titulo}
                    </h2>
                    <p className="mt-2 max-w-[60ch] text-[0.9375rem] leading-[1.62] text-tinta-900/62">
                      {ep.resumo}
                    </p>
                  </div>
                  <div className="flex items-center gap-5 sm:col-span-4 sm:justify-end">
                    <span className="text-[0.875rem] text-tinta-900/45">
                      {ep.duracao}
                    </span>
                    <span
                      className={`inline-flex items-center gap-2.5 rounded-[10px] border px-4 py-2 text-[0.8125rem] font-semibold transition-colors duration-300 ${
                        ep.youtube
                          ? "border-petroleo/20 text-tinta-900 group-hover:border-[#1D4FD8] group-hover:bg-[#1D4FD8] group-hover:text-branco"
                          : "border-petroleo/12 text-tinta-900/40"
                      }`}
                    >
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="currentColor">
                        <path d="M2 1l8 5-8 5z" />
                      </svg>
                      {ep.youtube ? "Assistir" : "Em breve"}
                    </span>
                  </div>
                </>
              );

              const classe =
                "group grid items-start gap-4 rounded-[var(--radius-bloco)] border border-petroleo/12 bg-papel-000 p-6 transition-colors duration-300 sm:grid-cols-12 sm:items-center sm:gap-8";

              return (
                <Revelar key={ep.numero} atraso={i * 55} como="li">
                  {ep.youtube ? (
                    <a
                      href={`https://www.youtube.com/watch?v=${ep.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="externo"
                      className={`${classe} hover:border-petroleo/28 hover:bg-papel-050`}
                    >
                      {Conteudo}
                    </a>
                  ) : (
                    <div className={classe}>{Conteudo}</div>
                  )}
                </Revelar>
              );
            })}
          </ol>

          <Revelar atraso={200}>
            <p className="mt-8 text-[0.9375rem] leading-relaxed text-tinta-900/50">
              Novos episódios são publicados no canal do YouTube e anunciados no
              Instagram{" "}
              <a
                href="https://www.instagram.com/corztecnologia/"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="externo"
                className="font-medium text-[#1D4FD8]"
              >
                @corztecnologia
              </a>{" "}
              e no LinkedIn da CORZ.
            </p>
          </Revelar>
        </Envelope>
      </section>

      <ChamadaFinal
        titulo="Assistir ajuda. Medir a própria operação"
        destaque="ajuda mais."
        texto="O diagnóstico da CORZ devolve a disponibilidade real de cada unidade, o custo de telecom fora do contrato e o mapa do que hoje está exposto."
      />
    </>
  );
}
