import { and, eq, ne } from "drizzle-orm";
import { cookies } from "next/headers";
import { z } from "zod";
import { db, esquema } from "@/db";
import { digerir } from "@/lib/cifra";
import { respostaJson } from "@/lib/requisicao";
import {
  auditar,
  conferirCsrf,
  conferirSenha,
  gerarHashSenha,
  sessaoAtual,
  NOME_COOKIE,
} from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const esquemaTrocaSenha = z
  .object({
    senhaAtual: z.string().min(1, "Informe sua senha atual."),
    novaSenha: z
      .string()
      .min(10, "A nova senha precisa ter pelo menos 10 caracteres.")
      .max(120, "Senha muito longa."),
    confirmarSenha: z.string().min(1, "Confirme a nova senha."),
  })
  .refine((d) => d.novaSenha === d.confirmarSenha, {
    message: "As senhas digitadas não conferem.",
    path: ["confirmarSenha"],
  });

export async function POST(req: Request) {
  const sessao = await sessaoAtual();
  if (!sessao) return respostaJson({ ok: false, erro: "Não autenticado." }, 401);

  if (!(await conferirCsrf(req))) {
    return respostaJson({ ok: false, erro: "Token de sessão inválido." }, 403);
  }

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return respostaJson({ ok: false, erro: "Requisição inválida." }, 400);
  }

  const analise = esquemaTrocaSenha.safeParse(corpo);
  if (!analise.success) {
    const primeiraQuestao = analise.error.issues[0];
    return respostaJson(
      { ok: false, erro: primeiraQuestao?.message ?? "Dados inválidos." },
      422
    );
  }

  const { senhaAtual, novaSenha } = analise.data;

  const [usuario] = await db
    .select({ senhaHash: esquema.usuarios.senhaHash })
    .from(esquema.usuarios)
    .where(eq(esquema.usuarios.id, sessao.usuarioId))
    .limit(1);

  if (!usuario || !(await conferirSenha(usuario.senhaHash, senhaAtual))) {
    return respostaJson({ ok: false, erro: "Senha atual incorreta." }, 400);
  }

  if (senhaAtual === novaSenha) {
    return respostaJson(
      { ok: false, erro: "A nova senha precisa ser diferente da atual." },
      400
    );
  }

  const novaSenhaHash = await gerarHashSenha(novaSenha);
  const agora = new Date();

  await db
    .update(esquema.usuarios)
    .set({
      senhaHash: novaSenhaHash,
      senhaAlteradaEm: agora,
      atualizadoEm: agora,
    })
    .where(eq(esquema.usuarios.id, sessao.usuarioId));

  // Encerra todas as OUTRAS sessões ativas do usuário para revogar estações antigas
  const jar = await cookies();
  const tokenAtual = jar.get(NOME_COOKIE)?.value;
  if (tokenAtual) {
    const hashAtual = digerir(tokenAtual);
    await db
      .delete(esquema.sessoes)
      .where(
        and(
          eq(esquema.sessoes.usuarioId, sessao.usuarioId),
          ne(esquema.sessoes.tokenHash, hashAtual)
        )
      );
  }

  await auditar({
    usuarioId: sessao.usuarioId,
    acao: "alterar_propria_senha",
    entidade: "usuario",
    entidadeId: sessao.usuarioId,
  });

  return respostaJson({
    ok: true,
    mensagem: "Senha atualizada com sucesso. As demais sessões foram encerradas.",
  });
}
