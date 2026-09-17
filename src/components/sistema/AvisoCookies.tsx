"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import { COOKIE_CONSENTIMENTO, temMedicao } from "@/lib/medicao";

/**
 * Aviso de cookies.
 *
 * A maioria destas faixas é teatro: aparece, tem um botão "aceitar" e
 * as tags já estavam carregadas antes de alguém clicar. Aqui a ordem é
 * a inversa — `Medicao` não renderiza script nenhum enquanto o cookie
 * não disser "aceito", e "Recusar" grava a recusa em vez de só fechar
 * a faixa. Por isso os dois botões têm o mesmo peso visual: quando a
 * escolha é real, esconder uma das opções é que seria desonesto.
 *
 * A faixa só existe se houver alguma medição configurada. Site sem
 * ferramenta de terceiro não usa cookie que peça consentimento — os de
 * sessão do painel são estritamente necessários e dispensam aviso — e
 * mostrar a faixa mesmo assim seria pedir permissão para nada.
 *
 * Entra depois de um instante, e não no primeiro quadro: uma faixa que
 * aparece junto com o conteúdo compete com a primeira dobra e é lida
 * como anúncio.
 */

const EVENTO = "corz:consentimento";
/** Seis meses. Depois disso a escolha é perguntada de novo. */
const VALIDADE = 60 * 60 * 24 * 180;

function gravar(valor: "aceito" | "recusado") {
  const seguro = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${COOKIE_CONSENTIMENTO}=${valor}; Max-Age=${VALIDADE}; Path=/; SameSite=Lax${seguro}`;
  window.dispatchEvent(new Event(EVENTO));
}

export default function AvisoCookies() {
  const [visivel, setVisivel] = useState(false);
  const [entrou, setEntrou] = useState(false);

  useEffect(() => {
    if (!temMedicao) return;
    const jaEscolheu = document.cookie
      .split("; ")
      .some((c) => c.startsWith(`${COOKIE_CONSENTIMENTO}=`));
    if (jaEscolheu) return;

    setVisivel(true);
    const t = window.setTimeout(() => setEntrou(true), 900);
    return () => window.clearTimeout(t);
  }, []);

  if (!visivel) return null;

  const decidir = (valor: "aceito" | "recusado") => {
    gravar(valor);
    setEntrou(false);
    window.setTimeout(() => setVisivel(false), 420);
  };

  return (
    <div
      role="dialog"
      aria-label="Preferências de cookies"
      className={clsx(
        // Acima da bruma inferior e do botão de WhatsApp: enquanto a
        // escolha não é feita, ela é a coisa mais importante da tela.
        "fixed inset-x-3 bottom-3 z-[110] sm:inset-x-auto sm:bottom-5 sm:left-5 sm:max-w-[26rem]",
        "rounded-[var(--radius-bloco)] border border-branco/12 bg-tinta-950 p-5 text-branco sm:p-6",
        "transition-all duration-500 ease-[var(--ease-corz)]",
        entrou
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      )}
    >
      <p className="text-[0.9375rem] font-semibold">
        Cookies de medição
      </p>
      <p className="mt-2.5 text-[0.875rem] leading-[1.6] text-branco/60">
        Usamos cookies para entender como as pessoas chegam ao site e o que
        procuram aqui. Nada é carregado antes de você decidir, e recusar não
        muda nada no funcionamento.{" "}
        <Link
          href="/legal/cookies"
          className="font-medium text-ciano underline underline-offset-2 hover:text-branco"
        >
          Como usamos
        </Link>
        .
      </p>
      <div className="mt-4 flex gap-2.5">
        <button
          type="button"
          onClick={() => decidir("aceito")}
          data-cursor="acao"
          className="flex-1 whitespace-nowrap rounded-[10px] bg-branco px-4 py-2.5 text-[0.875rem] font-semibold text-tinta-950 transition-colors duration-300 hover:bg-ciano"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => decidir("recusado")}
          data-cursor="acao"
          className="flex-1 whitespace-nowrap rounded-[10px] border border-branco/22 px-4 py-2.5 text-[0.875rem] font-semibold text-branco transition-colors duration-300 hover:border-branco"
        >
          Recusar
        </button>
      </div>
    </div>
  );
}
