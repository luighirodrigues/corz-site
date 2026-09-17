import { randomBytes, randomUUID } from "node:crypto";
import { hash } from "@node-rs/argon2";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("ERRO: DATABASE_URL não está definida no ambiente.");
  process.exit(1);
}

const client = postgres(url, { max: 1 });

const PARAMETROS_ARGON2 = {
  memoryCost: 19_456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
};

function gerarSenha() {
  const alfabeto =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*";
  const bytes = randomBytes(20);
  return Array.from(bytes, (b) => alfabeto[b % alfabeto.length]).join("");
}

async function criar(nome, email, papel) {
  if (!nome || !email) {
    console.error('Uso: node scripts/usuario.mjs criar "Nome Completo" email@corz.com.br [ADMIN|EDITOR|AUTOR]');
    process.exit(1);
  }
  const papelValido = ["ADMIN", "EDITOR", "AUTOR"].includes(papel)
    ? papel
    : "AUTOR";

  const senha = gerarSenha();
  const senhaHash = await hash(senha, PARAMETROS_ARGON2);
  const id = randomUUID();

  const [usuario] = await client`
    INSERT INTO "usuarios" (id, nome, email, senha_hash, papel)
    VALUES (${id}, ${nome}, ${email.toLowerCase()}, ${senhaHash}, ${papelValido})
    RETURNING id;
  `;

  console.log("\n  Conta criada com sucesso.\n");
  console.log(`  Nome   : ${nome}`);
  console.log(`  E-mail : ${email}`);
  console.log(`  Papel  : ${papelValido}`);
  console.log(`  Senha  : ${senha}`);
  console.log(`  ID     : ${usuario.id}\n`);
  console.log("  Guarde a senha com segurança e ative o 2FA no primeiro acesso ao painel (/admin).\n");
}

async function trocarSenha(email) {
  if (!email) {
    console.error("Uso: node scripts/usuario.mjs senha email@corz.com.br");
    process.exit(1);
  }
  const senha = gerarSenha();
  const senhaHash = await hash(senha, PARAMETROS_ARGON2);

  const resultado = await client`
    UPDATE "usuarios"
    SET senha_hash = ${senhaHash}, senha_alterada_em = now(), atualizado_em = now()
    WHERE email = ${email.toLowerCase()}
    RETURNING id;
  `;

  if (resultado.length === 0) {
    console.error("  Usuário não encontrado.");
    process.exit(1);
  }

  await client`
    DELETE FROM "sessoes" WHERE usuario_id = ${resultado[0].id};
  `;

  console.log(`\n  Nova senha de ${email}: ${senha}`);
  console.log("  Todas as sessões ativas foram encerradas.\n");
}

async function desativar(email) {
  if (!email) {
    console.error("Uso: node scripts/usuario.mjs desativar email@corz.com.br");
    process.exit(1);
  }
  const resultado = await client`
    UPDATE "usuarios"
    SET ativo = false, atualizado_em = now()
    WHERE email = ${email.toLowerCase()}
    RETURNING id;
  `;

  if (resultado.length === 0) {
    console.error("  Usuário não encontrado.");
    process.exit(1);
  }

  await client`
    DELETE FROM "sessoes" WHERE usuario_id = ${resultado[0].id};
  `;

  console.log(`\n  ${email} foi desativado e suas sessões foram encerradas.\n`);
}

async function listar() {
  const usuarios = await client`
    SELECT nome, email, papel, ativo, dois_fatores
    FROM "usuarios"
    ORDER BY criado_em ASC;
  `;

  console.log("\n  Usuários cadastrados:");
  if (usuarios.length === 0) {
    console.log("  (nenhum usuário encontrado)");
  }
  for (const u of usuarios) {
    console.log(
      `  ${u.ativo ? "●" : "○"} ${u.email.padEnd(34)} ${u.papel.padEnd(7)} ${
        u.dois_fatores ? "2FA" : "   "
      }  ${u.nome}`
    );
  }
  console.log("");
}

const [comando, ...args] = process.argv.slice(2);
const acoes = {
  criar: () => criar(args[0], args[1], args[2]),
  senha: () => trocarSenha(args[0]),
  desativar: () => desativar(args[0]),
  listar,
};

const acao = acoes[comando];
if (!acao) {
  console.log(`
  Uso:
    node scripts/usuario.mjs criar "Nome Completo" email@corz.com.br ADMIN
    node scripts/usuario.mjs senha email@corz.com.br
    node scripts/usuario.mjs desativar email@corz.com.br
    node scripts/usuario.mjs listar
`);
  await client.end();
  process.exit(1);
}

try {
  await acao();
} catch (err) {
  console.error("Erro na execução:", err);
  process.exit(1);
} finally {
  await client.end();
}
