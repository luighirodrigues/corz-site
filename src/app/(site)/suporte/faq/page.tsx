import type { Metadata } from "next";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import ChamadaFinal from "@/components/blocos/ChamadaFinal";
import Revelar from "@/components/sistema/Revelar";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import { grupos, todasAsPerguntas } from "@/conteudo/faq";
import {
  metadados,
  DadosEstruturados,
  grafo,
  pagina,
  trilha,
  perguntas,
} from "@/lib/seo";

export const metadata: Metadata = metadados({
  titulo: "Perguntas frequentes",
  descricao:
    "Tudo sobre a CORZ: o que fazemos, níveis de contrato, prazos de suporte, segurança e LGPD. Respostas objetivas para quem avalia um parceiro de infraestrutura crítica.",
  caminho: "/suporte/faq",
});

export default function PaginaFaq() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Perguntas frequentes: CORZ",
            descricao:
              "Base de conhecimento com respostas sobre serviços, contratos, suporte e segurança da CORZ Tecnologia.",
            caminho: "/suporte/faq",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Suporte", caminho: "/suporte" },
            { nome: "Perguntas frequentes", caminho: "/suporte/faq" },
          ]),
          perguntas(todasAsPerguntas)
        )}
      />

      <CabecalhoPagina
        rotulo="Base de conhecimento"
        titulo="Perguntas que a diretoria"
        destaque="faz antes de decidir."
        texto="Respostas diretas, sem rodeio comercial. Se a sua pergunta não estiver aqui, fale com a gente e ela provavelmente entra nesta lista."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Suporte", caminho: "/suporte" },
          { nome: "Perguntas frequentes", caminho: "/suporte/faq" },
        ]}
      />

      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <nav
              aria-label="Índice das perguntas"
              className="lg:col-span-3 lg:sticky lg:top-[calc(var(--altura-cabecalho)+2rem)] lg:self-start"
            >
              <Rotulo cor="petroleo">Índice</Rotulo>
              <ul className="mt-5 space-y-2.5">
                {grupos.map((grupo) => (
                  <li key={grupo.slug}>
                    <a
                      href={`#${grupo.slug}`}
                      className="text-[0.9375rem] text-tinta-900/65 transition-colors hover:text-[#1D4FD8]"
                    >
                      {grupo.titulo}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-9">
              {grupos.map((grupo, gi) => (
                <section
                  key={grupo.slug}
                  id={grupo.slug}
                  className={gi > 0 ? "mt-16 scroll-mt-32" : "scroll-mt-32"}
                >
                  <Revelar>
                    <h2 className="font-display text-[clamp(1.5rem,2.8vw,2rem)] font-bold leading-[1.08] tracking-[-0.034em] text-tinta-900">
                      {grupo.titulo}
                    </h2>
                    <p className="mt-2 text-[0.9375rem] text-tinta-900/55">
                      {grupo.descricao}
                    </p>
                  </Revelar>

                  <dl className="mt-8 border-t border-petroleo/14">
                    {grupo.itens.map((item, i) => (
                      <Revelar
                        key={item.pergunta}
                        atraso={i * 50}
                        className="border-b border-petroleo/14 py-7"
                      >
                        <dt className="font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.022em] text-tinta-900 sm:text-[1.125rem]">
                          {item.pergunta}
                        </dt>
                        <dd className="mt-3 max-w-[68ch] text-[0.9375rem] leading-[1.7] text-tinta-900/70">
                          {item.resposta}
                        </dd>
                      </Revelar>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </div>
        </Envelope>
      </section>

      <ChamadaFinal
        rotulo="Não encontrou"
        titulo="Sua pergunta não está aqui?"
        destaque="Pergunte direto."
        texto="Respondemos por escrito, com o nível de detalhe técnico que você precisar para levar a decisão adiante internamente."
        botao="Enviar minha pergunta"
      />
    </>
  );
}
