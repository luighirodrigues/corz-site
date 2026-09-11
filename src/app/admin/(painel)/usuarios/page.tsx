import { desc } from "drizzle-orm";
import { db, esquema } from "@/db";
import { exigirSessao } from "@/lib/auth";
import { formatarDataHora } from "@/lib/cliente";

export const dynamic = "force-dynamic";
export const metadata = { title: "Usuários" };

const DESCRICAO_PAPEL = {
  ADMIN: "Acesso total, inclusive gestão de usuários",
  EDITOR: "Publica e edita qualquer artigo",
  AUTOR: "Escreve e submete os próprios artigos",
} as const;

export default async function PaginaUsuarios() {
  await exigirSessao("ADMIN");

  const usuarios = await db
    .select({
      id: esquema.usuarios.id,
      nome: esquema.usuarios.nome,
      email: esquema.usuarios.email,
      papel: esquema.usuarios.papel,
      ativo: esquema.usuarios.ativo,
      doisFatores: esquema.usuarios.doisFatores,
      ultimoAcesso: esquema.usuarios.ultimoAcesso,
      criadoEm: esquema.usuarios.criadoEm,
    })
    .from(esquema.usuarios)
    .orderBy(desc(esquema.usuarios.criadoEm));

  return (
    <div className="space-y-8">
      <header>
        <span className="rotulo text-petroleo/45">Acesso</span>
        <h1 className="mt-3 font-display text-[2rem] font-bold leading-tight tracking-[-0.036em] text-tinta-900">
          Usuários do painel
        </h1>
        <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-tinta-900/60">
          Contas são criadas pela linha de comando com{" "}
          <code className="rounded-[6px] border border-petroleo/16 bg-papel-100 px-1.5 py-0.5 font-mono text-[0.8125rem]">
            npm run usuario
          </code>
          . Manter a criação fora da interface reduz a superfície de ataque: não
          existe rota web capaz de criar um administrador.
        </p>
      </header>

      <ul className="overflow-hidden rounded-[10px] border border-petroleo/14 bg-branco">
        {usuarios.map((u, i) => (
          <li
            key={u.id}
            className={`flex flex-wrap items-center gap-x-6 gap-y-2 px-6 py-4 ${
              i > 0 ? "border-t border-petroleo/10" : ""
            }`}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ background: u.ativo ? "#89E20D" : "#9AABB8" }}
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.9375rem] font-medium text-tinta-900">
                {u.nome}
              </span>
              <span className="block truncate text-[0.75rem] text-tinta-900/45">
                {u.email}
              </span>
            </span>

            <span className="w-56 shrink-0">
              <span className="block text-[0.8125rem] font-semibold text-tinta-900">
                {u.papel}
              </span>
              <span className="block text-[0.6875rem] text-tinta-900/45">
                {DESCRICAO_PAPEL[u.papel]}
              </span>
            </span>

            <span
              className="w-24 shrink-0 font-mono text-[0.625rem] tracking-[0.06em]"
              style={{ color: u.doisFatores ? "#4A7A00" : "#B07C0C" }}
            >
              {u.doisFatores ? "2FA ATIVO" : "SEM 2FA"}
            </span>

            <span className="w-40 shrink-0 text-right font-mono text-[0.6875rem] text-tinta-900/45">
              {formatarDataHora(u.ultimoAcesso)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
