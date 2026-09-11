import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { sessaoAtual } from "@/lib/auth";
import FormularioLogin from "./FormularioLogin";
import { Simbolo } from "@/components/marca/Logo";

export const metadata: Metadata = {
  title: "Entrar no painel",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PaginaLogin({
  searchParams,
}: {
  searchParams: Promise<{ proximo?: string }>;
}) {
  const sessao = await sessaoAtual();
  const { proximo } = await searchParams;

  if (sessao) redirect(proximo?.startsWith("/admin") ? proximo : "/admin");

  return (
    <main className="sup-escura relative flex min-h-dvh items-center justify-center overflow-hidden bg-tinta-950 px-5 py-16 text-branco">
      <div aria-hidden className="absolute inset-0">
        <div className="malha-escura absolute inset-0 opacity-60" />
        <div
          className="absolute left-1/2 top-1/2 h-[44rem] w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, #2C3191 0%, transparent 66%)",
          }}
        />
      </div>

      <div className="relative w-full max-w-[26rem]">
        <div className="flex items-center gap-3">
          <Simbolo variante="cor" className="h-9 w-auto" />
          <span className="font-wide text-[1.125rem] font-bold tracking-[0.2em]">
            CORZ
          </span>
        </div>

        <h1 className="mt-9 font-display text-[2rem] font-bold leading-[1.05] tracking-[-0.038em]">
          Painel editorial
        </h1>
        <p className="mt-3 text-[0.9375rem] leading-relaxed text-branco/50">
          Acesso restrito à equipe da CORZ. Todas as ações realizadas aqui são
          registradas em trilha de auditoria.
        </p>

        <div className="mt-9 rounded-[12px] border border-branco/12 bg-tinta-900/70 p-7 backdrop-blur-sm">
          <FormularioLogin proximo={proximo} />
        </div>

        <p className="mt-7 font-mono text-[0.625rem] leading-relaxed tracking-[0.08em] text-branco/30">
          CONEXÃO CIFRADA · SESSÃO EXPIRA APÓS 8 H DE INATIVIDADE
        </p>
      </div>
    </main>
  );
}
