import { sql } from "drizzle-orm";
import { db } from "@/db";
import { emailConfigurado } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Verificação de saúde.
 *
 * Usada pelo Docker para decidir se o contêiner está pronto e pelo
 * monitoramento externo. Testa o banco de verdade: um processo que
 * responde mas perdeu a conexão com o Postgres não está saudável, está
 * só de pé.
 *
 * Não expõe versão, ambiente nem detalhe de erro — informação de
 * diagnóstico em endpoint público é reconhecimento gratuito para quem
 * está sondando.
 */
export async function GET() {
  const inicio = Date.now();

  try {
    await db.execute(sql`select 1`);
    return Response.json(
      /* `email` é booleano de propósito: diz se o aviso dos
         formulários vai sair, sem revelar host, usuário nem porta. É a
         diferença entre monitorar e entregar o mapa do servidor. */
      { ok: true, banco: "ok", email: emailConfigurado, ms: Date.now() - inicio },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json(
      { ok: false, banco: "indisponivel" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
