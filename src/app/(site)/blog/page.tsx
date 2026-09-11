import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import ChamadaFinal from "@/components/blocos/ChamadaFinal";
import Revelar from "@/components/sistema/Revelar";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import { listarPublicados, listarCategorias, contarPublicados } from "@/lib/artigos";
import { metadados, DadosEstruturados, grafo, pagina, trilha, abs } from "@/lib/seo";
import { formatarData } from "@/lib/cliente";
import { clsx } from "clsx";
import { rotaOculta } from "@/lib/visibilidade";

export const revalidate = 300;

export const metadata: Metadata = metadados({
  titulo: "Blog: continuidade operacional na prática",
  descricao:
    "Artigos sobre disponibilidade, redes multiunidades, segurança e custo de parada. Escritos por quem opera infraestrutura crítica todos os dias.",
  caminho: "/blog",
});

const POR_PAGINA = 12;

export default async function PaginaBlog({
  searchParams,
}: {
  searchParams: Promise<{ pagina?: string; categoria?: string }>;
}) {
  if (rotaOculta("/blog")) notFound();

  const { pagina: paginaBruta, categoria } = await searchParams;
  const paginaAtual = Math.max(1, Number(paginaBruta) || 1);

  const [artigos, categorias, total] = await Promise.all([
    listarPublicados({
      limite: POR_PAGINA,
      deslocamento: (paginaAtual - 1) * POR_PAGINA,
      categoria,
    }),
    listarCategorias(),
    contarPublicados(categoria),
  ]);

  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  const destaque = paginaAtual === 1 && !categoria ? artigos[0] : undefined;
  const restantes = destaque ? artigos.slice(1) : artigos;

  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Blog da CORZ",
            descricao:
              "Artigos sobre continuidade operacional, redes corporativas e segurança.",
            caminho: "/blog",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Blog", caminho: "/blog" },
          ]),
          {
            "@type": "Blog",
            "@id": `${abs("/blog")}#blog`,
            name: "Blog da CORZ Tecnologia",
            url: abs("/blog"),
            inLanguage: "pt-BR",
            blogPost: artigos.slice(0, 10).map((a) => ({
              "@type": "BlogPosting",
              headline: a.titulo,
              url: abs(`/blog/${a.slug}`),
              datePublished: (a.publicadoEm ?? a.agendadoPara)?.toISOString(),
              author: { "@type": "Person", name: a.autorNome ?? "CORZ" },
            })),
          }
        )}
      />

      <CabecalhoPagina
        rotulo="Conteúdo"
        titulo="O que a gente aprende"
        destaque="quando a operação para."
        texto="Nada de listinha genérica de tendências. Escrevemos sobre o que vimos quebrar de verdade, quanto custou e o que teria evitado."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Blog", caminho: "/blog" },
        ]}
      />

      <section className="border-t border-petroleo/12 bg-papel-000 py-16 sm:py-20">
        <Envelope>
          {categorias.length > 0 && (
            <nav aria-label="Categorias" className="mb-12">
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Link
                    href="/blog"
                    className={clsx(
                      "inline-block rounded-[10px] border px-4 py-2 text-[0.875rem] font-medium transition-colors",
                      !categoria
                        ? "border-tinta-900 bg-tinta-900 text-branco"
                        : "border-petroleo/18 text-tinta-900/65 hover:border-petroleo/45"
                    )}
                  >
                    Tudo
                  </Link>
                </li>
                {categorias
                  .filter((c) => c.total > 0)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/blog?categoria=${c.slug}`}
                        className={clsx(
                          "inline-block rounded-[10px] border px-4 py-2 text-[0.875rem] font-medium transition-colors",
                          categoria === c.slug
                            ? "border-tinta-900 bg-tinta-900 text-branco"
                            : "border-petroleo/18 text-tinta-900/65 hover:border-petroleo/45"
                        )}
                      >
                        {c.nome}
                        <span className="ml-2 text-[0.75rem] font-semibold opacity-45">
                          {c.total}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          )}

          {artigos.length === 0 ? (
            <div className="rounded-[10px] border border-dashed border-petroleo/22 px-8 py-20 text-center">
              <p className="font-display text-[1.375rem] font-bold tracking-[-0.03em] text-tinta-900">
                Ainda não há artigos publicados aqui.
              </p>
              <p className="mx-auto mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-tinta-900/55">
                Estamos preparando o primeiro conteúdo. Enquanto isso, o
                diagnóstico de continuidade já está disponível.
              </p>
              <Link
                href="/contato"
                className="mt-7 inline-block rounded-[10px] bg-[#1D4FD8] px-6 py-3.5 text-[0.9375rem] font-semibold text-branco"
              >
                Solicitar diagnóstico
              </Link>
            </div>
          ) : (
            <>
              {destaque && (
                <Revelar>
                  <Link
                    href={`/blog/${destaque.slug}`}
                    data-cursor="acao"
                    className="group mb-12 grid gap-8 border-b border-petroleo/14 pb-12 lg:grid-cols-12 lg:gap-12"
                  >
                    {destaque.capaUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={destaque.capaUrl}
                        alt={destaque.capaAlt ?? ""}
                        className="aspect-[16/10] w-full rounded-[10px] border border-petroleo/14 object-cover lg:col-span-7"
                      />
                    ) : (
                      <div
                        aria-hidden
                        className="aspect-[16/10] w-full rounded-[var(--radius-bloco)] border border-petroleo/12 lg:col-span-7"
                        style={{
                          background:
                            "linear-gradient(135deg, #eef2f5 0%, #dfe6ec 45%, #f6f8fa 100%)",
                        }}
                      />
                    )}
                    <div className="lg:col-span-5 lg:self-center">
                      <div className="flex items-center gap-4">
                        <Rotulo cor="petroleo">Em destaque</Rotulo>
                      </div>
                      <h2 className="mt-5 font-display text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-[1.08] tracking-[-0.036em] text-tinta-900">
                        {destaque.titulo}
                      </h2>
                      <p className="mt-4 text-[1rem] leading-[1.66] text-tinta-900/65">
                        {destaque.resumo}
                      </p>
                      <p className="mt-6 flex items-center gap-3 text-[0.875rem] text-tinta-900/45">
                        {formatarData(destaque.publicadoEm ?? destaque.agendadoPara)}
                        <span aria-hidden>·</span>
                        {destaque.tempoLeitura} min de leitura
                      </p>
                    </div>
                  </Link>
                </Revelar>
              )}

              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {restantes.map((artigo, i) => (
                  <Revelar key={artigo.id} atraso={(i % 3) * 60} como="li">
                    <Link
                      href={`/blog/${artigo.slug}`}
                      data-cursor="acao"
                      className="group flex h-full flex-col rounded-[var(--radius-bloco)] border border-petroleo/12 bg-papel-000 p-7 transition-all duration-400 ease-[var(--ease-corz)] hover:-translate-y-1 hover:border-petroleo/25"
                    >
                      {artigo.categoriaNome && (
                        <span
                          className="rotulo"
                          style={{ color: artigo.categoriaCor ?? "#00304D" }}
                        >
                          {artigo.categoriaNome}
                        </span>
                      )}
                      <h2 className="mt-4 font-display text-[1.1875rem] font-semibold leading-[1.18] tracking-[-0.026em] text-tinta-900">
                        {artigo.titulo}
                      </h2>
                      <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.62] text-tinta-900/62">
                        {artigo.resumo}
                      </p>
                      <p className="mt-6 flex items-center gap-3 border-t border-petroleo/12 pt-4 text-[0.8125rem] text-tinta-900/45">
                        {formatarData(artigo.publicadoEm ?? artigo.agendadoPara)}
                        <span aria-hidden>·</span>
                        {artigo.tempoLeitura} min
                      </p>
                    </Link>
                  </Revelar>
                ))}
              </ul>

              {totalPaginas > 1 && (
                <nav
                  aria-label="Paginação"
                  className="mt-12 flex items-center justify-between border-t border-petroleo/14 pt-6"
                >
                  {paginaAtual > 1 ? (
                    <Link
                      href={`/blog?pagina=${paginaAtual - 1}${categoria ? `&categoria=${categoria}` : ""}`}
                      className="text-[0.875rem] font-semibold text-[#1D4FD8]"
                    >
                      ← Anterior
                    </Link>
                  ) : (
                    <span />
                  )}
                  <span className="text-[0.875rem] font-medium text-tinta-900/45">
                    Página {paginaAtual} de {totalPaginas}
                  </span>
                  {paginaAtual < totalPaginas ? (
                    <Link
                      href={`/blog?pagina=${paginaAtual + 1}${categoria ? `&categoria=${categoria}` : ""}`}
                      className="text-[0.875rem] font-semibold text-[#1D4FD8]"
                    >
                      Próxima →
                    </Link>
                  ) : (
                    <span />
                  )}
                </nav>
              )}
            </>
          )}
        </Envelope>
      </section>

      <ChamadaFinal
        titulo="Ler ajuda. Medir a própria operação"
        destaque="ajuda mais."
        texto="O diagnóstico da CORZ mostra a disponibilidade real das suas unidades, o custo de telecom fora do contrato e onde a operação está exposta hoje."
      />
    </>
  );
}
