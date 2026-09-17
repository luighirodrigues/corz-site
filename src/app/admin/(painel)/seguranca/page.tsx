import { desc, eq } from "drizzle-orm";
import { db, esquema } from "@/db";
import { exigirSessao } from "@/lib/auth";
import { formatarDataHora } from "@/lib/cliente";
import PainelDoisFatores from "@/components/admin/PainelDoisFatores";
import FormularioTrocaSenha from "@/components/admin/FormularioTrocaSenha";

export const dynamic = "force-dynamic";
export const metadata = { title: "Segurança" };

export default async function PaginaSeguranca() {
  const sessao = await exigirSessao();

  const [usuario] = await db
    .select({
      doisFatores: esquema.usuarios.doisFatores,
      codigos: esquema.usuarios.codigosBackup,
      senhaAlteradaEm: esquema.usuarios.senhaAlteradaEm,
      ultimoAcesso: esquema.usuarios.ultimoAcesso,
    })
    .from(esquema.usuarios)
    .where(eq(esquema.usuarios.id, sessao.usuarioId))
    .limit(1);

  const sessoes = await db
    .select({
      id: esquema.sessoes.id,
      ip: esquema.sessoes.ip,
      agente: esquema.sessoes.agente,
      criadoEm: esquema.sessoes.criadoEm,
      ultimoUso: esquema.sessoes.ultimoUso,
    })
    .from(esquema.sessoes)
    .where(eq(esquema.sessoes.usuarioId, sessao.usuarioId))
    .orderBy(desc(esquema.sessoes.ultimoUso))
    .limit(10);

  return (
    <div className="space-y-10">
      <header>
        <span className="rotulo text-petroleo/45">Sua conta</span>
        <h1 className="mt-3 font-display text-[2rem] font-bold leading-tight tracking-[-0.036em] text-tinta-900">
          Segurança
        </h1>
        <p className="mt-3 max-w-[58ch] text-[0.9375rem] leading-relaxed text-tinta-900/60">
          Este painel publica conteúdo em um site institucional. Uma conta
          comprometida aqui vira conteúdo comprometido no ar — vale os dois
          minutos para ativar o segundo fator.
        </p>
      </header>

      <PainelDoisFatores
        ativoInicial={usuario?.doisFatores ?? false}
        codigosRestantes={usuario?.codigos.length ?? 0}
      />

      <FormularioTrocaSenha />

      <section className="rounded-[10px] border border-petroleo/14 bg-branco">
        <header className="flex items-center justify-between border-b border-petroleo/12 px-6 py-4">
          <h2 className="rotulo text-petroleo/55">Sessões ativas</h2>
          <span className="font-mono text-[0.6875rem] text-tinta-900/40">
            EXPIRAM APÓS 8 H DE INATIVIDADE
          </span>
        </header>
        <ul className="divide-y divide-petroleo/10">
          {sessoes.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center gap-x-6 gap-y-1 px-6 py-4"
            >
              <span className="font-mono text-[0.8125rem] text-tinta-900">
                {s.ip ?? "—"}
              </span>
              <span className="min-w-0 flex-1 truncate text-[0.75rem] text-tinta-900/45">
                {s.agente ?? "—"}
              </span>
              <span className="font-mono text-[0.6875rem] text-tinta-900/50">
                {formatarDataHora(s.ultimoUso)}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-[10px] border border-petroleo/14 bg-branco p-6">
        <h2 className="rotulo text-petroleo/55">Histórico da conta</h2>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-[0.8125rem] text-tinta-900/50">Último acesso</dt>
            <dd className="mt-1 font-mono text-[0.9375rem] text-tinta-900">
              {formatarDataHora(usuario?.ultimoAcesso)}
            </dd>
          </div>
          <div>
            <dt className="text-[0.8125rem] text-tinta-900/50">
              Senha alterada em
            </dt>
            <dd className="mt-1 font-mono text-[0.9375rem] text-tinta-900">
              {formatarDataHora(usuario?.senhaAlteradaEm)}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
