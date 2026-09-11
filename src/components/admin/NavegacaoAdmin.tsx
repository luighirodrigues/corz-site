"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clsx } from "clsx";
import { Simbolo } from "@/components/marca/Logo";
import { csrf } from "@/lib/cliente";
import type { Sessao } from "@/lib/auth";

const ITENS = [
  { href: "/admin", rotulo: "Visão geral", exato: true },
  { href: "/admin/artigos", rotulo: "Artigos" },
  { href: "/admin/leads", rotulo: "Solicitações" },
  { href: "/admin/seguranca", rotulo: "Segurança" },
  { href: "/admin/usuarios", rotulo: "Usuários", minimo: "ADMIN" as const },
];

const HIERARQUIA = { AUTOR: 1, EDITOR: 2, ADMIN: 3 };

export default function NavegacaoAdmin({ sessao }: { sessao: Sessao }) {
  const caminho = usePathname();
  const router = useRouter();

  async function sair() {
    await fetch("/api/admin/sessao", {
      method: "DELETE",
      headers: { "x-corz-csrf": csrf() },
    });
    router.replace("/admin/login");
    router.refresh();
  }

  const visiveis = ITENS.filter(
    (item) => !item.minimo || HIERARQUIA[sessao.papel] >= HIERARQUIA[item.minimo]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-petroleo/14 bg-tinta-950 text-branco">
      <div className="mx-auto flex h-16 w-full max-w-[80rem] items-center gap-6 px-5 sm:px-8">
        <Link href="/admin" className="flex shrink-0 items-center gap-2.5">
          <Simbolo variante="cor" className="h-6 w-auto" />
          <span className="font-wide text-[0.8125rem] font-bold tracking-[0.2em]">
            CORZ
          </span>
          <span className="rotulo ml-1 hidden text-branco/35 sm:inline">
            Painel
          </span>
        </Link>

        <nav aria-label="Painel" className="flex flex-1 items-center gap-1 overflow-x-auto">
          {visiveis.map((item) => {
            const ativo = item.exato
              ? caminho === item.href
              : caminho.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "relative whitespace-nowrap px-3 py-2 text-[0.875rem] font-medium transition-colors duration-200",
                  ativo ? "text-branco" : "text-branco/50 hover:text-branco"
                )}
              >
                {item.rotulo}
                {ativo && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -bottom-[13px] h-px bg-ciano"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <Link
            href="/"
            target="_blank"
            className="hidden text-[0.8125rem] text-branco/45 transition-colors hover:text-ciano sm:inline"
          >
            Ver o site ↗
          </Link>
          <div className="hidden text-right sm:block">
            <p className="text-[0.8125rem] font-medium leading-tight">
              {sessao.nome}
            </p>
            <p className="font-mono text-[0.625rem] tracking-[0.08em] text-branco/35">
              {sessao.papel}
            </p>
          </div>
          <button
            type="button"
            onClick={sair}
            className="rounded-[10px] border border-branco/18 px-3.5 py-2 text-[0.8125rem] font-medium text-branco/70 transition-colors hover:border-negativo hover:text-negativo"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
