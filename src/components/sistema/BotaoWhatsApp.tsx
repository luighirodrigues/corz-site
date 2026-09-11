"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { site } from "@/conteudo/site";

/**
 * Atalho de WhatsApp.
 *
 * Entra em cena depois da primeira dobra: um botão flutuante sobre o
 * herói rouba a atenção do argumento principal e é um dos gestos que
 * mais denunciam template.
 *
 * E sai de cena no fim da página. Ali embaixo o botão fica exatamente
 * sobre a assinatura da Manche, e um crédito de autoria coberto por um
 * botão flutuante é o mesmo que crédito nenhum. Quem chegou ao rodapé
 * já passou por três chamadas para conversar; o atalho ter cumprido seu
 * papel é motivo para ceder o canto, não para insistir.
 */

/** Altura, em pixels, da faixa final onde o botão dá lugar ao crédito. */
const FAIXA_FINAL = 150;

export default function BotaoWhatsApp() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoRolar = () => {
      const passouDaDobra = window.scrollY > window.innerHeight * 0.75;
      const restante =
        document.documentElement.scrollHeight -
        (window.scrollY + window.innerHeight);
      setVisivel(passouDaDobra && restante > FAIXA_FINAL);
    };
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  return (
    <a
      href={site.whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="externo"
      aria-label="Fale com a CORZ no WhatsApp"
      className={clsx(
        "fixed bottom-5 right-5 z-[95] flex items-center gap-2.5",
        "rounded-[10px] border border-branco/15 bg-tinta-900 py-3 pl-3.5 pr-4",
        "text-[0.8125rem] font-semibold text-branco",
        "transition-all duration-500 ease-[var(--ease-corz)]",
        "hover:border-positivo/60 hover:bg-tinta-850",
        visivel
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      )}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4 text-positivo" fill="currentColor">
        <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.86 9.86 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.44 9.9-9.9 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.39c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.69 8.24-8.24 8.24Zm4.52-6.17c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.14.17-.24.25-.41.09-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42-.14 0-.3-.02-.46-.02-.16 0-.43.06-.65.3-.22.25-.85.84-.85 2.03 0 1.2.87 2.35.99 2.51.12.16 1.71 2.61 4.14 3.66.58.25 1.03.4 1.38.51.58.19 1.11.16 1.53.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.22-.16-.47-.28Z" />
      </svg>
      Fale com a CORZ
    </a>
  );
}
