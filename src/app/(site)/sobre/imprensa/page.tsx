import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import ChamadaFinal from "@/components/blocos/ChamadaFinal";
import Revelar from "@/components/sistema/Revelar";
import { Simbolo } from "@/components/marca/Logo";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import { site, provasDeAgora } from "@/conteudo/site";
import { metadados, DadosEstruturados, grafo, pagina, trilha } from "@/lib/seo";
import { rotaOculta } from "@/lib/visibilidade";

export const metadata: Metadata = metadados({
  titulo: "CORZ na mídia",
  descricao:
    "Material de imprensa da CORZ Tecnologia: descrição institucional, números verificados, paleta e uso da marca, e contato para jornalistas.",
  caminho: "/sobre/imprensa",
});

const CORES = [
  { nome: "Petróleo", hex: "#00304D" },
  { nome: "Índigo", hex: "#2C3191" },
  { nome: "Violeta", hex: "#3F39BD" },
  { nome: "Ciano", hex: "#00ADE7" },
  { nome: "Preto", hex: "#000000" },
  { nome: "Branco", hex: "#FFFFFF" },
];

const BOILERPLATES = [
  {
    rotulo: "Descrição curta (1 linha)",
    texto:
      "A CORZ Tecnologia é uma empresa de continuidade operacional que mantém no ar a infraestrutura de empresas com múltiplas unidades.",
  },
  {
    rotulo: "Descrição média (1 parágrafo)",
    texto:
      "Fundada em 2012 em Pelotas/RS, a CORZ Tecnologia é especializada em continuidade operacional para empresas cuja operação não pode parar. Atua na gestão de links e conectividade, redes corporativas, cibersegurança, cloud dedicada e telefonia em nuvem com inteligência artificial, atendendo grandes redes de varejo, atacado, indústria e educação. Opera com disponibilidade média medida de 99,7% e foi uma das pioneiras do Brasil em central PABX com IA.",
  },
];

export default function PaginaImprensa() {
  if (rotaOculta("/sobre/imprensa")) notFound();

  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "CORZ na mídia",
            descricao:
              "Material de imprensa, marca e contato para jornalistas da CORZ Tecnologia.",
            caminho: "/sobre/imprensa",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Sobre", caminho: "/sobre" },
            { nome: "CORZ na mídia", caminho: "/sobre/imprensa" },
          ])
        )}
      />

      <CabecalhoPagina
        rotulo="Imprensa"
        titulo="Material para quem vai"
        destaque="escrever sobre a CORZ."
        texto="Descrições prontas, números verificados e regras de uso da marca. Se precisar de dado, imagem ou entrevista que não esteja aqui, é só pedir."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Sobre", caminho: "/sobre" },
          { nome: "CORZ na mídia", caminho: "/sobre/imprensa" },
        ]}
      />

      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <Revelar>
            <Rotulo cor="petroleo">Texto institucional</Rotulo>
          </Revelar>
          <div className="mt-8 grid gap-px border border-petroleo/14 bg-petroleo/12 lg:grid-cols-2">
            {BOILERPLATES.map((b, i) => (
              <Revelar key={b.rotulo} atraso={i * 80} className="bg-papel-000 p-8">
                <span className="rotulo text-petroleo/45">{b.rotulo}</span>
                <p className="mt-5 text-[0.9375rem] leading-[1.72] text-tinta-900/80">
                  {b.texto}
                </p>
              </Revelar>
            ))}
          </div>

          <Revelar>
            <h2 className="mt-16 rotulo text-petroleo/60">
              Números verificados
            </h2>
          </Revelar>
          <dl className="mt-6 grid gap-px border border-petroleo/14 bg-petroleo/12 sm:grid-cols-2 lg:grid-cols-4">
            {provasDeAgora().map((p, i) => (
              <Revelar key={p.rotulo} atraso={i * 60} className="bg-papel-000 p-7">
                <dt className="sr-only">{p.rotulo}</dt>
                <dd>
                  <span className="font-wide text-[2rem] font-bold leading-none tabular-nums tracking-[-0.03em] text-tinta-900">
                    {"prefixo" in p ? p.prefixo : ""}
                    {p.valor}
                    <span className="text-[#1D4FD8]">{p.sufixo}</span>
                  </span>
                  <span className="mt-2.5 block text-[0.8125rem] leading-snug text-tinta-900/60">
                    {p.rotulo}
                  </span>
                </dd>
              </Revelar>
            ))}
          </dl>
        </Envelope>
      </section>

      <section className="sup-escura relative overflow-hidden bg-tinta-950 py-20 text-branco sm:py-24">
                <Envelope className="relative">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Revelar>
                <Rotulo cor="ciano">A marca</Rotulo>
                <div className="mt-8 flex items-center gap-8 rounded-[10px] border border-branco/12 bg-branco/[0.03] p-10">
                  <Simbolo variante="cor" className="h-20 w-auto" />
                  <span className="font-wide text-[2.25rem] font-bold tracking-[0.16em] leading-none">
                    CORZ
                  </span>
                </div>
                <ul className="mt-7 space-y-2.5 text-[0.875rem] leading-relaxed text-branco/55">
                  <li>· Escreva sempre CORZ em caixa-alta, sem acento.</li>
                  <li>· Não altere as proporções entre símbolo e assinatura.</li>
                  <li>
                    · Sobre fundo escuro, use a versão colorida ou a monocromática
                    branca. Sobre fundo claro, a versão petróleo.
                  </li>
                  <li>· Preserve ao redor da marca um respiro igual à altura do símbolo.</li>
                </ul>
              </Revelar>
            </div>

            <div className="lg:col-span-7">
              <Revelar atraso={100}>
                <Rotulo cor="branco">Paleta</Rotulo>
              </Revelar>
              <ul className="mt-8 grid gap-px overflow-hidden rounded-[10px] border border-branco/12 bg-branco/[0.07] sm:grid-cols-3">
                {CORES.map((cor, i) => (
                  <Revelar
                    key={cor.hex}
                    atraso={100 + i * 45}
                    como="li"
                    className="bg-tinta-950 p-5"
                  >
                    <span
                      aria-hidden
                      className="block h-14 w-full rounded-[6px] border border-branco/10"
                      style={{ background: cor.hex }}
                    />
                    <span className="mt-3 block text-[0.875rem] font-medium">
                      {cor.nome}
                    </span>
                    <span className="mt-0.5 block font-mono text-[0.6875rem] tracking-[0.06em] text-branco/40">
                      {cor.hex}
                    </span>
                  </Revelar>
                ))}
              </ul>
              <Revelar atraso={400}>
                <p className="mt-7 text-[0.875rem] leading-relaxed text-branco/45">
                  Tipografia: Bricolage Grotesque em títulos, Manrope no corpo de
                  texto. Arquivos vetoriais da marca em alta resolução são
                  enviados sob solicitação para{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="font-medium text-ciano"
                  >
                    {site.email}
                  </a>
                  .
                </p>
              </Revelar>
            </div>
          </div>
        </Envelope>
      </section>

      <ChamadaFinal
        rotulo="Contato de imprensa"
        titulo="Precisa de dado, imagem"
        destaque="ou entrevista?"
        texto="Respondemos pedidos de imprensa em até dois dias úteis. Para pauta com prazo fechado, avise no assunto e priorizamos."
        botao="Falar com a CORZ"
      />
    </>
  );
}
