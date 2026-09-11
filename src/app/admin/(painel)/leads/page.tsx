import { desc } from "drizzle-orm";
import { db, esquema } from "@/db";
import { exigirSessao } from "@/lib/auth";
import { formatarDataHora } from "@/lib/cliente";

export const dynamic = "force-dynamic";
export const metadata = { title: "Solicitações" };

const CORES: Record<string, string> = {
  CONTATO: "#1D4FD8",
  DIAGNOSTICO: "#00ADE7",
  SUPORTE: "#E20D50",
  MATERIAL: "#3F39BD",
  NEWSLETTER: "#89E20D",
};

export default async function PaginaLeads() {
  await exigirSessao("EDITOR");

  const leads = await db
    .select()
    .from(esquema.leads)
    .orderBy(desc(esquema.leads.criadoEm))
    .limit(200);

  return (
    <div className="space-y-8">
      <header>
        <span className="rotulo text-petroleo/45">Comercial e suporte</span>
        <h1 className="mt-3 font-display text-[2rem] font-bold leading-tight tracking-[-0.036em] text-tinta-900">
          Solicitações
        </h1>
        <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-relaxed text-tinta-900/60">
          Tudo que chega pelos formulários do site. Chamados de suporte
          aparecem com o protocolo dentro da mensagem.
        </p>
      </header>

      {leads.length === 0 ? (
        <div className="rounded-[10px] border border-dashed border-petroleo/22 bg-branco px-8 py-16 text-center text-[0.9375rem] text-tinta-900/50">
          Nenhuma solicitação recebida ainda.
        </div>
      ) : (
        <ul className="space-y-px overflow-hidden rounded-[10px] border border-petroleo/14 bg-petroleo/12">
          {leads.map((lead) => (
            <li key={lead.id} className="bg-branco">
              <details className="group">
                <summary className="flex cursor-pointer flex-wrap items-center gap-x-5 gap-y-2 px-6 py-4 transition-colors hover:bg-papel-050">
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: CORES[lead.origem] ?? "#00304D" }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[0.9375rem] font-medium text-tinta-900">
                      {lead.nome}
                      {lead.empresa && (
                        <span className="font-normal text-tinta-900/50">
                          {" "}· {lead.empresa}
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-[0.75rem] text-tinta-900/45">
                      {lead.email}
                      {lead.telefone && ` · ${lead.telefone}`}
                    </span>
                  </span>
                  <span className="rounded-[6px] border border-petroleo/16 px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.06em] text-tinta-900/55">
                    {lead.origem}
                  </span>
                  <span className="w-40 shrink-0 text-right font-mono text-[0.6875rem] text-tinta-900/45">
                    {formatarDataHora(lead.criadoEm)}
                  </span>
                </summary>

                <div className="border-t border-petroleo/10 bg-papel-050 px-6 py-5">
                  <dl className="grid gap-4 sm:grid-cols-3">
                    {lead.interesse && (
                      <div>
                        <dt className="rotulo text-petroleo/45">Interesse</dt>
                        <dd className="mt-1 text-[0.875rem] text-tinta-900">
                          {lead.interesse}
                        </dd>
                      </div>
                    )}
                    {lead.pagina && (
                      <div>
                        <dt className="rotulo text-petroleo/45">Origem</dt>
                        <dd className="mt-1 font-mono text-[0.75rem] text-tinta-900">
                          {lead.pagina}
                        </dd>
                      </div>
                    )}
                    {lead.utm ? (
                      <div>
                        <dt className="rotulo text-petroleo/45">Campanha</dt>
                        <dd className="mt-1 font-mono text-[0.75rem] text-tinta-900">
                          {Object.entries(lead.utm as Record<string, string>)
                            .map(([k, v]) => `${k.replace("utm_", "")}=${v}`)
                            .join(" · ")}
                        </dd>
                      </div>
                    ) : null}
                  </dl>

                  {lead.mensagem && (
                    <p className="mt-5 max-w-[70ch] whitespace-pre-wrap border-l-2 border-petroleo/25 pl-4 text-[0.9375rem] leading-relaxed text-tinta-900/78">
                      {lead.mensagem}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-4">
                    <a
                      href={`mailto:${lead.email}`}
                      className="text-[0.875rem] font-semibold text-[#1D4FD8]"
                    >
                      Responder por e-mail →
                    </a>
                    {lead.telefone && (
                      <a
                        href={`https://wa.me/${lead.telefone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[0.875rem] font-semibold text-[#1D4FD8]"
                      >
                        Abrir WhatsApp →
                      </a>
                    )}
                  </div>
                </div>
              </details>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
