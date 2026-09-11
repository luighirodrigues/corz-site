import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { solucoes, porSlug } from "@/conteudo/solucoes";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import Perguntas from "@/components/blocos/Perguntas";
import ChamadaFinal from "@/components/blocos/ChamadaFinal";
import FaixaComercial from "@/components/blocos/FaixaComercial";
import Revelar from "@/components/sistema/Revelar";
import Icone, { tintaSobre } from "@/components/marca/Icones";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import { site } from "@/conteudo/site";
import {
  metadados,
  DadosEstruturados,
  grafo,
  pagina,
  perguntas,
  servico,
  trilha,
} from "@/lib/seo";

export function generateStaticParams() {
  return solucoes.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = porSlug(slug);
  if (!s) return {};
  return {
    ...metadados({
      titulo: s.seo.titulo,
      descricao: s.seo.descricao,
      caminho: `/solucoes/${s.slug}`,
    }),
    keywords: s.seo.termos,
  };
}

export default async function PaginaSolucao({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const s = porSlug(slug);
  if (!s) notFound();

  const caminho = `/solucoes/${s.slug}`;
  const cor = s.cor;
  const outras = solucoes.filter((o) => o.slug !== s.slug);

  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({ nome: s.seo.titulo, descricao: s.seo.descricao, caminho }),
          servico({ nome: s.nome, descricao: s.seo.descricao, caminho }),
          perguntas(s.faq),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Soluções", caminho: "/solucoes" },
            { nome: s.nome, caminho },
          ]),
          {
            /* O inventário de capacidades também vai estruturado: é o
               que permite ao buscador entender o escopo da frente sem
               depender de interpretar o texto corrido. */
            "@type": "ItemList",
            name: `O que a frente ${s.nome} cobre`,
            itemListElement: s.capacidades.flatMap((grupo) =>
              grupo.itens.map((item) => ({
                "@type": "ListItem",
                name: item.nome,
                description: item.texto,
              }))
            ),
          }
        )}
      />

      <CabecalhoPagina
        rotulo={s.escopo}
        icone={s.icone}
        corIcone={cor}
        titulo={s.titulo.antes}
        destaque={s.titulo.destaque}
        depois={s.titulo.depois}
        texto={s.promessa}
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Soluções", caminho: "/solucoes" },
          { nome: s.nome, caminho },
        ]}
        aside={
          <div className="rounded-[var(--radius-bloco)] border border-branco/12 bg-branco/[0.03] p-7">
            <p className="text-[0.9375rem] leading-[1.72] text-branco/78">
              {s.respostaCurta}
            </p>
            <div className="mt-7 flex flex-col gap-3 border-t border-branco/10 pt-6 sm:flex-row">
              <Link
                href="/contato"
                data-cursor="acao"
                className="group inline-flex flex-1 items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] px-5 py-3.5 text-[0.9375rem] font-semibold transition-opacity duration-300 hover:opacity-90"
                style={{ background: cor, color: tintaSobre(cor) }}
              >
                {s.cta.botao}
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                </svg>
              </Link>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="externo"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-[10px] border border-branco/22 px-5 py-3.5 text-[0.9375rem] font-semibold text-branco transition-colors duration-300 hover:border-branco hover:bg-branco hover:text-tinta-900"
              >
                Fale com a CORZ
              </a>
            </div>
          </div>
        }
      />

      {/* Inventário da frente.
          Vem logo depois do topo de propósito: é a pergunta que a pessoa
          traz ao abrir a página, "isso aqui cobre o que eu preciso?", e
          ela se responde varrendo a lista com os olhos em segundos. */}
      <section className="border-t border-petroleo/12 bg-papel-050 py-20 sm:py-24">
        <Envelope>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <Revelar className="max-w-[38rem]">
              <Rotulo cor="petroleo">O que esta frente cobre</Rotulo>
              <h2 className="mt-5 font-display text-[clamp(1.625rem,3.2vw,2.5rem)] font-bold leading-[1.06] tracking-[-0.036em] text-tinta-900">
                {s.escopo}.
              </h2>
            </Revelar>
            <Revelar atraso={80}>
              <Link
                href="/contato"
                data-cursor="acao"
                className="group inline-flex items-center gap-2.5 text-[0.9375rem] font-semibold text-[#1D4FD8]"
              >
                Montar o escopo da minha operação
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                </svg>
              </Link>
            </Revelar>
          </div>

          {/* Cada produto com o próprio nome e uma linha do que resolve.
              O nome é o que a pessoa pesquisa; a linha é o que faz a
              lista informar em vez de só enfileirar siglas. */}
          <div className="mt-10 space-y-4">
            {s.capacidades.map((grupo, g) => (
              <Revelar
                key={grupo.titulo}
                atraso={g * 60}
                className="rounded-[var(--radius-bloco)] border border-petroleo/12 bg-papel-000 p-7 sm:p-9"
              >
                <div className="grid gap-7 lg:grid-cols-12 lg:gap-10">
                  <div className="lg:col-span-3">
                    <span
                      aria-hidden
                      className="block h-[3px] w-8 rounded-full"
                      style={{ background: cor }}
                    />
                    <h3 className="mt-4 font-display text-[1.25rem] font-bold leading-snug tracking-[-0.026em] text-tinta-900">
                      {grupo.titulo}
                    </h3>
                    <p className="mt-2 text-[0.8125rem] font-medium text-tinta-900/40">
                      {grupo.itens.length}{" "}
                      {grupo.itens.length === 1 ? "serviço" : "serviços"}
                    </p>
                  </div>

                  <dl className="grid gap-x-8 gap-y-6 lg:col-span-9 sm:grid-cols-2">
                    {grupo.itens.map((item) => (
                      <div key={item.nome}>
                        <dt className="flex items-start gap-2.5 font-display text-[1rem] font-semibold leading-snug tracking-[-0.02em] text-tinta-900">
                          <svg
                            viewBox="0 0 16 16"
                            aria-hidden
                            className="mt-[0.2rem] h-4 w-4 shrink-0"
                            style={{ color: cor }}
                          >
                            <path
                              d="M3 8.5 6.5 12 13 4.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          {item.nome}
                        </dt>
                        <dd className="mt-2 pl-[1.625rem] text-[0.9375rem] leading-[1.62] text-tinta-900/65">
                          {item.texto}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </Revelar>
            ))}
          </div>
        </Envelope>
      </section>

      {/* O que trava hoje */}
      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Revelar>
                <h2 className="font-display text-[clamp(1.625rem,3.2vw,2.5rem)] font-bold leading-[1.06] tracking-[-0.036em] text-tinta-900">
                  {s.dor.titulo}
                </h2>
                <p className="mt-6 max-w-[48ch] text-[1.0625rem] leading-[1.66] text-tinta-900/68">
                  {s.dor.texto}
                </p>
              </Revelar>

              <Revelar atraso={120}>
                <div
                  className="mt-9 rounded-[var(--radius-bloco)] p-7"
                  style={{ background: `${cor}0F` }}
                >
                  <p className="text-[1.0625rem] leading-[1.62] text-tinta-900/88">
                    {s.consequencia}
                  </p>
                </div>
              </Revelar>
            </div>

            <div className="lg:col-span-7">
              <Revelar atraso={80}>
                <p className="font-display text-[1.25rem] font-semibold tracking-[-0.024em] text-tinta-900">
                  O que costuma estar acontecendo agora
                </p>
              </Revelar>
              <ul className="mt-6 space-y-2.5">
                {s.riscos.map((risco, i) => (
                  <Revelar
                    key={risco}
                    atraso={i * 55}
                    como="li"
                    className="flex items-start gap-4 rounded-[10px] border border-petroleo/12 bg-papel-050 px-5 py-4 transition-colors duration-300 hover:border-petroleo/25 hover:bg-branco"
                  >
                    <span
                      aria-hidden
                      className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-negativo"
                    />
                    <span className="text-[0.9375rem] leading-relaxed text-tinta-900/78">
                      {risco}
                    </span>
                  </Revelar>
                ))}
              </ul>
            </div>
          </div>
        </Envelope>
      </section>

      <FaixaComercial
        titulo="Reconheceu a sua operação em algum desses pontos?"
        texto="Uma conversa de trinta minutos com o time comercial já indica o tamanho do problema e por onde começar."
        cor={cor}
      />

      {/* Como a CORZ opera */}
      <section className="sup-escura relative overflow-hidden bg-tinta-950 py-20 text-branco sm:py-24">
        <div
          aria-hidden
          className="absolute right-[-12%] top-[-20%] h-[38rem] w-[38rem] rounded-full opacity-25"
          style={{
            background: `radial-gradient(circle, ${cor} 0%, transparent 66%)`,
          }}
        />

        <Envelope className="relative">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Revelar className="max-w-[34rem]">
              <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.038em]">
                {s.solucao.titulo}
              </h2>
            </Revelar>
            <Revelar atraso={80}>
              <span
                aria-hidden
                className="flex h-24 w-24 items-center justify-center rounded-[16px]"
                style={{ background: `${cor}1A`, color: cor }}
              >
                <Icone nome={s.icone} className="h-14 w-14" />
              </span>
            </Revelar>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {s.solucao.itens.map((item, i) => (
              <Revelar
                key={item.titulo}
                atraso={i * 60}
                como="li"
                className="group rounded-[var(--radius-bloco)] border border-branco/10 bg-branco/[0.028] p-7 transition-colors duration-400 hover:border-branco/22 hover:bg-branco/[0.06]"
              >
                <span
                  aria-hidden
                  className="block h-[3px] w-8 rounded-full transition-all duration-500 ease-[var(--ease-corz)] group-hover:w-14"
                  style={{ background: cor }}
                />
                <h3 className="mt-5 font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.022em] text-branco">
                  {item.titulo}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-[1.64] text-branco/58">
                  {item.texto}
                </p>
              </Revelar>
            ))}
          </ul>

          {/* Entregáveis */}
          <div className="mt-16 grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Revelar>
                <Rotulo cor="branco">O que você recebe</Rotulo>
                <p className="mt-5 max-w-[32ch] text-[0.9375rem] leading-relaxed text-branco/50">
                  Entregas concretas, com responsável e prazo. Nada aqui é
                  promessa de esforço.
                </p>
                <Link
                  href="/contato"
                  data-cursor="acao"
                  className="group mt-7 inline-flex items-center gap-2.5 text-[0.9375rem] font-semibold transition-opacity hover:opacity-80"
                  style={{ color: cor }}
                >
                  Pedir uma proposta para a minha operação
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                  </svg>
                </Link>
              </Revelar>
            </div>
            <div className="lg:col-span-8">
              <ul className="space-y-2.5">
                {s.entregaveis.map((item, i) => (
                  <Revelar
                    key={item}
                    atraso={i * 55}
                    como="li"
                    className="flex items-start gap-4 rounded-[10px] border border-branco/10 px-5 py-4"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      aria-hidden
                      className="mt-[0.15rem] h-4 w-4 shrink-0 text-positivo"
                    >
                      <path
                        d="M3 8.5 6.5 12 13 4.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[0.9375rem] leading-relaxed text-branco/78">
                      {item}
                    </span>
                  </Revelar>
                ))}
              </ul>
            </div>
          </div>
        </Envelope>
      </section>

      <Perguntas
        itens={s.faq}
        titulo={`Dúvidas sobre ${s.nome.replace(" & ", " e ").toLowerCase()}`}
        rotulo="Perguntas frequentes"
      />

      {/* As outras frentes */}
      <section className="border-t border-petroleo/12 bg-papel-050 py-16">
        <Envelope>
          <Rotulo cor="petroleo">As outras frentes</Rotulo>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {outras.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/solucoes/${o.slug}`}
                  data-cursor="acao"
                  className="group flex h-full flex-col rounded-[var(--radius-bloco)] border border-petroleo/12 bg-papel-000 p-6 transition-all duration-400 ease-[var(--ease-corz)] hover:-translate-y-1 hover:border-petroleo/25"
                >
                  <span
                    aria-hidden
                    className="flex h-11 w-11 items-center justify-center rounded-[10px]"
                    style={{ background: `${o.cor}14`, color: o.cor }}
                  >
                    <Icone nome={o.icone} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-5 font-display text-[1.0625rem] font-semibold tracking-[-0.022em] text-tinta-900">
                    {o.nome}
                  </h3>
                  <p className="mt-2 text-[0.875rem] leading-relaxed text-tinta-900/60">
                    {o.escopo}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Envelope>
      </section>

      <ChamadaFinal
        rotulo="Próximo passo"
        titulo={s.cta.titulo}
        texto={s.cta.texto}
        botao={s.cta.botao}
      />
    </>
  );
}
