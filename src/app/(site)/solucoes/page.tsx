import type { Metadata } from "next";
import Link from "next/link";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import ChamadaFinal from "@/components/blocos/ChamadaFinal";
import FaixaComercial from "@/components/blocos/FaixaComercial";
import Perguntas from "@/components/blocos/Perguntas";
import Revelar from "@/components/sistema/Revelar";
import Icone from "@/components/marca/Icones";
import { Envelope, Rotulo, Destaque } from "@/components/sistema/primitivos";
import { solucoes, pilares } from "@/conteudo/solucoes";
import {
  metadados,
  DadosEstruturados,
  grafo,
  pagina,
  trilha,
  perguntas,
} from "@/lib/seo";

export const metadata: Metadata = metadados({
  titulo: "Soluções: infraestrutura crítica ponta a ponta",
  descricao:
    "Conectividade e Redes, Cloud e Datacenter, Modern Workplace e Cibersegurança. Quatro frentes que sustentam a operação inteira de empresas que não podem parar.",
  caminho: "/solucoes",
});

const FAQ = [
  {
    pergunta: "Preciso contratar todas as frentes da CORZ?",
    resposta:
      "Não. A maioria das empresas começa pela frente que está doendo mais, normalmente conectividade ou cibersegurança, e amplia conforme o resultado aparece. O desenho parte do diagnóstico da sua operação, não de um pacote pronto.",
  },
  {
    pergunta: "A CORZ vende pacotes fechados de serviço?",
    resposta:
      "Não trabalhamos com cardápio. O que a CORZ entrega é continuidade operacional, sustentada em três camadas: TI Estratégica, que decide para onde a infraestrutura precisa crescer; TI Tática, que define governança, acessos e procedimentos; e TI Operacional, que monitora e responde todos os dias. O escopo é montado a partir de onde a operação está exposta.",
  },
  {
    pergunta: "A CORZ substitui meu time de TI?",
    resposta:
      "Não. A CORZ assume a camada de infraestrutura e a relação com operadoras e fornecedores, liberando o time interno para o que é específico do negócio. A maior parte dos nossos clientes tem equipe própria de TI.",
  },
  {
    pergunta: "Como a CORZ cobra pelos serviços?",
    resposta:
      "O modelo é de contrato mensal, dimensionado pelo número de unidades, pela criticidade da operação e pela profundidade da parceria. A auditoria de telecom pode ser remunerada pela economia efetivamente gerada.",
  },
];

export default function PaginaSolucoes() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Soluções CORZ",
            descricao:
              "Infraestrutura crítica ponta a ponta para empresas com múltiplas unidades.",
            caminho: "/solucoes",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Soluções", caminho: "/solucoes" },
          ]),
          perguntas(FAQ),
          {
            "@type": "ItemList",
            itemListElement: solucoes.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: s.nome,
              url: `/solucoes/${s.slug}`,
            })),
          }
        )}
      />

      <CabecalhoPagina
        rotulo="O que a CORZ pratica"
        titulo="Uma operação de rede inteira,"
        destaque="cuidada ponta a ponta."
        texto="Da porta de entrada de cada unidade até o servidor onde o sistema de gestão roda. A CORZ não vende produto isolado: responde pelo conjunto que mantém a empresa faturando."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Soluções", caminho: "/solucoes" },
        ]}
      />

      {/* Frentes de atuação */}
      <section className="bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <ul className="grid gap-4 lg:grid-cols-2">
            {solucoes.map((s, i) => {
              const cor = s.cor;
              return (
                <Revelar key={s.slug} atraso={(i % 2) * 70} como="li">
                  <Link
                    href={`/solucoes/${s.slug}`}
                    data-cursor="acao"
                    className="group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-bloco)] border border-petroleo/12 bg-papel-050 p-8 transition-all duration-400 ease-[var(--ease-corz)] hover:-translate-y-1 hover:border-petroleo/25 hover:bg-papel-000 sm:p-10"
                  >
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 ease-[var(--ease-corz)] group-hover:scale-x-100"
                      style={{ background: cor }}
                    />

                    <div className="flex items-start justify-between gap-6">
                      <span
                        aria-hidden
                        className="flex h-16 w-16 items-center justify-center rounded-[14px] transition-transform duration-500 ease-[var(--ease-corz)] group-hover:scale-105"
                        style={{ background: `${cor}14`, color: cor }}
                      >
                        <Icone nome={s.icone} className="h-9 w-9" />
                      </span>
                      <span className="max-w-[16ch] text-right text-[0.8125rem] font-medium leading-snug text-tinta-900/40">
                        {s.escopo}
                      </span>
                    </div>

                    <h2 className="mt-7 font-display text-[clamp(1.375rem,2.2vw,1.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-tinta-900">
                      {s.nome}
                    </h2>

                    <p className="mt-4 flex-1 text-[0.9375rem] leading-[1.68] text-tinta-900/65">
                      {s.chamada}
                    </p>

                    {/* Amostra do inventário: dá densidade de informação
                        ao cartão sem obrigar a abrir a página. */}
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {s.capacidades.slice(0, 4).map((grupo) => (
                        <li
                          key={grupo.titulo}
                          className="rounded-full border border-petroleo/14 px-3 py-1 text-[0.75rem] font-medium text-tinta-900/55"
                        >
                          {grupo.titulo}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-7 inline-flex items-center gap-2.5 text-[0.875rem] font-semibold text-[#1D4FD8]">
                      Ver como funciona
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                        <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                      </svg>
                    </span>
                  </Link>
                </Revelar>
              );
            })}
          </ul>
        </Envelope>
      </section>

      <FaixaComercial
        titulo="Não sabe por onde começar?"
        texto="O diagnóstico responde isso com dado. Levantamos disponibilidade, custo de telecom e exposição de segurança antes de qualquer proposta."
      />

      {/* Três camadas */}
      <section className="sup-escura relative overflow-hidden bg-tinta-950 py-20 text-branco sm:py-24">
                <Envelope className="relative">
          <Revelar>
            <Rotulo cor="ciano">Como a parceria se organiza</Rotulo>
            <h2 className="mt-6 max-w-[26ch] font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.038em]">
              A CORZ não vende ferramenta.{" "}
              <Destaque>Vende continuidade.</Destaque>
            </h2>
            <p className="mt-6 max-w-[54ch] text-[1.0625rem] leading-[1.62] text-branco/58">
              As frentes acima são o meio. O que a empresa contrata são três
              camadas de atuação que existem ao mesmo tempo, e que definem a
              profundidade da parceria.
            </p>
          </Revelar>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {pilares.map((pilar, i) => (
              <Revelar
                key={pilar.chave}
                atraso={i * 80}
                className="relative overflow-hidden rounded-[var(--radius-bloco)] border border-branco/10 bg-branco/[0.028] p-8 transition-colors duration-400 hover:border-branco/22 hover:bg-branco/[0.055]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: pilar.cor }}
                />
                <h3
                  className="font-display text-[1.625rem] font-bold tracking-[-0.032em]"
                  style={{ color: pilar.cor }}
                >
                  {pilar.nome}
                </h3>
                <p className="mt-1.5 text-[0.9375rem] font-medium text-branco/45">
                  {pilar.resumo}
                </p>
                <p className="mt-5 text-[0.9375rem] leading-[1.66] text-branco/62">
                  {pilar.descricao}
                </p>
                <ul className="mt-7 space-y-2.5 border-t border-branco/10 pt-6">
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
              </Revelar>
            ))}
          </div>
        </Envelope>
      </section>

      <Perguntas itens={FAQ} titulo="Como funciona trabalhar com a CORZ" />

      <ChamadaFinal
        titulo="Comece pelo que está doendo"
        destaque="mais hoje."
        texto="O diagnóstico mapeia disponibilidade, custo de telecom e exposição de segurança da sua operação. A partir dele, você decide por onde começar."
      />
    </>
  );
}
