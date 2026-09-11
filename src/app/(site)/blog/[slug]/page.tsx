import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarPublicado, relacionados } from "@/lib/artigos";
import ChamadaFinal from "@/components/blocos/ChamadaFinal";
import Revelar from "@/components/sistema/Revelar";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import { formatarData } from "@/lib/cliente";
import {
  metadados,
  DadosEstruturados,
  grafo,
  perguntas,
  trilha,
  abs,
  URL_BASE,
} from "@/lib/seo";
import { site } from "@/conteudo/site";
import { rotaOculta } from "@/lib/visibilidade";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artigo = await buscarPublicado(slug);
  if (!artigo) return { title: "Artigo não encontrado" };

  const publicado = artigo.publicadoEm ?? artigo.agendadoPara;

  return metadados({
    titulo: artigo.seoTitulo ?? artigo.titulo,
    descricao: artigo.seoDescricao ?? artigo.resumo,
    caminho: `/blog/${artigo.slug}`,
    imagem: artigo.seoImagem ?? artigo.capaUrl ?? undefined,
    tipo: "article",
    noindex: artigo.noindex,
    publicadoEm: publicado?.toISOString(),
    atualizadoEm: artigo.atualizadoEm?.toISOString(),
    autor: artigo.autorNome ?? site.nomeCompleto,
  });
}

export default async function PaginaArtigo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (rotaOculta("/blog")) notFound();

  const { slug } = await params;
  const artigo = await buscarPublicado(slug);
  if (!artigo) notFound();

  const publicado = artigo.publicadoEm ?? artigo.agendadoPara;
  const outros = await relacionados(artigo.id, artigo.categoriaSlug);
  const faq = (artigo.faq ?? []) as { pergunta: string; resposta: string }[];

  return (
    <>
      <DadosEstruturados
        dados={grafo(
          {
            "@type": "BlogPosting",
            "@id": `${abs(`/blog/${artigo.slug}`)}#artigo`,
            headline: artigo.titulo,
            alternativeHeadline: artigo.subtitulo ?? undefined,
            description: artigo.seoDescricao ?? artigo.resumo,
            url: abs(`/blog/${artigo.slug}`),
            mainEntityOfPage: abs(`/blog/${artigo.slug}`),
            datePublished: publicado?.toISOString(),
            dateModified: (artigo.atualizadoEm ?? publicado)?.toISOString(),
            inLanguage: "pt-BR",
            wordCount: artigo.textoPuro.split(/\s+/).length,
            timeRequired: `PT${artigo.tempoLeitura}M`,
            image: artigo.capaUrl ? [artigo.capaUrl] : undefined,
            articleSection: artigo.categoriaNome ?? undefined,
            author: {
              "@type": "Person",
              name: artigo.autorNome ?? site.nomeCompleto,
              jobTitle: artigo.autorCargo ?? undefined,
              worksFor: { "@id": `${URL_BASE}/#organizacao` },
            },
            publisher: { "@id": `${URL_BASE}/#organizacao` },
            isPartOf: { "@id": `${abs("/blog")}#blog` },
          },
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Blog", caminho: "/blog" },
            { nome: artigo.titulo, caminho: `/blog/${artigo.slug}` },
          ]),
          ...(faq.length ? [perguntas(faq)] : [])
        )}
      />

      <article>
        <header className="sup-escura relative overflow-hidden bg-tinta-950 text-branco">
          <div aria-hidden className="absolute inset-0">
                        <div
              className="absolute right-[-14%] top-[-28%] h-[38rem] w-[38rem] rounded-full opacity-30"
              style={{
                background:
                  "radial-gradient(circle, #2C3191 0%, transparent 68%)",
              }}
            />
          </div>
          <Envelope className="relative pb-16 pt-[calc(var(--altura-cabecalho)+3rem)] sm:pb-20 sm:pt-[calc(var(--altura-cabecalho)+4.5rem)]">
            <nav aria-label="Trilha" className="mb-9">
              <ol className="flex flex-wrap items-center gap-x-2.5 text-[0.8125rem] text-branco/40">
                <li>
                  <Link href="/" className="transition-colors hover:text-ciano">
                    Início
                  </Link>
                </li>
                <li aria-hidden>/</li>
                <li>
                  <Link href="/blog" className="transition-colors hover:text-ciano">
                    Blog
                  </Link>
                </li>
                {artigo.categoriaNome && (
                  <>
                    <li aria-hidden>/</li>
                    <li className="text-branco/60">{artigo.categoriaNome}</li>
                  </>
                )}
              </ol>
            </nav>

            <div className="max-w-[52rem]">
              {artigo.categoriaNome && (
                <Rotulo cor="ciano">{artigo.categoriaNome}</Rotulo>
              )}
              <h1 className="mt-6 font-display text-[clamp(2rem,4.8vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.042em]">
                {artigo.titulo}
              </h1>
              {artigo.subtitulo && (
                <p className="mt-6 max-w-[54ch] text-[1.125rem] leading-[1.6] text-branco/60">
                  {artigo.subtitulo}
                </p>
              )}

              <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-branco/12 pt-6 text-[0.875rem] text-branco/50">
                <span className="font-medium text-branco/70">
                  {artigo.autorNome ?? "CORZ"}
                </span>
                <span aria-hidden>·</span>
                <time dateTime={publicado?.toISOString()}>
                  {formatarData(publicado)}
                </time>
                <span aria-hidden>·</span>
                <span>{artigo.tempoLeitura} min de leitura</span>
              </div>
            </div>
          </Envelope>
        </header>

        {artigo.capaUrl && (
          <div className="border-b border-petroleo/12 bg-papel-050">
            <Envelope className="py-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={artigo.capaUrl}
                alt={artigo.capaAlt ?? ""}
                className="w-full rounded-[10px] border border-petroleo/14"
              />
            </Envelope>
          </div>
        )}

        <div className="bg-papel-000 py-16 sm:py-20">
          <Envelope>
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-8">
                {artigo.respostaCurta && (
                  <Revelar>
                    <div className="mb-10 rounded-[var(--radius-bloco)] border-l-[3px] border-[#1D4FD8] bg-papel-050 p-7">
                      <p className="text-[1.0625rem] leading-[1.66] text-tinta-900/85">
                        {artigo.respostaCurta}
                      </p>
                    </div>
                  </Revelar>
                )}

                {/* O HTML já foi sanitizado no servidor antes de ser gravado. */}
                <div
                  className="prosa"
                  dangerouslySetInnerHTML={{ __html: artigo.conteudo }}
                />

                {faq.length > 0 && (
                  <section className="mt-16 border-t border-petroleo/14 pt-10">
                    <Rotulo cor="petroleo">Perguntas frequentes</Rotulo>
                    <dl className="mt-8 border-t border-petroleo/14">
                      {faq.map((item) => (
                        <div
                          key={item.pergunta}
                          className="border-b border-petroleo/14 py-6"
                        >
                          <dt className="font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.022em] text-tinta-900">
                            {item.pergunta}
                          </dt>
                          <dd className="mt-3 max-w-[68ch] text-[0.9375rem] leading-[1.72] text-tinta-900/72">
                            {item.resposta}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </section>
                )}
              </div>

              <aside className="lg:col-span-4">
                <div className="lg:sticky lg:top-[calc(var(--altura-cabecalho)+2rem)] space-y-8">
                  <div className="rounded-[10px] border border-petroleo/14 p-6">
                    <Rotulo cor="petroleo">Escrito por</Rotulo>
                    <p className="mt-4 font-display text-[1.0625rem] font-semibold tracking-[-0.024em] text-tinta-900">
                      {artigo.autorNome ?? "Equipe CORZ"}
                    </p>
                    {artigo.autorCargo && (
                      <p className="mt-1 text-[0.8125rem] text-tinta-900/50">
                        {artigo.autorCargo}
                      </p>
                    )}
                    {artigo.autorBio && (
                      <p className="mt-3 text-[0.875rem] leading-relaxed text-tinta-900/62">
                        {artigo.autorBio}
                      </p>
                    )}
                  </div>

                  <div className="rounded-[10px] border border-petroleo/14 bg-tinta-950 p-6 text-branco">
                    <Rotulo cor="ciano">Diagnóstico</Rotulo>
                    <p className="mt-4 text-[0.9375rem] leading-relaxed text-branco/65">
                      Quer saber quantas horas a sua operação parou no último
                      mês? A gente mede e mostra.
                    </p>
                    <Link
                      href="/contato"
                      data-cursor="acao"
                      className="mt-5 inline-block rounded-[10px] bg-branco px-5 py-3 text-[0.875rem] font-semibold text-tinta-950 transition-colors hover:bg-ciano"
                    >
                      Solicitar diagnóstico
                    </Link>
                  </div>
                </div>
              </aside>
            </div>
          </Envelope>
        </div>

        {outros.length > 0 && (
          <section className="border-t border-petroleo/12 bg-papel-050 py-16">
            <Envelope>
              <Rotulo cor="petroleo">Continue lendo</Rotulo>
              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {outros.map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/blog/${o.slug}`}
                      data-cursor="acao"
                      className="group flex h-full flex-col rounded-[var(--radius-bloco)] border border-petroleo/12 bg-papel-000 p-6 transition-all duration-400 ease-[var(--ease-corz)] hover:-translate-y-1 hover:border-petroleo/25"
                    >
                      <h2 className="font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.024em] text-tinta-900">
                        {o.titulo}
                      </h2>
                      <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-tinta-900/60">
                        {o.resumo}
                      </p>
                      <p className="mt-5 text-[0.8125rem] text-tinta-900/45">
                        {o.tempoLeitura} min de leitura
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Envelope>
          </section>
        )}
      </article>

      <ChamadaFinal
        titulo="Sua operação aguenta"
        destaque="o próximo sábado de pico?"
        texto="O diagnóstico da CORZ mede disponibilidade real, custo de telecom e exposição de segurança da sua rede, sem compromisso de contratação."
      />
    </>
  );
}
