"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiAdmin } from "@/lib/cliente";

type Etapa = "parado" | "qr" | "codigos" | "desativar";

export default function PainelDoisFatores({
  ativoInicial,
  codigosRestantes,
}: {
  ativoInicial: boolean;
  codigosRestantes: number;
}) {
  const router = useRouter();
  const [ativo, setAtivo] = useState(ativoInicial);
  const [etapa, setEtapa] = useState<Etapa>("parado");
  const [qr, setQr] = useState("");
  const [segredo, setSegredo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [codigos, setCodigos] = useState<string[]>([]);
  const [erro, setErro] = useState("");
  const [ocupado, setOcupado] = useState(false);

  async function iniciar() {
    setOcupado(true);
    setErro("");
    const { ok, dados } = await apiAdmin("/api/admin/2fa", {
      corpo: { acao: "iniciar" },
    });
    setOcupado(false);
    if (!ok) return setErro((dados.erro as string) ?? "Falha ao iniciar.");
    setQr(dados.qr as string);
    setSegredo(dados.segredo as string);
    setEtapa("qr");
  }

  async function confirmar() {
    setOcupado(true);
    setErro("");
    const { ok, dados } = await apiAdmin("/api/admin/2fa", {
      corpo: { acao: "confirmar", codigo },
    });
    setOcupado(false);
    if (!ok) return setErro((dados.erro as string) ?? "Código incorreto.");
    setCodigos(dados.codigos as string[]);
    setAtivo(true);
    setEtapa("codigos");
    router.refresh();
  }

  async function desativar() {
    setOcupado(true);
    setErro("");
    const { ok, dados } = await apiAdmin("/api/admin/2fa", {
      corpo: { acao: "desativar", senha },
    });
    setOcupado(false);
    if (!ok) return setErro((dados.erro as string) ?? "Senha incorreta.");
    setAtivo(false);
    setEtapa("parado");
    setSenha("");
    router.refresh();
  }

  const campo =
    "mt-2 w-full rounded-[10px] border border-petroleo/18 bg-branco px-4 py-2.5 text-[0.9375rem] outline-none focus:border-[#1D4FD8]";

  return (
    <section className="rounded-[10px] border border-petroleo/14 bg-branco">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-petroleo/12 px-6 py-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: ativo ? "#89E20D" : "#EBAD28" }}
          />
          <h2 className="rotulo text-petroleo/55">Verificação em duas etapas</h2>
        </div>
        <span className="font-mono text-[0.6875rem] tracking-[0.08em] text-tinta-900/45">
          {ativo ? `ATIVA · ${codigosRestantes} CÓDIGOS DE RESERVA` : "DESATIVADA"}
        </span>
      </header>

      <div className="p-6">
        {etapa === "parado" && (
          <div className="flex flex-wrap items-start justify-between gap-6">
            <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-tinta-900/65">
              {ativo
                ? "Sua conta pede um código de 6 dígitos além da senha. Se perder o aparelho, use um dos códigos de recuperação guardados na ativação."
                : "Com a verificação ativa, uma senha vazada sozinha não abre o painel. Funciona com Google Authenticator, 1Password, Authy ou qualquer aplicativo TOTP."}
            </p>
            {ativo ? (
              <button
                type="button"
                onClick={() => setEtapa("desativar")}
                className="rounded-[10px] border border-petroleo/20 px-5 py-2.5 text-[0.875rem] font-medium text-tinta-900/70 transition-colors hover:border-negativo hover:text-negativo"
              >
                Desativar
              </button>
            ) : (
              <button
                type="button"
                onClick={iniciar}
                disabled={ocupado}
                className="rounded-[10px] bg-[#1D4FD8] px-5 py-2.5 text-[0.875rem] font-semibold text-branco transition-colors hover:bg-[#153bab] disabled:opacity-50"
              >
                {ocupado ? "Gerando…" : "Ativar agora"}
              </button>
            )}
          </div>
        )}

        {etapa === "qr" && (
          <div className="grid gap-8 sm:grid-cols-[auto_1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr}
              alt="QR Code para configurar a verificação em duas etapas"
              className="h-44 w-44 rounded-[10px] border border-petroleo/14"
            />
            <div>
              <ol className="space-y-2.5 text-[0.9375rem] leading-relaxed text-tinta-900/70">
                <li>1. Abra seu aplicativo autenticador.</li>
                <li>2. Leia o QR Code ao lado.</li>
                <li>3. Digite abaixo o código de 6 dígitos que aparecer.</li>
              </ol>
              <p className="mt-4 font-mono text-[0.75rem] text-tinta-900/45">
                Sem câmera? Chave manual: <strong>{segredo}</strong>
              </p>

              <label htmlFor="codigo2fa" className="rotulo mt-5 block text-petroleo/55">
                Código de verificação
              </label>
              <input
                id="codigo2fa"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
                placeholder="000000"
                className={`${campo} max-w-[12rem] font-mono tracking-[0.4em]`}
              />

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={confirmar}
                  disabled={ocupado || codigo.length !== 6}
                  className="rounded-[10px] bg-[#1D4FD8] px-5 py-2.5 text-[0.875rem] font-semibold text-branco disabled:opacity-40"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setEtapa("parado")}
                  className="text-[0.875rem] text-tinta-900/50"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {etapa === "codigos" && (
          <div>
            <p className="max-w-[56ch] text-[0.9375rem] leading-relaxed text-tinta-900/70">
              Verificação ativada. Guarde os códigos abaixo em lugar seguro.
              cada um funciona uma única vez e eles não serão mostrados de novo.
            </p>
            <ul className="mt-5 grid max-w-[30rem] grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-petroleo/14 bg-petroleo/12">
              {codigos.map((c) => (
                <li
                  key={c}
                  className="bg-papel-050 px-4 py-3 text-center font-mono text-[0.9375rem] tracking-[0.14em] text-tinta-900"
                >
                  {c}
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setEtapa("parado")}
              className="mt-6 rounded-[10px] bg-[#1D4FD8] px-5 py-2.5 text-[0.875rem] font-semibold text-branco"
            >
              Guardei os códigos
            </button>
          </div>
        )}

        {etapa === "desativar" && (
          <div className="max-w-[24rem]">
            <p className="text-[0.9375rem] leading-relaxed text-tinta-900/70">
              Confirme sua senha para desativar a verificação em duas etapas.
            </p>
            <label htmlFor="senha2fa" className="rotulo mt-4 block text-petroleo/55">
              Senha
            </label>
            <input
              id="senha2fa"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              className={campo}
            />
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={desativar}
                disabled={ocupado || !senha}
                className="rounded-[10px] bg-negativo px-5 py-2.5 text-[0.875rem] font-semibold text-branco disabled:opacity-40"
              >
                Desativar
              </button>
              <button
                type="button"
                onClick={() => setEtapa("parado")}
                className="text-[0.875rem] text-tinta-900/50"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {erro && (
          <p
            role="alert"
            className="mt-5 rounded-[10px] border border-negativo/40 bg-negativo/[0.06] px-4 py-2.5 text-[0.8125rem] text-negativo"
          >
            {erro}
          </p>
        )}
      </div>
    </section>
  );
}
