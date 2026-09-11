import type { Metadata } from "next";
import Link from "next/link";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import Perguntas from "@/components/blocos/Perguntas";
import Revelar from "@/components/sistema/Revelar";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import { site } from "@/conteudo/site";
import { grupos } from "@/conteudo/faq";
import {
  metadados,
  DadosEstruturados,
  grafo,
  pagina,
  trilha,
  perguntas,
} from "@/lib/seo";

export const metadata: Metadata = metadados({
  titulo: "Suporte técnico",
  descricao:
    "Suporte humano da CORZ com primeira resposta em até 3 minutos para qualquer cliente, 24 horas por dia. Abra chamado, consulte o SLA ou fale no WhatsApp.",
  caminho: "/suporte",
});

const FAQ = grupos.find((g) => g.slug === "suporte-e-sla")!.itens;

/**
 * Tipos de chamado.
 *
 * Isto não é fila de prioridade nem escalonamento por porte de contrato.
 * Todo cliente da CORZ tem prioridade. O que a classificação faz é
 * dizer ao time o que está acontecendo do outro lado, para que a pessoa
 * certa já entre na conversa com o contexto certo desde o primeiro
 * minuto. Todos começam pela mesma promessa de primeira resposta.
 */
const TIPOS = [
  {
    nome: "Operação parada",
    cor: "#E20D50",
    definicao:
      "A unidade não opera. Sistema fora do ar, faturamento interrompido, equipe sem conseguir trabalhar.",
    acao: "Time técnico acionado na mesma hora, com a operadora ou o fornecedor chamado em paralelo.",
    canal: "WhatsApp ou telefone",
  },
  {
    nome: "Operação degradada",
    cor: "#EBAD28",
    definicao:
      "A operação continua, mas com lentidão, instabilidade ou alguma função indisponível.",
    acao: "Diagnóstico começa imediatamente, com o histórico da sua unidade já na tela de quem atende.",
    canal: "WhatsApp ou formulário",
  },
  {
    nome: "Solicitação planejada",
    cor: "#00ADE7",
    definicao:
      "Mudança agendada, dúvida técnica, liberação de acesso ou pedido de relatório.",
    acao: "Entra na agenda com data combinada, sem atropelar nada que já esteja em andamento.",
    canal: "Formulário",
  },
];

export default function PaginaSuporte() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Suporte CORZ",
            descricao:
              "Canais de suporte, níveis de criticidade e prazos de atendimento da CORZ.",
            caminho: "/suporte",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Suporte", caminho: "/suporte" },
          ]),
          perguntas(FAQ)
        )}
      />

      <CabecalhoPagina
        rotulo="Suporte"
        titulo="Suporte humano,"
        destaque="rápido e resolutivo."
        texto="Primeira resposta em até 3 minutos, com gente que conhece a sua operação. Sem robô genérico, sem repetir o problema para três atendentes diferentes."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Suporte", caminho: "/suporte" },
        ]}
        aside={
          <div className="space-y-3">
            <Link
              href="/suporte/abrir-chamado"
              data-cursor="acao"
              className="group flex items-center justify-between gap-4 rounded-[10px] bg-branco px-6 py-5 text-tinta-950 transition-colors duration-300 hover:bg-ciano"
            >
              <span>
                <span className="block font-display text-[1.0625rem] font-semibold tracking-[-0.025em]">
                  Abrir chamado
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-tinta-950/60">
                  Resposta em até 3 minutos
                </span>
              </span>
              <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1">
                <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
              </svg>
            </Link>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="externo"
              className="flex items-center justify-between gap-4 rounded-[10px] border border-branco/22 px-6 py-5 transition-colors duration-300 hover:border-positivo"
            >
              <span>
                <span className="block font-display text-[1.0625rem] font-semibold tracking-[-0.025em]">
                  WhatsApp de suporte
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-branco/50">
                  Para operação parada agora
                </span>
              </span>
              <span className="text-[0.8125rem] font-medium text-branco/50">
                {site.telefone}
              </span>
            </a>
          </div>
        }
      />

      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <Revelar>
            <h2 className="max-w-[26ch] font-display text-[clamp(1.625rem,3.2vw,2.5rem)] font-bold leading-[1.06] tracking-[-0.036em] text-tinta-900">
              Aqui todo cliente tem prioridade.
            </h2>
            <p className="mt-6 max-w-[58ch] text-[1.0625rem] leading-[1.66] text-tinta-900/68">
              Não existe fila preferencial na CORZ, nem atendimento melhor para
              quem paga mais. A promessa de primeira resposta em até 3 minutos
              vale para todo mundo. Dizer o que está acontecendo na abertura
              serve para uma coisa só: colocar a pessoa certa na conversa já no
              primeiro minuto.
            </p>
          </Revelar>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {TIPOS.map((tipo, i) => (
              <Revelar
                key={tipo.nome}
                atraso={i * 70}
                className="relative overflow-hidden rounded-[var(--radius-bloco)] border border-petroleo/12 bg-papel-050 p-8 transition-colors duration-400 hover:border-petroleo/25 hover:bg-papel-000"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: tipo.cor }}
                />
                <h3 className="font-display text-[1.25rem] font-bold tracking-[-0.028em] text-tinta-900">
                  {tipo.nome}
                </h3>
                <p className="mt-3 text-[0.9375rem] leading-[1.62] text-tinta-900/65">
                  {tipo.definicao}
                </p>
                <p className="mt-5 flex items-start gap-3 border-t border-petroleo/12 pt-5 text-[0.9375rem] leading-relaxed text-tinta-900/78">
                  <span
                    aria-hidden
                    className="mt-[0.55rem] h-[3px] w-4 shrink-0 rounded-full"
                    style={{ background: tipo.cor }}
                  />
                  {tipo.acao}
                </p>
                <p className="mt-4 text-[0.8125rem] text-tinta-900/45">
                  Canal indicado: {tipo.canal}
                </p>
              </Revelar>
            ))}
          </div>

          <Revelar atraso={260}>
            <div className="mt-10 flex flex-col gap-4 rounded-[10px] border border-petroleo/14 bg-papel-050 p-7 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-tinta-900/70">
                Ainda não é cliente e a operação está parada? Podemos avaliar o
                cenário mesmo assim. O diagnóstico emergencial não exige
                contrato.
              </p>
              <Link
                href="/contato"
                data-cursor="acao"
                className="shrink-0 rounded-[10px] bg-[#1D4FD8] px-6 py-3.5 text-[0.9375rem] font-semibold text-branco transition-colors hover:bg-[#153bab]"
              >
                Fale com a CORZ
              </Link>
            </div>
          </Revelar>
        </Envelope>
      </section>

      <Perguntas itens={FAQ} titulo="Suporte e SLA" escuro />

      <section className="border-t border-petroleo/12 bg-papel-000 py-16">
        <Envelope>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Rotulo cor="petroleo">Base de conhecimento</Rotulo>
              <p className="mt-4 max-w-[48ch] text-[1rem] leading-relaxed text-tinta-900/70">
                Todas as perguntas frequentes sobre contratos, prazos de
                atendimento, cibersegurança e LGPD reunidas em um só lugar.
              </p>
            </div>
            <Link
              href="/suporte/faq"
              data-cursor="acao"
              className="group inline-flex shrink-0 items-center gap-2.5 text-[0.9375rem] font-semibold text-[#1D4FD8]"
            >
              Ver todas as perguntas
              <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
              </svg>
            </Link>
          </div>
        </Envelope>
      </section>
    </>
  );
}
