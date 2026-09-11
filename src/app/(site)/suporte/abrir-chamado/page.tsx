import type { Metadata } from "next";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import FormularioChamado from "@/components/blocos/FormularioChamado";
import Revelar from "@/components/sistema/Revelar";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import { site } from "@/conteudo/site";
import { metadados, DadosEstruturados, grafo, pagina, trilha } from "@/lib/seo";

export const metadata: Metadata = metadados({
  titulo: "Abrir chamado",
  descricao:
    "Abra um chamado técnico na CORZ. Classificação por criticidade, protocolo imediato e primeira resposta em até 3 minutos.",
  caminho: "/suporte/abrir-chamado",
  noindex: false,
});

const PASSOS = [
  {
    titulo: "Você classifica",
    texto:
      "A criticidade define a fila. Parada total nunca fica atrás de um pedido de relatório.",
  },
  {
    titulo: "Nós assumimos",
    texto:
      "Se o problema for de operadora ou fornecedor, quem abre e cobra o chamado somos nós.",
  },
  {
    titulo: "Você acompanha",
    texto:
      "Protocolo na hora, atualização a cada avanço e registro no histórico da unidade.",
  },
];

export default function PaginaAbrirChamado() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Abrir chamado: Suporte CORZ",
            descricao:
              "Formulário de abertura de chamado técnico com classificação por criticidade.",
            caminho: "/suporte/abrir-chamado",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Suporte", caminho: "/suporte" },
            { nome: "Abrir chamado", caminho: "/suporte/abrir-chamado" },
          ])
        )}
      />

      <CabecalhoPagina
        rotulo="Suporte técnico"
        titulo="Abrir chamado"
        destaque="com prioridade real."
        texto="Quanto melhor a descrição, mais rápido o diagnóstico. Se a operação estiver parada neste momento, abra o chamado e ligue em seguida."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Suporte", caminho: "/suporte" },
          { nome: "Abrir chamado", caminho: "/suporte/abrir-chamado" },
        ]}
      />

      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-8">
              <Revelar>
                <div className="relative rounded-[12px] border border-petroleo/14 bg-papel-050 p-7 sm:p-10">
                  <FormularioChamado />
                </div>
              </Revelar>
            </div>

            <div className="lg:col-span-4">
              <Revelar atraso={80}>
                <Rotulo cor="petroleo">Como funciona</Rotulo>
                <ol className="mt-7 border-t border-petroleo/14">
                  {PASSOS.map((passo, i) => (
                    <li
                      key={passo.titulo}
                      className="flex gap-5 border-b border-petroleo/14 py-5"
                    >
                      <span className="font-mono text-[0.6875rem] tabular-nums text-petroleo/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h2 className="font-display text-[1rem] font-semibold tracking-[-0.022em] text-tinta-900">
                          {passo.titulo}
                        </h2>
                        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-tinta-900/62">
                          {passo.texto}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Revelar>

              <Revelar atraso={200}>
                <div className="mt-8 rounded-[10px] border border-negativo/30 bg-negativo/[0.04] p-6">
                  <span className="rotulo text-negativo">Emergência</span>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-tinta-900/75">
                    Operação totalmente parada tem canal direto. Ligue ou chame
                    no WhatsApp. O chamado é registrado por nós.
                  </p>
                  <a
                    href={`tel:${site.telefoneE164}`}
                    data-cursor="acao"
                    className="mt-4 inline-block font-wide text-[1.375rem] font-bold tracking-[-0.02em] text-tinta-900"
                  >
                    {site.telefone}
                  </a>
                </div>
              </Revelar>
            </div>
          </div>
        </Envelope>
      </section>
    </>
  );
}
