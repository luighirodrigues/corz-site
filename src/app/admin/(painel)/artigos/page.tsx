import Link from "next/link";
import { desc, eq, sql } from "drizzle-orm";
import { db, esquema } from "@/db";
import { exigirSessao } from "@/lib/auth";
import { formatarDataHora } from "@/lib/cliente";
import { clsx } from "clsx";

export const dynamic = "force-dynamic";
export const metadata = { title: "Artigos" };

const CORES = {
  PUBLICADO: "#89E20D",
  AGENDADO: "#EBAD28",
  RASCUNHO: "#00ADE7",
  ARQUIVADO: "#9AABB8",
} as const;

const FILTROS = [
  { valor: "", rotulo: "Todos" },
  { valor: "PUBLICADO", rotulo: "Publicados" },
  { valor: "AGENDADO", rotulo: "Agendados" },
  { valor: "RASCUNHO", rotulo: "Rascunhos" },
  { valor: "ARQUIVADO", rotulo: "Arquivados" },
];

export default async function ListaArtigos({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await exigirSessao();
  const { status } = await searchParams;

  const valido = FILTROS.some((f) => f.valor && f.valor === status);

  const artigos = await db
    .select({
      id: esquema.artigos.id,
      slug: esquema.artigos.slug,
      titulo: esquema.artigos.titulo,
      status: esquema.artigos.status,
      publicadoEm: esquema.artigos.publicadoEm,
      agendadoPara: esquema.artigos.agendadoPara,
      atualizadoEm: esquema.artigos.atualizadoEm,
      tempoLeitura: esquema.artigos.tempoLeitura,
      autor: esquema.usuarios.nome,
      categoria: esquema.categorias.nome,
    })
    .from(esquema.artigos)
    .leftJoin(esquema.usuarios, eq(esquema.artigos.autorId, esquema.usuarios.id))
    .leftJoin(
      esquema.categorias,
      eq(esquema.artigos.categoriaId, esquema.categorias.id)
    )
    .where(
      valido
        ? eq(
            esquema.artigos.status,
            status as "PUBLICADO" | "AGENDADO" | "RASCUNHO" | "ARQUIVADO"
          )
        : sql`true`
    )
    .orderBy(desc(esquema.artigos.atualizadoEm))
    .limit(100);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="rotulo text-petroleo/45">Conteúdo</span>
          <h1 className="mt-3 font-display text-[2rem] font-bold leading-tight tracking-[-0.036em] text-tinta-900">
            Artigos
          </h1>
        </div>
        <Link
          href="/admin/artigos/novo"
          className="rounded-[10px] bg-[#1D4FD8] px-5 py-3 text-[0.9375rem] font-semibold text-branco transition-colors hover:bg-[#153bab]"
        >
          Escrever artigo
        </Link>
      </header>

      <nav className="flex flex-wrap gap-1 border-b border-petroleo/14">
        {FILTROS.map((f) => {
          const ativo = (status ?? "") === f.valor;
          return (
            <Link
              key={f.rotulo}
              href={f.valor ? `/admin/artigos?status=${f.valor}` : "/admin/artigos"}
              className={clsx(
                "relative px-4 py-2.5 text-[0.875rem] font-medium transition-colors",
                ativo ? "text-tinta-900" : "text-tinta-900/45 hover:text-tinta-900"
              )}
            >
              {f.rotulo}
              {ativo && (
                <span
                  aria-hidden
                  className="absolute inset-x-4 -bottom-px h-[2px] bg-[#1D4FD8]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {artigos.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-petroleo/22 bg-branco px-8 py-16 text-center">
          <p className="font-display text-[1.25rem] font-semibold tracking-[-0.026em] text-tinta-900">
            Nada por aqui ainda.
          </p>
          <p className="mx-auto mt-3 max-w-[42ch] text-[0.9375rem] leading-relaxed text-tinta-900/55">
            Comece por uma pergunta que um cliente realmente fez. Os artigos
            que mais trazem tráfego qualificado nascem de reunião, não de
            planilha de palavra-chave.
          </p>
          <Link
            href="/admin/artigos/novo"
            className="mt-6 inline-block rounded-[10px] bg-[#1D4FD8] px-5 py-3 text-[0.9375rem] font-semibold text-branco"
          >
            Escrever o primeiro
          </Link>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-[10px] border border-petroleo/14 bg-branco">
          {artigos.map((a, i) => (
            <li key={a.id} className={i > 0 ? "border-t border-petroleo/10" : ""}>
              <Link
                href={`/admin/artigos/${a.id}`}
                className="flex flex-wrap items-center gap-x-5 gap-y-2 px-6 py-4 transition-colors hover:bg-papel-050"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: CORES[a.status] }}
                />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.9375rem] font-medium text-tinta-900">
                    {a.titulo}
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[0.6875rem] text-tinta-900/40">
                    /blog/{a.slug}
                  </span>
                </span>

                {a.categoria && (
                  <span className="rounded-[6px] border border-petroleo/16 px-2 py-0.5 text-[0.6875rem] text-tinta-900/55">
                    {a.categoria}
                  </span>
                )}

                <span className="w-24 shrink-0 text-[0.75rem] text-tinta-900/45">
                  {a.autor}
                </span>

                <span className="w-40 shrink-0 text-right font-mono text-[0.6875rem] text-tinta-900/50">
                  {a.status === "AGENDADO"
                    ? `→ ${formatarDataHora(a.agendadoPara)}`
                    : a.status === "PUBLICADO"
                      ? formatarDataHora(a.publicadoEm)
                      : formatarDataHora(a.atualizadoEm)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
