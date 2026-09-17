import "server-only";
import { cookies } from "next/headers";
import { and, eq, gt, lt, desc, sql } from "drizzle-orm";
import { hash, verify } from "@node-rs/argon2";
import { db, esquema } from "@/db";
import {
  digerir,
  tokenAleatorio,
  iguaisEmTempoConstante,
} from "@/lib/cifra";
import { agenteDoCliente, ipDoCliente } from "@/lib/requisicao";
import {
  NOME_COOKIE,
  NOME_CSRF,
  OCIOSIDADE_MS,
  VIDA_MAXIMA_MS,
} from "@/lib/constantes";

/* ============================================================
   Autenticação do painel administrativo

   Decisões e motivos:

   - Sessão opaca no servidor, não JWT. Um JWT válido não pode ser
     revogado antes de expirar; aqui, apagar a linha derruba o acesso
     na hora — o que importa quando alguém é desligado da empresa.
   - Só o hash SHA-256 do token vai para o banco. Um dump do banco não
     concede sessão a ninguém.
   - Expiração dupla: 8 horas de inatividade e 7 dias no total. A
     primeira protege a estação esquecida aberta; a segunda limita a
     janela de um token furtado.
   - Argon2id para senha, com parâmetros acima do mínimo recomendado.
   ============================================================ */

export {
  NOME_COOKIE,
  NOME_CSRF,
  OCIOSIDADE_MS,
  VIDA_MAXIMA_MS,
} from "@/lib/constantes";

const PARAMETROS_ARGON = {
  memoryCost: 19_456, // 19 MiB — recomendação OWASP para Argon2id
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

export type Sessao = {
  usuarioId: string;
  nome: string;
  email: string;
  papel: "ADMIN" | "EDITOR" | "AUTOR";
  sessaoId: string;
};

export async function gerarHashSenha(senha: string) {
  return hash(senha, PARAMETROS_ARGON);
}

export async function conferirSenha(hashArmazenado: string, senha: string) {
  try {
    return await verify(hashArmazenado, senha, PARAMETROS_ARGON);
  } catch {
    return false;
  }
}

/* ---------- Sessão ---------------------------------------- */

export async function criarSessao(usuarioId: string) {
  const token = tokenAleatorio(32);
  const agora = new Date();

  const [linha] = await db
    .insert(esquema.sessoes)
    .values({
      tokenHash: digerir(token),
      usuarioId,
      expiraEm: new Date(agora.getTime() + VIDA_MAXIMA_MS),
      ultimoUso: agora,
      ip: await ipDoCliente(),
      agente: await agenteDoCliente(),
    })
    .returning({ id: esquema.sessoes.id });

  const jar = await cookies();
  const seguro = process.env.NODE_ENV === "production";

  jar.set(NOME_COOKIE, token, {
    httpOnly: true,
    secure: seguro,
    sameSite: "lax",
    path: "/",
    maxAge: VIDA_MAXIMA_MS / 1000,
  });

  // Token CSRF acompanha a sessão. Legível por JavaScript de propósito:
  // o formulário precisa reenviá-lo no cabeçalho (padrão double submit).
  jar.set(NOME_CSRF, tokenAleatorio(24), {
    httpOnly: false,
    secure: seguro,
    sameSite: "lax",
    path: "/",
    maxAge: VIDA_MAXIMA_MS / 1000,
  });

  await db.update(esquema.usuarios)
    .set({ ultimoAcesso: agora })
    .where(eq(esquema.usuarios.id, usuarioId));

  return linha!.id;
}

/**
 * Lê a sessão atual e renova a janela de ociosidade.
 * Retorna null se não houver sessão válida — nunca lança.
 */
export async function sessaoAtual(): Promise<Sessao | null> {
  const jar = await cookies();
  const token = jar.get(NOME_COOKIE)?.value;
  if (!token) return null;

  const agora = new Date();
  const limiteOcioso = new Date(agora.getTime() - OCIOSIDADE_MS);

  const linhas = await db
    .select({
      sessaoId: esquema.sessoes.id,
      usuarioId: esquema.usuarios.id,
      nome: esquema.usuarios.nome,
      email: esquema.usuarios.email,
      papel: esquema.usuarios.papel,
      ativo: esquema.usuarios.ativo,
      ultimoUso: esquema.sessoes.ultimoUso,
    })
    .from(esquema.sessoes)
    .innerJoin(
      esquema.usuarios,
      eq(esquema.sessoes.usuarioId, esquema.usuarios.id)
    )
    .where(
      and(
        eq(esquema.sessoes.tokenHash, digerir(token)),
        gt(esquema.sessoes.expiraEm, agora),
        gt(esquema.sessoes.ultimoUso, limiteOcioso)
      )
    )
    .limit(1);

  const linha = linhas[0];
  if (!linha || !linha.ativo) return null;

  // Renovação deslizante: só escreve no banco se passaram mais de 5 minutos desde a última atualização.
  if (agora.getTime() - linha.ultimoUso.getTime() > 5 * 60_000) {
    await db
      .update(esquema.sessoes)
      .set({ ultimoUso: agora })
      .where(eq(esquema.sessoes.id, linha.sessaoId));
  }

  return {
    sessaoId: linha.sessaoId,
    usuarioId: linha.usuarioId,
    nome: linha.nome,
    email: linha.email,
    papel: linha.papel,
  };
}

export async function encerrarSessao() {
  const jar = await cookies();
  const token = jar.get(NOME_COOKIE)?.value;
  if (token) {
    await db
      .delete(esquema.sessoes)
      .where(eq(esquema.sessoes.tokenHash, digerir(token)));
  }
  jar.delete(NOME_COOKIE);
  jar.delete(NOME_CSRF);
}

/** Derruba todas as sessões de um usuário — usado na troca de senha. */
export async function encerrarTodasAsSessoes(usuarioId: string) {
  await db
    .delete(esquema.sessoes)
    .where(eq(esquema.sessoes.usuarioId, usuarioId));
}

export async function limparSessoesVencidas() {
  await db.delete(esquema.sessoes).where(lt(esquema.sessoes.expiraEm, new Date()));
}

/* ---------- CSRF ------------------------------------------ */

/**
 * Confere o token CSRF do cabeçalho contra o do cookie.
 * Aplicar em toda rota administrativa que altera estado.
 */
export async function conferirCsrf(req: Request) {
  const jar = await cookies();
  const doCookie = jar.get(NOME_CSRF)?.value;
  const doCabecalho = req.headers.get("x-corz-csrf");
  if (!doCookie || !doCabecalho) return false;
  return iguaisEmTempoConstante(doCookie, doCabecalho);
}

/* ---------- Controle de tentativas ------------------------ */

const LIMITE_POR_EMAIL = 30;
const LIMITE_POR_IP = 15;
const JANELA_MIN = 15;

export async function bloqueadoPorTentativas(email: string, ip: string) {
  const desde = new Date(Date.now() - JANELA_MIN * 60_000);

  const [porEmail] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(esquema.tentativasLogin)
    .where(
      and(
        eq(esquema.tentativasLogin.email, email),
        eq(esquema.tentativasLogin.sucesso, false),
        gt(esquema.tentativasLogin.criadoEm, desde)
      )
    );

  const [porIp] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(esquema.tentativasLogin)
    .where(
      and(
        eq(esquema.tentativasLogin.ip, ip),
        eq(esquema.tentativasLogin.sucesso, false),
        gt(esquema.tentativasLogin.criadoEm, desde)
      )
    );

  const falhasEmail = porEmail?.total ?? 0;
  const falhasIp = porIp?.total ?? 0;

  // Atraso progressivo a partir de 3 falhas para desacelerar scripts de força bruta.
  if (falhasEmail >= 3 || falhasIp >= 3) {
    const espera = Math.min(Math.max(falhasEmail, falhasIp) * 350, 2500);
    await new Promise((resolve) => setTimeout(resolve, espera));
  }

  // Bloqueio efetivo após 15 falhas no mesmo IP ou 30 no mesmo e-mail na janela.
  return falhasIp >= LIMITE_POR_IP || falhasEmail >= LIMITE_POR_EMAIL;
}

export async function registrarTentativa(
  email: string,
  ip: string,
  sucesso: boolean
) {
  await db.insert(esquema.tentativasLogin).values({ email, ip, sucesso });
}

/* ---------- Auditoria ------------------------------------- */

export async function auditar({
  usuarioId,
  acao,
  entidade,
  entidadeId,
  detalhe,
}: {
  usuarioId?: string | null;
  acao: string;
  entidade: string;
  entidadeId?: string | null;
  detalhe?: unknown;
}) {
  await db.insert(esquema.logsAuditoria).values({
    usuarioId: usuarioId ?? null,
    acao,
    entidade,
    entidadeId: entidadeId ?? null,
    detalhe: detalhe ? (detalhe as object) : null,
    ip: await ipDoCliente(),
  });
}

export async function ultimosAuditos(limite = 20) {
  return db
    .select({
      id: esquema.logsAuditoria.id,
      acao: esquema.logsAuditoria.acao,
      entidade: esquema.logsAuditoria.entidade,
      entidadeId: esquema.logsAuditoria.entidadeId,
      criadoEm: esquema.logsAuditoria.criadoEm,
      autor: esquema.usuarios.nome,
    })
    .from(esquema.logsAuditoria)
    .leftJoin(
      esquema.usuarios,
      eq(esquema.logsAuditoria.usuarioId, esquema.usuarios.id)
    )
    .orderBy(desc(esquema.logsAuditoria.criadoEm))
    .limit(limite);
}

/* ---------- Permissões ------------------------------------ */

const HIERARQUIA = { AUTOR: 1, EDITOR: 2, ADMIN: 3 } as const;

export function podeAoMenos(
  papel: Sessao["papel"],
  minimo: Sessao["papel"]
) {
  return HIERARQUIA[papel] >= HIERARQUIA[minimo];
}

/** Uso em Server Components e rotas: garante sessão ou lança. */
export async function exigirSessao(minimo: Sessao["papel"] = "AUTOR") {
  const sessao = await sessaoAtual();
  if (!sessao) throw new Error("NAO_AUTENTICADO");
  if (!podeAoMenos(sessao.papel, minimo)) throw new Error("SEM_PERMISSAO");
  return sessao;
}
