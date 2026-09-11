import Link from "next/link";
import { Envelope } from "@/components/sistema/primitivos";
import Revelar from "@/components/sistema/Revelar";
import { site } from "@/conteudo/site";

/**
 * Faixa de contato comercial.
 *
 * Aparece no meio das páginas de solução, não só no fim. Quem se
 * reconhece no problema descrito logo acima costuma querer falar
 * naquele momento, e obrigar a pessoa a rolar até o rodapé para achar
 * um botão custa conversa.
 *
 * Dois caminhos, porque as pessoas escolhem diferente: formulário para
 * quem prefere escrever com calma, WhatsApp para quem quer resposta
 * agora.
 */
export default function FaixaComercial({
  titulo,
  texto,
  cor = "#00ADE7",
  botao = "Falar com o time comercial",
  href = "/contato",
}: {
  titulo: string;
  texto: string;
  cor?: string;
  botao?: string;
  href?: string;
}) {
  return (
    <section className="border-y border-petroleo/12 bg-papel-050 py-12 sm:py-14">
      <Envelope>
        <Revelar>
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="flex items-start gap-5">
              <span
                aria-hidden
                className="mt-1 hidden h-10 w-[3px] shrink-0 rounded-full sm:block"
                style={{ background: cor }}
              />
              <div>
                <p className="font-display text-[clamp(1.25rem,2.4vw,1.75rem)] font-bold leading-[1.14] tracking-[-0.03em] text-tinta-900">
                  {titulo}
                </p>
                <p className="mt-2.5 max-w-[56ch] text-[0.9375rem] leading-relaxed text-tinta-900/62">
                  {texto}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href={href}
                data-cursor="acao"
                className="group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] bg-[#1D4FD8] px-6 py-3.5 text-[0.9375rem] font-semibold text-branco transition-colors duration-300 hover:bg-[#153bab]"
              >
                {botao}
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                </svg>
              </Link>
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="externo"
                className="inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] border border-petroleo/25 px-6 py-3.5 text-[0.9375rem] font-semibold text-petroleo transition-colors duration-300 hover:border-petroleo hover:bg-petroleo hover:text-branco"
              >
                <svg viewBox="0 0 24 24" aria-hidden className="h-4 w-4" fill="currentColor">
                  <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.24h.01c5.5 0 9.96-4.46 9.96-9.96 0-2.66-1.04-5.16-2.92-7.04A9.9 9.9 0 0 0 12.04 2Zm5.83 14.06c-.25.7-1.44 1.33-2 1.42-.51.08-1.16.11-1.87-.12-.43-.14-.98-.32-1.69-.63-2.97-1.28-4.9-4.27-5.05-4.47-.15-.2-1.21-1.6-1.21-3.06 0-1.45.76-2.17 1.03-2.46.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.51.25.6.85 2.06.92 2.21.08.15.13.33.02.53-.1.2-.15.32-.3.5-.15.17-.32.39-.45.52-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.47.13.64-.08.17-.2.74-.86.94-1.16.2-.3.4-.25.67-.15.27.1 1.72.81 2.01.96.3.15.5.22.57.35.07.12.07.72-.18 1.42Z" />
                </svg>
                Fale com a CORZ
              </a>
            </div>
          </div>
        </Revelar>
      </Envelope>
    </section>
  );
}
