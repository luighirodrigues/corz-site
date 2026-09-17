"use client";

import { useState, type FormEvent } from "react";
import { apiAdmin } from "@/lib/cliente";
import { clsx } from "clsx";

export default function FormularioTrocaSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);

  async function aoSalvar(e: FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setMensagem(null);

    const { ok, dados } = await apiAdmin("/api/admin/senha", {
      metodo: "POST",
      corpo: { senhaAtual, novaSenha, confirmarSenha },
    });

    setSalvando(false);

    if (!ok) {
      setMensagem({
        tipo: "erro",
        texto: (dados.erro as string) ?? "Não foi possível alterar a senha.",
      });
      return;
    }

    setMensagem({
      tipo: "ok",
      texto: (dados.mensagem as string) ?? "Senha alterada com sucesso!",
    });
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  }

  const campo =
    "mt-2 w-full rounded-[10px] border border-petroleo/18 bg-branco px-4 py-2.5 text-[0.9375rem] text-tinta-900 outline-none focus:border-[#1D4FD8]";

  return (
    <section className="rounded-[10px] border border-petroleo/14 bg-branco p-6">
      <header className="border-b border-petroleo/12 pb-4">
        <h2 className="rotulo text-petroleo/55">Alterar senha</h2>
        <p className="mt-1 text-[0.8125rem] text-tinta-900/50">
          Recomendamos usar pelo menos 10 caracteres misturando letras, números e símbolos.
        </p>
      </header>

      <form onSubmit={aoSalvar} className="mt-5 max-w-md space-y-4">
        <div>
          <label htmlFor="senhaAtual" className="rotulo text-petroleo/50">
            Senha atual
          </label>
          <input
            id="senhaAtual"
            type="password"
            required
            value={senhaAtual}
            onChange={(e) => setSenhaAtual(e.target.value)}
            className={campo}
            autoComplete="current-password"
          />
        </div>

        <div>
          <label htmlFor="novaSenha" className="rotulo text-petroleo/50">
            Nova senha (mínimo 10 caracteres)
          </label>
          <input
            id="novaSenha"
            type="password"
            required
            minLength={10}
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            className={campo}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label htmlFor="confirmarSenha" className="rotulo text-petroleo/50">
            Confirmar nova senha
          </label>
          <input
            id="confirmarSenha"
            type="password"
            required
            minLength={10}
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            className={campo}
            autoComplete="new-password"
          />
        </div>

        {mensagem && (
          <p
            role="status"
            className={clsx(
              "rounded-[10px] px-4 py-3 text-[0.8125rem]",
              mensagem.tipo === "ok"
                ? "border border-positivo/40 bg-positivo/10 text-tinta-900"
                : "border border-negativo/40 bg-negativo/[0.06] text-negativo"
            )}
          >
            {mensagem.texto}
          </p>
        )}

        <button
          type="submit"
          disabled={salvando || !senhaAtual || !novaSenha || !confirmarSenha}
          className="rounded-[10px] bg-[#1D4FD8] px-6 py-2.5 text-[0.875rem] font-semibold text-branco transition-colors hover:bg-[#153bab] disabled:opacity-50"
        >
          {salvando ? "Alterando…" : "Atualizar senha"}
        </button>
      </form>
    </section>
  );
}
