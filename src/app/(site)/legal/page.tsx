import type { Metadata } from "next";
import Link from "next/link";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import Revelar from "@/components/sistema/Revelar";
import { Envelope } from "@/components/sistema/primitivos";
import { metadados, DadosEstruturados, grafo, pagina, trilha } from "@/lib/seo";

export const metadata: Metadata = metadados({
  titulo: "Políticas e documentos",
  descricao:
    "Política de Privacidade e LGPD, Termos de Uso e Política de Cookies da CORZ Tecnologia.",
  caminho: "/legal",
});

const DOCUMENTOS = [
  {
    href: "/legal/privacidade",
    titulo: "Privacidade e LGPD",
    texto:
      "Quais dados coletamos, com que base legal, por quanto tempo guardamos e como exercer seus direitos como titular.",
  },
  {
    href: "/legal/termos",
    titulo: "Termos de Uso",
    texto:
      "Finalidade do conteúdo, propriedade intelectual, regras da área administrativa e foro aplicável.",
  },
  {
    href: "/legal/cookies",
    titulo: "Política de Cookies",
    texto:
      "A lista completa dos cookies do site, com nome, finalidade, prazo e como controlá-los.",
  },
];

export default function PaginaLegal() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Políticas: CORZ",
            descricao: "Documentos legais da CORZ Tecnologia.",
            caminho: "/legal",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Políticas", caminho: "/legal" },
          ])
        )}
      />

      <CabecalhoPagina
        rotulo="Políticas"
        titulo="Documentos escritos"
        destaque="para serem entendidos."
        texto="Nenhum destes documentos foi feito para se proteger de você. Foram feitos para deixar claro o que fazemos com o que é seu."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Políticas", caminho: "/legal" },
        ]}
      />

      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <ul className="grid gap-px border border-petroleo/14 bg-petroleo/12 lg:grid-cols-3">
            {DOCUMENTOS.map((doc, i) => (
              <Revelar key={doc.href} atraso={i * 70} como="li">
                <Link
                  href={doc.href}
                  data-cursor="acao"
                  className="group flex h-full flex-col bg-papel-000 p-8 transition-colors duration-400 hover:bg-tinta-950"
                >
                  <h2 className="font-display text-[1.25rem] font-bold tracking-[-0.028em] text-tinta-900 transition-colors duration-400 group-hover:text-branco">
                    {doc.titulo}
                  </h2>
                  <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.62] text-tinta-900/65 transition-colors duration-400 group-hover:text-branco/55">
                    {doc.texto}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-2.5 text-[0.875rem] font-semibold text-[#1D4FD8] transition-colors duration-400 group-hover:text-ciano">
                    Ler documento
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
    </>
  );
}
