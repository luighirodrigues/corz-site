/**
 * Criação e manutenção de contas do painel — pela linha de comando.
 *
 * Não existe rota web capaz de criar um administrador. Isso é
 * deliberado: a criação de conta privilegiada exige acesso ao servidor,
 * não apenas uma senha vazada.
 *
 *   npm run usuario -- criar "Nome" email@corz.com.br ADMIN
 *   npm run usuario -- senha email@corz.com.br
 *   npm run usuario -- desativar email@corz.com.br
 *   npm run usuario -- listar
 */

import "dotenv/config";
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { hash } from "@node-rs/argon2";
import { db, esquema } from "../src/db";

const PARAMETROS = {
  memoryCost: 19_456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

/** Senha inicial forte, entregue uma única vez pelo terminal. */
function gerarSenha() {
  const alfabeto =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
  const bytes = randomBytes(20);
  return Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join("");
}

async function criar(nome: string, email: string, papel: string) {
  const papelValido = ["ADMIN", "EDITOR", "AUTOR"].includes(papel)
    ? (papel as "ADMIN" | "EDITOR" | "AUTOR")
    : "AUTOR";

  const senha = gerarSenha();

  const [usuario] = await db
    .insert(esquema.usuarios)
    .values({
      nome,
      email: email.toLowerCase(),
      senhaHash: await hash(senha, PARAMETROS),
      papel: papelValido,
    })
    .returning({ id: esquema.usuarios.id });

  console.log("\n  Conta criada.\n");
  console.log(`  Nome   : ${nome}`);
  console.log(`  E-mail : ${email}`);
  console.log(`  Papel  : ${papelValido}`);
  console.log(`  Senha  : ${senha}`);
  console.log(`  ID     : ${usuario!.id}\n`);
  console.log("  Entregue a senha por canal seguro e ative o 2FA no primeiro acesso.\n");
}

async function trocarSenha(email: string) {
  const senha = gerarSenha();
  const resultado = await db
    .update(esquema.usuarios)
    .set({
      senhaHash: await hash(senha, PARAMETROS),
      senhaAlteradaEm: new Date(),
      atualizadoEm: new Date(),
    })
    .where(eq(esquema.usuarios.email, email.toLowerCase()))
    .returning({ id: esquema.usuarios.id });

  if (resultado.length === 0) {
    console.error("  Usuário não encontrado.");
    process.exit(1);
  }

  // Trocar a senha invalida tudo que estava aberto.
  await db
    .delete(esquema.sessoes)
    .where(eq(esquema.sessoes.usuarioId, resultado[0]!.id));

  console.log(`\n  Nova senha de ${email}: ${senha}`);
  console.log("  Todas as sessões abertas foram encerradas.\n");
}

async function desativar(email: string) {
  const resultado = await db
    .update(esquema.usuarios)
    .set({ ativo: false, atualizadoEm: new Date() })
    .where(eq(esquema.usuarios.email, email.toLowerCase()))
    .returning({ id: esquema.usuarios.id });

  if (resultado.length === 0) {
    console.error("  Usuário não encontrado.");
    process.exit(1);
  }

  await db
    .delete(esquema.sessoes)
    .where(eq(esquema.sessoes.usuarioId, resultado[0]!.id));

  console.log(`\n  ${email} desativado e sessões encerradas.\n`);
}

async function listar() {
  const usuarios = await db
    .select({
      nome: esquema.usuarios.nome,
      email: esquema.usuarios.email,
      papel: esquema.usuarios.papel,
      ativo: esquema.usuarios.ativo,
      doisFatores: esquema.usuarios.doisFatores,
    })
    .from(esquema.usuarios);

  console.log("");
  for (const u of usuarios) {
    console.log(
      `  ${u.ativo ? "●" : "○"} ${u.email.padEnd(34)} ${u.papel.padEnd(7)} ${
        u.doisFatores ? "2FA" : "   "
      }  ${u.nome}`
    );
  }
  console.log("");
}

const [comando, ...argumentos] = process.argv.slice(2);

const acoes: Record<string, () => Promise<void>> = {
  criar: () => criar(argumentos[0]!, argumentos[1]!, argumentos[2] ?? "AUTOR"),
  senha: () => trocarSenha(argumentos[0]!),
  desativar: () => desativar(argumentos[0]!),
  listar,
};

const acao = acoes[comando ?? ""];

if (!acao) {
  console.log(`
  Uso:
    npm run usuario -- criar "Nome Completo" email@corz.com.br ADMIN
    npm run usuario -- senha email@corz.com.br
    npm run usuario -- desativar email@corz.com.br
    npm run usuario -- listar
`);
  process.exit(1);
}

acao()
  .then(() => process.exit(0))
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
