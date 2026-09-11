"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiAdmin } from "@/lib/cliente";

/**
 * Arquivar, não excluir. Nada some do banco; o artigo apenas sai do ar
 * e o endereço continua respondendo para quem já tinha o link.
 * A confirmação é feita por um segundo clique, não por window.confirm —
 * diálogos nativos travam o restante da página.
 */
export default function BotaoArquivar({ id }: { id: string }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [processando, setProcessando] = useState(false);

  async function arquivar() {
    setProcessando(true);
    const { ok } = await apiAdmin(`/api/admin/artigos?id=${id}`, {
      metodo: "DELETE",
    });
    setProcessando(false);
    if (ok) {
      router.push("/admin/artigos");
      router.refresh();
    }
  }

  if (!confirmando) {
    return (
      <button
        type="button"
        onClick={() => setConfirmando(true)}
        className="rounded-[10px] border border-petroleo/20 px-4 py-2.5 text-[0.8125rem] font-medium text-tinta-900/70 transition-colors hover:border-negativo hover:text-negativo"
      >
        Arquivar
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-[10px] border border-negativo/40 bg-negativo/[0.05] px-4 py-2">
      <span className="text-[0.8125rem] text-tinta-900/75">
        Tirar do ar?
      </span>
      <button
        type="button"
        onClick={arquivar}
        disabled={processando}
        className="text-[0.8125rem] font-semibold text-negativo disabled:opacity-50"
      >
        {processando ? "Arquivando…" : "Sim, arquivar"}
      </button>
      <button
        type="button"
        onClick={() => setConfirmando(false)}
        className="text-[0.8125rem] text-tinta-900/50"
      >
        Cancelar
      </button>
    </div>
  );
}
