import type { Metadata } from "next";
import Link from "next/link";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import ChamadaFinal from "@/components/blocos/ChamadaFinal";
import Perguntas from "@/components/blocos/Perguntas";
import Revelar from "@/components/sistema/Revelar";
import { Envelope, Rotulo, Destaque } from "@/components/sistema/primitivos";
import LinhaDoTempo from "@/components/sobre/LinhaDoTempo";
import MuralClientes from "@/components/sobre/MuralClientes";
import { visiveis } from "@/lib/visibilidade";
import { provasDeAgora, site } from "@/conteudo/site";
import {
  metadados,
  DadosEstruturados,
  grafo,
  pagina,
  trilha,
  perguntas,
} from "@/lib/seo";

/**
 * Reconstrói uma vez por dia.
 *
 * A página mostra os anos de operação, que viram sozinhos em março.
 * Estática para sempre, o número ficaria preso na data da compilação e
 * só mudaria numa nova publicação.
 */
export const revalidate = 86400;

export const metadata: Metadata = metadados({
  titulo: "Sobre a CORZ: especialistas em infraestrutura crítica",
  descricao:
    "Desde 2012, em Pelotas/RS, a CORZ cuida da TI de quem não pode parar. Conheça o posicionamento, a cultura e a história de quem responde pela continuidade de grandes redes do Sul do Brasil.",
  caminho: "/sobre",
});

const CULTURA = [
  {
    letra: "C",
    nome: "Confiança",
    texto:
      "Cumprimos o que prometemos e dizemos quando não dá. Cliente que confia de olhos fechados é resultado de anos, não de discurso.",
  },
  {
    letra: "O",
    nome: "Organização",
    texto:
      "Processo claro, documentação viva e monitoramento constante. Operação crítica não sobrevive de improviso nem de memória.",
  },
  {
    letra: "R",
    nome: "Respeito",
    texto:
      "Consultoria transparente. O tempo e os recursos da empresa do cliente são inegociáveis. Nada é feito sem aprovação.",
  },
  {
    letra: "Z",
    nome: "Zelo",
    texto:
      "Cuidado no detalhe que ninguém vê. É o zelo que separa a rede que aguenta o sábado de pico da rede que só aguenta o dia calmo.",
  },
];

const FAQ = [
  {
    pergunta: "Desde quando a CORZ existe?",
    resposta: `A CORZ opera desde ${site.fundacao}, com sede em ${site.cidade}/${site.uf}. São 14 anos cuidando da infraestrutura de empresas cuja operação não pode parar.`,
  },
  {
    pergunta: "Onde fica a CORZ e até onde ela atende?",
    resposta: `A sede fica na ${site.endereco.logradouro}, ${site.endereco.bairro}, em ${site.endereco.cidade}/${site.endereco.uf}. O atendimento técnico é remoto, com cobertura nacional, e há atendimento presencial em toda a metade sul do Rio Grande do Sul.`,
  },
  {
    pergunta: "O que significa CORZ?",
    resposta:
      "Confiança, Organização, Respeito e Zelo. São os quatro princípios que definem como a empresa trabalha, e o critério com que contratamos, decidimos e respondemos quando algo dá errado.",
  },
  {
    pergunta: "Qual o diferencial da CORZ em relação a outras empresas de TI?",
    resposta:
      "A CORZ não vende tecnologia; responde por continuidade. Isso muda o contrato: em vez de fornecer equipamento ou hora técnica, assumimos o compromisso de que a operação continue funcionando, e o dado de disponibilidade fica visível para a liderança do cliente.",
  },
];

export default function PaginaSobre() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Sobre a CORZ",
            descricao:
              "História, posicionamento e cultura da CORZ Tecnologia, especialista em continuidade operacional.",
            caminho: "/sobre",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Sobre", caminho: "/sobre" },
          ]),
          perguntas(FAQ)
        )}
      />

      <CabecalhoPagina
        rotulo="Quem somos"
        titulo="Desde 2012, cuidando da TI"
        destaque="de quem não pode parar."
        texto="A CORZ não é uma empresa de TI, de internet, de telecom nem de equipamentos. É uma empresa especializada em continuidade operacional, através de redes corporativas, conectividade, cibersegurança e escalabilidade."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Sobre", caminho: "/sobre" },
        ]}
        aside={
          <dl className="grid grid-cols-2 gap-3">
            {provasDeAgora().map((p) => (
              <div
                key={p.rotulo}
                className="rounded-[var(--radius-bloco)] border border-branco/10 bg-branco/[0.03] p-6"
              >
                <dt className="sr-only">{p.rotulo}</dt>
                <dd>
                  <span className="font-wide text-[1.875rem] font-bold leading-none tracking-[-0.03em] tabular-nums">
                    {"prefixo" in p ? p.prefixo : ""}
                    {p.valor}
                    <span className="text-ciano">{p.sufixo}</span>
                  </span>
                  <span className="mt-2.5 block text-[0.8125rem] leading-snug text-branco/55">
                    {p.rotulo}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        }
      />

      {/* Manifesto */}
      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-28">
        <Envelope>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Revelar>
                <span
                  aria-hidden
                  className="block h-[3px] w-16 rounded-full bg-[#1D4FD8]"
                />
              </Revelar>
            </div>
            <div className="lg:col-span-8">
              <Revelar>
                <p className="font-display text-[clamp(1.5rem,3.4vw,2.5rem)] font-bold leading-[1.14] tracking-[-0.036em] text-tinta-900">
                  A maioria das empresas investe em crescimento. Poucas investem
                  em <Destaque>sustentação.</Destaque>
                </p>
              </Revelar>
              <Revelar atraso={100}>
                <div className="mt-8 max-w-[62ch] space-y-5 text-[1.0625rem] leading-[1.7] text-tinta-900/70">
                  <p>
                    Mais clientes. Mais vendedores. Mais unidades. Mais
                    faturamento. É assim que as decisões são tomadas, e está
                    certo. O que quase ninguém pergunta na mesma reunião é se a
                    infraestrutura suporta tudo isso.
                  </p>
                  <p>
                    A consequência aparece depois. E, quando aparece, aparece da
                    pior forma possível: no sábado de pico, no fechamento do
                    mês, na véspera do feriado. Nunca em um dia calmo.
                  </p>
                  <p className="font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.025em] text-tinta-900">
                    Empresas maduras se preparam para falhas. É exatamente isso
                    que a CORZ entrega.
                  </p>
                </div>
              </Revelar>
            </div>
          </div>
        </Envelope>
      </section>

      {/* Linha do tempo */}
      <section className="sup-escura relative overflow-hidden bg-tinta-950 py-20 text-branco sm:py-28">
                <Envelope className="relative">
          <Revelar>
            <h2 className="max-w-[20ch] font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.038em]">
              Catorze anos de operação contínua.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[1.0625rem] leading-[1.62] text-branco/55">
              Cada etapa nasceu de um problema que apareceu na operação de um
              cliente antes de virar serviço no catálogo.
            </p>
          </Revelar>

          <LinhaDoTempo />
        </Envelope>
      </section>

      {/* Cultura */}
      <section className="bg-papel-000 py-20 sm:py-28">
        <Envelope>
          <Revelar>
            <Rotulo cor="petroleo">Cultura</Rotulo>
            <h2 className="mt-6 max-w-[22ch] font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.038em] text-tinta-900">
              Quatro letras que definem como trabalhamos.
            </h2>
          </Revelar>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CULTURA.map((valor, i) => (
              <Revelar
                key={valor.letra}
                atraso={i * 70}
                className="rounded-[var(--radius-bloco)] border border-petroleo/12 bg-papel-050 p-8 transition-colors duration-300 hover:border-petroleo/25 hover:bg-papel-000"
              >
                <span className="font-display text-[3.5rem] font-bold leading-none tracking-[-0.05em] text-petroleo/15">
                  {valor.letra}
                </span>
                <h3 className="mt-4 font-display text-[1.25rem] font-bold tracking-[-0.028em] text-tinta-900">
                  {valor.nome}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-[1.62] text-tinta-900/65">
                  {valor.texto}
                </p>
              </Revelar>
            ))}
          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-3">
            {visiveis([
              {
                href: "/sobre/equipe",
                titulo: "Nosso time",
                texto: "Quem responde quando a operação para.",
              },
              {
                href: "/sobre/carreiras",
                titulo: "Trabalhe conosco",
                texto: "Crescer com propósito, resolvendo problema real.",
              },
              {
                href: "/sobre/imprensa",
                titulo: "CORZ na mídia",
                texto: "Material de imprensa, marca e contato para jornalistas.",
              },
              {
                href: "/solucoes",
                titulo: "O que a CORZ pratica",
                texto: "As quatro frentes que sustentam a operação inteira.",
              },
              {
                href: "/suporte",
                titulo: "Suporte",
                texto: "Primeira resposta em até 3 minutos, para todo cliente.",
              },
            ]).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-cursor="acao"
                className="group rounded-[var(--radius-bloco)] border border-petroleo/12 bg-papel-000 p-7 transition-all duration-400 ease-[var(--ease-corz)] hover:-translate-y-1 hover:border-tinta-950 hover:bg-tinta-950"
              >
                <h3 className="font-display text-[1.125rem] font-semibold tracking-[-0.025em] text-tinta-900 transition-colors duration-300 group-hover:text-branco">
                  {item.titulo}
                </h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-tinta-900/60 transition-colors duration-300 group-hover:text-branco/55">
                  {item.texto}
                </p>
              </Link>
            ))}
          </div>
        </Envelope>
      </section>

      {/* Clientes.
          Faixa clara: as marcas entram em cor cheia, como são. A fita
          corre sozinha porque são quinze — em grade viravam parede de
          logotipo, e ninguém lê uma parede de logotipo. */}
      <section className="border-t border-petroleo/12 bg-papel-050 py-16">
        <Envelope>
          <Rotulo cor="petroleo">Quem confia a operação à CORZ</Rotulo>
        </Envelope>
        {/* Fora do Envelope de propósito: a fita atravessa a largura
            inteira, senão ela para nas margens e deixa de parecer que
            continua. */}
        <div className="mt-8">
          <MuralClientes />
        </div>
      </section>

      <Perguntas itens={FAQ} titulo="Sobre a CORZ" />

      <ChamadaFinal
        titulo="Converse com quem vai responder"
        destaque="pela sua operação."
        texto="Sem intermediário e sem script. A conversa começa pelo entendimento do que a sua operação não pode perder."
      />
    </>
  );
}
