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
let ultimoCheck = 0;
let ultimoStatusOk = false;
let ultimoMs = 0;

export async function GET() {
  const agora = Date.now();
  // Cache de 10 s para proteger o pool de conexões (max: 10) contra rajadas de DoS.
  if (ultimoStatusOk && agora - ultimoCheck < 10_000) {
    return Response.json(
      { ok: true, banco: "ok", email: emailConfigurado, ms: ultimoMs, cache: true },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const inicio = Date.now();

  try {
    await db.execute(sql`select 1`);
    ultimoCheck = Date.now();
    ultimoStatusOk = true;
    ultimoMs = ultimoCheck - inicio;

    return Response.json(
      { ok: true, banco: "ok", email: emailConfigurado, ms: ultimoMs },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    ultimoStatusOk = false;
    return Response.json(
      { ok: false, banco: "indisponivel" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
