import { eq } from "drizzle-orm";
import { generateSecret, generateURI, verify as verificarOtp } from "otplib";
import QRCode from "qrcode";
import { db, esquema } from "@/db";
import { respostaJson } from "@/lib/requisicao";
import { auditar, conferirCsrf, conferirSenha, encerrarTodasAsSessoes, sessaoAtual } from "@/lib/auth";
import { cifrar, decifrar, digerir, tokenAleatorio } from "@/lib/cifra";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Segundo fator (TOTP).
 *
 * O segredo é gerado no servidor, devolvido uma única vez em forma de
 * QR Code e só é gravado — cifrado — depois que a pessoa comprova que
 * consegue gerar um código válido. Assim ninguém fica trancado fora por
 * ter ativado o 2FA sem configurar o aplicativo corretamente.
 */

const pendentes = new Map<string, { segredo: string; expira: number }>();

function limparPendentes() {
  const agora = Date.now();
  for (const [chave, valor] of pendentes) {
    if (valor.expira < agora) pendentes.delete(chave);
  }
}

export async function POST(req: Request) {
  const sessao = await sessaoAtual();
  if (!sessao) return respostaJson({ ok: false, erro: "Não autenticado." }, 401);
  if (!(await conferirCsrf(req)))
    return respostaJson({ ok: false, erro: "Token inválido." }, 403);

  const corpo = (await req.json().catch(() => ({}))) as {
    acao?: string;
    codigo?: string;
    senha?: string;
  };

  limparPendentes();

  /* ---- Iniciar: gera segredo temporário e QR Code -------- */
  if (corpo.acao === "iniciar") {
    const segredo = generateSecret();
    pendentes.set(sessao.usuarioId, {
      segredo,
      expira: Date.now() + 10 * 60_000,
    });

    const uri = generateURI({
      issuer: "CORZ Painel",
      label: sessao.email,
      secret: segredo,
    });
    const qr = await QRCode.toDataURL(uri, {
      margin: 1,
      width: 320,
      color: { dark: "#00131F", light: "#FFFFFF" },
    });

    return respostaJson({ ok: true, qr, segredo });
  }

  /* ---- Confirmar: valida código e grava cifrado ---------- */
  if (corpo.acao === "confirmar") {
    const pendente = pendentes.get(sessao.usuarioId);
    if (!pendente) {
      return respostaJson(
        { ok: false, erro: "A configuração expirou. Comece de novo." },
        400
      );
    }

    const conferencia = corpo.codigo
      ? await verificarOtp({
          token: corpo.codigo,
          secret: pendente.segredo,
          epochTolerance: 30,
        })
      : { valid: false };

    if (!conferencia.valid) {
      return respostaJson({ ok: false, erro: "Código incorreto." }, 400);
    }

    // Códigos de recuperação: mostrados uma vez, guardados só como hash.
    const codigos = Array.from({ length: 8 }, () =>
      tokenAleatorio(6).replace(/[^A-Za-z0-9]/g, "").slice(0, 10).toUpperCase()
    );

    await db
      .update(esquema.usuarios)
      .set({
        segredo2fa: cifrar(pendente.segredo),
        doisFatores: true,
        codigosBackup: codigos.map(digerir),
        atualizadoEm: new Date(),
      })
      .where(eq(esquema.usuarios.id, sessao.usuarioId));

    pendentes.delete(sessao.usuarioId);

    await auditar({
      usuarioId: sessao.usuarioId,
      acao: "ativar_2fa",
      entidade: "usuario",
      entidadeId: sessao.usuarioId,
    });

    return respostaJson({ ok: true, codigos });
  }

  /* ---- Desativar: exige a senha novamente ---------------- */
  if (corpo.acao === "desativar") {
    const [usuario] = await db
      .select({ senhaHash: esquema.usuarios.senhaHash })
      .from(esquema.usuarios)
      .where(eq(esquema.usuarios.id, sessao.usuarioId))
      .limit(1);

    if (
      !usuario ||
      !corpo.senha ||
      !(await conferirSenha(usuario.senhaHash, corpo.senha))
    ) {
      return respostaJson({ ok: false, erro: "Senha incorreta." }, 401);
    }

    await db
      .update(esquema.usuarios)
      .set({
        doisFatores: false,
        segredo2fa: null,
        codigosBackup: [],
        atualizadoEm: new Date(),
      })
      .where(eq(esquema.usuarios.id, sessao.usuarioId));

    await auditar({
      usuarioId: sessao.usuarioId,
      acao: "desativar_2fa",
      entidade: "usuario",
      entidadeId: sessao.usuarioId,
    });

    return respostaJson({ ok: true });
  }

  /* ---- Encerrar as outras sessões ------------------------ */
  if (corpo.acao === "encerrar_sessoes") {
    await encerrarTodasAsSessoes(sessao.usuarioId);
    await auditar({
      usuarioId: sessao.usuarioId,
      acao: "encerrar_todas_sessoes",
      entidade: "sessao",
      entidadeId: sessao.usuarioId,
    });
    return respostaJson({ ok: true });
  }

  return respostaJson({ ok: false, erro: "Ação desconhecida." }, 400);
}

/** Confere se o segredo gravado ainda é decifrável — diagnóstico. */
export async function GET() {
  const sessao = await sessaoAtual();
  if (!sessao) return respostaJson({ ok: false }, 401);

  const [usuario] = await db
    .select({
      doisFatores: esquema.usuarios.doisFatores,
      segredo: esquema.usuarios.segredo2fa,
      codigos: esquema.usuarios.codigosBackup,
    })
    .from(esquema.usuarios)
    .where(eq(esquema.usuarios.id, sessao.usuarioId))
    .limit(1);

  let integro = true;
  if (usuario?.doisFatores && usuario.segredo) {
    try {
      decifrar(usuario.segredo);
    } catch {
      integro = false;
    }
  }

  return respostaJson({
    ok: true,
    ativo: usuario?.doisFatores ?? false,
    codigosRestantes: usuario?.codigos.length ?? 0,
    integro,
  });
}
