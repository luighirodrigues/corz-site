import Link from "next/link";
import { and, desc, eq, gt, sql } from "drizzle-orm";
import { db, esquema } from "@/db";
import { exigirSessao, ultimosAuditos } from "@/lib/auth";
import { formatarDataHora } from "@/lib/cliente";

export const dynamic = "force-dynamic";

export const metadata = { title: "Visão geral" };

export default async function PainelInicio() {
  const sessao = await exigirSessao();

  const [contagens] = await db
    .select({
      publicados: sql<number>`count(*) filter (where ${esquema.artigos.status} = 'PUBLICADO')::int`,
      agendados: sql<number>`count(*) filter (where ${esquema.artigos.status} = 'AGENDADO')::int`,
      rascunhos: sql<number>`count(*) filter (where ${esquema.artigos.status} = 'RASCUNHO')::int`,
      arquivados: sql<number>`count(*) filter (where ${esquema.artigos.status} = 'ARQUIVADO')::int`,
    })
    .from(esquema.artigos);

  const fila = await db
    .select({
      id: esquema.artigos.id,
      titulo: esquema.artigos.titulo,
      agendadoPara: esquema.artigos.agendadoPara,
      autor: esquema.usuarios.nome,
    })
    .from(esquema.artigos)
    .leftJoin(esquema.usuarios, eq(esquema.artigos.autorId, esquema.usuarios.id))
    .where(
      and(
        eq(esquema.artigos.status, "AGENDADO"),
        gt(esquema.artigos.agendadoPara, new Date())
      )
    )
    .orderBy(esquema.artigos.agendadoPara)
    .limit(6);

  const [leadsNovos] = await db
    .select({ total: sql<number>`count(*) filter (where ${esquema.leads.lido} = false)::int` })
    .from(esquema.leads);

  const ultimosLeads = await db
    .select({
      id: esquema.leads.id,
      nome: esquema.leads.nome,
      empresa: esquema.leads.empresa,
      origem: esquema.leads.origem,
      criadoEm: esquema.leads.criadoEm,
    })
    .from(esquema.leads)
    .orderBy(desc(esquema.leads.criadoEm))
    .limit(6);

  const auditos = await ultimosAuditos(8);

  const cartoes = [
    { rotulo: "Publicados", valor: contagens?.publicados ?? 0, cor: "#89E20D" },
    { rotulo: "Agendados", valor: contagens?.agendados ?? 0, cor: "#EBAD28" },
    { rotulo: "Rascunhos", valor: contagens?.rascunhos ?? 0, cor: "#00ADE7" },
    { rotulo: "Solicitações novas", valor: leadsNovos?.total ?? 0, cor: "#1D4FD8" },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="rotulo text-petroleo/45">Painel editorial</span>
          <h1 className="mt-3 font-display text-[2rem] font-bold leading-tight tracking-[-0.036em] text-tinta-900">
            Bom te ver, {sessao.nome.split(" ")[0]}.
          </h1>
        </div>
        <Link
          href="/admin/artigos/novo"
          className="rounded-[10px] bg-[#1D4FD8] px-5 py-3 text-[0.9375rem] font-semibold text-branco transition-colors hover:bg-[#153bab]"
        >
          Escrever artigo
        </Link>
      </header>

      <dl className="grid gap-px border border-petroleo/14 bg-petroleo/12 sm:grid-cols-2 lg:grid-cols-4">
        {cartoes.map((c) => (
          <div key={c.rotulo} className="relative bg-branco p-6">
            <span
              aria-hidden
              className="absolute left-0 top-0 h-full w-[3px]"
              style={{ background: c.cor }}
            />
            <dt className="rotulo text-petroleo/45">{c.rotulo}</dt>
            <dd className="mt-3 font-wide text-[2.25rem] font-bold leading-none tabular-nums tracking-[-0.03em] text-tinta-900">
              {c.valor}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-[10px] border border-petroleo/14 bg-branco">
          <header className="flex items-center justify-between border-b border-petroleo/12 px-6 py-4">
            <h2 className="rotulo text-petroleo/55">Fila de publicação</h2>
            <Link
              href="/admin/artigos?status=AGENDADO"
              className="text-[0.8125rem] font-semibold text-[#1D4FD8]"
            >
              Ver tudo
            </Link>
          </header>
          {fila.length === 0 ? (
            <p className="px-6 py-8 text-[0.875rem] text-tinta-900/45">
              Nenhum artigo agendado. Agendar com uma semana de antecedência
              costuma render um calendário mais regular.
            </p>
          ) : (
            <ul className="divide-y divide-petroleo/10">
              {fila.map((a) => (
                <li key={a.id}>
                  <Link
                    href={`/admin/artigos/${a.id}`}
                    className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-papel-050"
                  >
                    <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-alerta" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[0.9375rem] font-medium text-tinta-900">
                        {a.titulo}
                      </span>
                      <span className="block text-[0.75rem] text-tinta-900/45">
                        {a.autor}
                      </span>
                    </span>
                    <span className="shrink-0 font-mono text-[0.6875rem] text-tinta-900/55">
                      {formatarDataHora(a.agendadoPara)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-[10px] border border-petroleo/14 bg-branco">
          <header className="flex items-center justify-between border-b border-petroleo/12 px-6 py-4">
            <h2 className="rotulo text-petroleo/55">Últimas solicitações</h2>
            <Link
              href="/admin/leads"
              className="text-[0.8125rem] font-semibold text-[#1D4FD8]"
            >
              Ver tudo
            </Link>
          </header>
          {ultimosLeads.length === 0 ? (
            <p className="px-6 py-8 text-[0.875rem] text-tinta-900/45">
              Nenhuma solicitação recebida ainda.
            </p>
          ) : (
            <ul className="divide-y divide-petroleo/10">
              {ultimosLeads.map((l) => (
                <li key={l.id} className="flex items-center gap-4 px-6 py-4">
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.9375rem] font-medium text-tinta-900">
                      {l.nome}
                    </span>
                    <span className="block truncate text-[0.75rem] text-tinta-900/45">
                      {l.empresa ?? "—"} · {l.origem}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[0.6875rem] text-tinta-900/45">
                    {formatarDataHora(l.criadoEm)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="rounded-[10px] border border-petroleo/14 bg-branco">
        <header className="border-b border-petroleo/12 px-6 py-4">
          <h2 className="rotulo text-petroleo/55">Trilha de auditoria</h2>
        </header>
        {auditos.length === 0 ? (
          <p className="px-6 py-8 text-[0.875rem] text-tinta-900/45">
            Nenhuma ação registrada ainda.
          </p>
        ) : (
          <ul className="divide-y divide-petroleo/10">
            {auditos.map((a) => (
              <li
                key={a.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-3.5 text-[0.8125rem]"
              >
                <span className="font-mono text-[0.6875rem] text-tinta-900/40">
                  {formatarDataHora(a.criadoEm)}
                </span>
                <span className="font-medium text-tinta-900">
                  {a.autor ?? "sistema"}
                </span>
                <span className="rounded-[6px] border border-petroleo/16 px-2 py-0.5 font-mono text-[0.625rem] uppercase tracking-[0.06em] text-tinta-900/60">
                  {a.acao}
                </span>
                <span className="text-tinta-900/45">{a.entidade}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
