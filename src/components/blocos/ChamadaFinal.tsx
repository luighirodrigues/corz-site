import Link from "next/link";
import { Destaque, Envelope, Rotulo } from "@/components/sistema/primitivos";
import Revelar from "@/components/sistema/Revelar";
import { site } from "@/conteudo/site";

export default function ChamadaFinal({
  rotulo = "Próximo passo",
  titulo,
  destaque,
  texto,
  botao = "Solicitar diagnóstico gratuito",
  href = "/contato",
}: {
  rotulo?: string;
  titulo: string;
  destaque?: string;
  texto: string;
  botao?: string;
  href?: string;
}) {
  return (
    <section className="sup-escura relative overflow-hidden bg-tinta-950 text-branco">
      <div aria-hidden className="absolute inset-0">
                <div
          className="absolute left-1/2 top-full h-[36rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at center, #2C3191 0%, transparent 66%)",
          }}
        />
      </div>
      <Envelope className="relative py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-8">
            <Revelar>
              <Rotulo cor="ciano">{rotulo}</Rotulo>
            </Revelar>
            <Revelar atraso={80}>
              <h2 className="mt-6 max-w-[20ch] font-display text-[clamp(2rem,4.6vw,3.5rem)] font-bold leading-[1.02] tracking-[-0.04em]">
                {titulo}{" "}
                {destaque && <Destaque>{destaque}</Destaque>}
              </h2>
            </Revelar>
            <Revelar atraso={140}>
              <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.62] text-branco/58">
                {texto}
              </p>
            </Revelar>
          </div>

          <Revelar atraso={200} className="lg:col-span-4">
            <div className="flex flex-col gap-3">
              <Link
                href={href}
                data-cursor="acao"
                className="group inline-flex items-center justify-between gap-4 whitespace-nowrap rounded-[10px] bg-branco px-6 py-4.5 text-[0.9375rem] font-semibold text-tinta-950 transition-colors duration-300 hover:bg-ciano"
              >
                {botao}
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                </svg>
              </Link>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="externo"
                /* `flex-wrap` em vez de um ponto de quebra fixo: os
                   dois pedaços ficam lado a lado quando há largura para
                   ambos inteiros e caem um sob o outro quando não há —
                   e isso vale para qualquer largura, não só para as que
                   alguém lembrou de testar. A coluna aqui é estreita
                   tanto no celular quanto em 1024px, onde a grade já
                   virou de quatro colunas e a janela ainda é curta.
                   Espremidos, o número quebrava no meio, e telefone
                   partido em duas linhas deixa de ser telefone. */
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-[10px] border border-branco/22 px-6 py-4.5 text-[0.9375rem] font-semibold text-branco transition-colors duration-300 hover:border-branco"
              >
                <span className="whitespace-nowrap">
                  Fale com a CORZ no WhatsApp
                </span>
                <span className="whitespace-nowrap text-[0.8125rem] font-medium text-branco/50">
                  {site.telefone}
                </span>
              </a>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-branco/38">
                Sem compromisso. O diagnóstico devolve o mapa de disponibilidade
                e de custo real da sua operação, mesmo que você não contrate
                nada.
              </p>
            </div>
          </Revelar>
        </div>
      </Envelope>
    </section>
  );
}
