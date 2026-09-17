import { eq } from "drizzle-orm";
import { verify as verificarOtp } from "otplib";
import { db, esquema } from "@/db";
import { esquemaLogin, errosDe } from "@/lib/validacao";
import { ipDoCliente, respostaJson } from "@/lib/requisicao";
import { decifrar, digerir, iguaisEmTempoConstante } from "@/lib/cifra";
import {
  auditar,
  bloqueadoPorTentativas,
  conferirCsrf,
  conferirSenha,
  criarSessao,
  encerrarSessao,
  registrarTentativa,
  sessaoAtual,
} from "@/lib/auth";
import type { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mensagem única para credencial errada, usuário inexistente e conta
 * desativada. Distinguir esses casos entrega ao atacante um oráculo de
 * enumeração de usuários por um ganho de usabilidade quase nulo.
 */
const FALHA = "E-mail ou senha incorretos.";

export async function POST(req: Request) {
  const ip = await ipDoCliente();

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return respostaJson({ ok: false, erro: "Requisição inválida." }, 400);
  }

  const analise = esquemaLogin.safeParse(corpo);
  if (!analise.success) {
    return respostaJson(
      { ok: false, erros: errosDe(analise.error as z.ZodError) },
      422
    );
  }

  const { email, senha, codigo } = analise.data;

  if (await bloqueadoPorTentativas(email, ip)) {
    return respostaJson(
      {
        ok: false,
        erro: "Muitas tentativas. Aguarde 15 minutos antes de tentar de novo.",
      },
      429
    );
  }

  const [usuario] = await db
    .select()
    .from(esquema.usuarios)
    .where(eq(esquema.usuarios.email, email))
    .limit(1);

  // Mesmo sem usuário, gastamos o tempo de uma verificação de senha para
  // que a resposta não denuncie a existência da conta pela latência.
  const hashReferencia =
    usuario?.senhaHash ??
    "$argon2id$v=19$m=19456,t=2,p=1$c29tZXNhbHRzb21lc2FsdA$RdescudvJCsgt3ub+b+dWRWJTmaaJObG";

  const senhaConfere = await conferirSenha(hashReferencia, senha);

  if (!usuario || !usuario.ativo || !senhaConfere) {
    await registrarTentativa(email, ip, false);
    return respostaJson({ ok: false, erro: FALHA }, 401);
  }

  // Segundo fator
  if (usuario.doisFatores && usuario.segredo2fa) {
    if (!codigo) {
      await auditar({
        usuarioId: usuario.id,
        acao: "etapa_1_sucesso_aguardando_2fa",
        entidade: "sessao",
        entidadeId: usuario.id,
      });
      return respostaJson({ ok: false, precisa2fa: true }, 200);
    }

    let valido = false;

    if (/^\d{6}$/.test(codigo)) {
      // epochTolerance de 30 s cobre um passo de tempo para frente e um
      // para trás — relógios de celular fora de sincronia são comuns.
      const resultado = await verificarOtp({
        token: codigo,
        secret: decifrar(usuario.segredo2fa),
        epochTolerance: 30,
      });
      valido = resultado.valid;
    } else {
      // Código de recuperação: comparado por hash e queimado no uso.
      const alvo = digerir(codigo.trim().toUpperCase());
      const indice = usuario.codigosBackup.findIndex((h) =>
        iguaisEmTempoConstante(h, alvo)
      );
      if (indice >= 0) {
        valido = true;
        const restantes = usuario.codigosBackup.filter((_, i) => i !== indice);
        await db
          .update(esquema.usuarios)
          .set({ codigosBackup: restantes })
          .where(eq(esquema.usuarios.id, usuario.id));
      }
    }

    if (!valido) {
      await registrarTentativa(email, ip, false);
      return respostaJson(
        { ok: false, precisa2fa: true, erro: "Código inválido ou expirado." },
        401
      );
    }
  }

  await registrarTentativa(email, ip, true);
  await criarSessao(usuario.id);
  await auditar({
    usuarioId: usuario.id,
    acao: "entrar",
    entidade: "sessao",
    entidadeId: usuario.id,
  });

  return respostaJson({ ok: true, papel: usuario.papel });
}

export async function DELETE(req: Request) {
  const sessao = await sessaoAtual();
  if (!(await conferirCsrf(req))) {
    return respostaJson({ ok: false, erro: "Token inválido." }, 403);
  }
  if (sessao) {
    await auditar({
      usuarioId: sessao.usuarioId,
      acao: "sair",
      entidade: "sessao",
      entidadeId: sessao.usuarioId,
    });
  }
  await encerrarSessao();
  return respostaJson({ ok: true });
}
