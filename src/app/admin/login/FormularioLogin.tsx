"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

export default function FormularioLogin({ proximo }: { proximo?: string }) {
  const router = useRouter();
  const [estado, setEstado] = useState<"inicial" | "enviando">("inicial");
  const [precisa2fa, setPrecisa2fa] = useState(false);
  const [erro, setErro] = useState("");

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEstado("enviando");
    setErro("");

    const dados = Object.fromEntries(
      new FormData(evento.currentTarget).entries()
    );

    try {
      const resposta = await fetch("/api/admin/sessao", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const json = await resposta.json();

      if (json.ok) {
        const destino =
          proximo && proximo.startsWith("/admin") ? proximo : "/admin";
        router.replace(destino);
        router.refresh();
        return;
      }

      if (json.precisa2fa) {
        setPrecisa2fa(true);
        setErro(json.erro ?? "");
        setEstado("inicial");
        return;
      }

      setErro(json.erro ?? "Não foi possível entrar.");
      setEstado("inicial");
    } catch {
      setErro("Falha de conexão com o servidor.");
      setEstado("inicial");
    }
  }

  const campo =
    "mt-2 w-full rounded-[10px] border border-branco/15 bg-tinta-950 px-4 py-3 text-[0.9375rem] text-branco outline-none transition-colors duration-200 placeholder:text-branco/25 focus:border-ciano";

  return (
    <form onSubmit={aoEnviar} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="rotulo text-branco/45">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          autoFocus={!precisa2fa}
          readOnly={precisa2fa}
          className={clsx(campo, precisa2fa && "opacity-50")}
        />
      </div>

      <div>
        <label htmlFor="senha" className="rotulo text-branco/45">
          Senha
        </label>
        <input
          id="senha"
          name="senha"
          type="password"
          required
          autoComplete="current-password"
          readOnly={precisa2fa}
          className={clsx(campo, precisa2fa && "opacity-50")}
        />
      </div>

      {precisa2fa && (
        <div>
          <label htmlFor="codigo" className="rotulo text-ciano">
            Código de verificação
          </label>
          <input
            id="codigo"
            name="codigo"
            inputMode="text"
            autoComplete="one-time-code"
            autoFocus
            placeholder="000000"
            className={clsx(campo, "font-mono tracking-[0.4em]")}
          />
          <p className="mt-2 text-[0.75rem] leading-relaxed text-branco/40">
            Use o código de 6 dígitos do seu aplicativo autenticador ou um dos
            códigos de recuperação.
          </p>
        </div>
      )}

      {erro && (
        <p
          role="alert"
          className="rounded-[10px] border border-negativo/40 bg-negativo/10 px-4 py-3 text-[0.8125rem] text-negativo"
        >
          {erro}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        data-cursor="acao"
        className="w-full rounded-[10px] bg-[#1D4FD8] px-6 py-3.5 text-[0.9375rem] font-semibold text-branco transition-colors duration-300 hover:bg-[#153bab] disabled:opacity-50"
      >
        {estado === "enviando"
          ? "Verificando…"
          : precisa2fa
            ? "Confirmar código"
            : "Entrar"}
      </button>
    </form>
  );
}
