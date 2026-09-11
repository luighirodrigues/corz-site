import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { sessaoAtual } from "@/lib/auth";
import NavegacaoAdmin from "@/components/admin/NavegacaoAdmin";

export const metadata: Metadata = {
  title: { default: "Painel", template: "%s · Painel CORZ" },
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = "force-dynamic";

export default async function LayoutPainel({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessao = await sessaoAtual();
  if (!sessao) redirect("/admin/login");

  return (
    <div className="min-h-dvh bg-papel-050">
      <NavegacaoAdmin sessao={sessao} />
      <main className="mx-auto w-full max-w-[80rem] px-5 py-10 sm:px-8">
        {children}
      </main>
    </div>
  );
}
