import type { Metadata } from "next";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import FormularioContato from "@/components/blocos/FormularioContato";
import Revelar from "@/components/sistema/Revelar";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import { site } from "@/conteudo/site";
import { metadados, DadosEstruturados, grafo, pagina, trilha } from "@/lib/seo";

export const metadata: Metadata = metadados({
  titulo: "Contato",
  descricao:
    "Fale com a CORZ Tecnologia em Pelotas/RS. Telefone (53) 3027-2698, WhatsApp e formulário para diagnóstico de continuidade operacional.",
  caminho: "/contato",
});

const CANAIS = [
  {
    rotulo: "Comercial",
    titulo: "Quero entender a proposta",
    texto: "Diagnóstico, escopo e proposta para a sua operação.",
    acao: { rotulo: site.telefone, href: `tel:${site.telefoneE164}` },
    horario: site.atendimento.comercial,
  },
  {
    rotulo: "Suporte técnico",
    titulo: "Minha operação está parada",
    texto: "Atendimento imediato para clientes com contrato ativo.",
    acao: { rotulo: "Abrir chamado", href: "/suporte/abrir-chamado" },
    horario: "24 horas por dia, todos os dias",
  },
  {
    rotulo: "Imprensa e parcerias",
    titulo: "Quero falar com a CORZ",
    texto: "Pauta, entrevista, material de marca ou proposta de parceria.",
    acao: { rotulo: site.email, href: `mailto:${site.email}` },
    horario: "Resposta em até dois dias úteis",
  },
];

export default function PaginaContato() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Contato: CORZ Tecnologia",
            descricao:
              "Canais de contato comercial, suporte técnico e imprensa da CORZ Tecnologia.",
            caminho: "/contato",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Contato", caminho: "/contato" },
          ])
        )}
      />

      <CabecalhoPagina
        rotulo="Fale com a CORZ"
        titulo="Vamos falar sobre o que"
        destaque="sua operação não pode perder."
        texto="Descreva o cenário e recebemos com o contexto certo. Se a operação estiver parada agora, use o WhatsApp. O suporte técnico e o comercial são times diferentes."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Contato", caminho: "/contato" },
        ]}
      />

      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Revelar>
                <div className="rounded-[12px] border border-petroleo/14 bg-papel-050 p-7 sm:p-10">
                  <FormularioContato />
                </div>
              </Revelar>
            </div>

            <div className="lg:col-span-5">
              <Revelar atraso={80}>
                <Rotulo cor="petroleo">Canais diretos</Rotulo>
              </Revelar>

              <ul className="mt-7 space-y-px overflow-hidden rounded-[10px] border border-petroleo/14 bg-petroleo/12">
                {CANAIS.map((canal, i) => (
                  <Revelar
                    key={canal.rotulo}
                    atraso={100 + i * 70}
                    como="li"
                    className="bg-papel-000 p-6"
                  >
                    <span className="rotulo text-petroleo/45">
                      {canal.rotulo}
                    </span>
                    <h2 className="mt-3 font-display text-[1.125rem] font-semibold tracking-[-0.025em] text-tinta-900">
                      {canal.titulo}
                    </h2>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-tinta-900/62">
                      {canal.texto}
                    </p>
                    <a
                      href={canal.acao.href}
                      data-cursor="acao"
                      className="mt-4 inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-[#1D4FD8] transition-colors hover:text-[#153bab]"
                    >
                      {canal.acao.rotulo}
                      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
                        <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                      </svg>
                    </a>
                    <p className="mt-3 font-mono text-[0.625rem] tracking-[0.06em] text-tinta-900/40">
                      {canal.horario.toUpperCase()}
                    </p>
                  </Revelar>
                ))}
              </ul>

              <Revelar atraso={340}>
                <div className="mt-8 rounded-[10px] border border-petroleo/14 p-6">
                  <span className="rotulo text-petroleo/45">Onde estamos</span>
                  <address className="mt-4 space-y-1 text-[0.9375rem] not-italic leading-relaxed text-tinta-900/75">
                    <p className="font-semibold text-tinta-900">
                      {site.nomeCompleto}
                    </p>
                    <p>{site.endereco.logradouro}</p>
                    <p>
                      {site.endereco.bairro} · {site.endereco.cidade}/
                      {site.endereco.uf}
                    </p>
                    <p>CEP {site.endereco.cep}</p>
                    <p className="pt-2 font-mono text-[0.75rem] text-tinta-900/45">
                      CNPJ {site.cnpj}
                    </p>
                  </address>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${site.endereco.logradouro}, ${site.endereco.cidade}, ${site.endereco.uf}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="externo"
                    className="mt-5 inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[#1D4FD8]"
                  >
                    Abrir no mapa
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
