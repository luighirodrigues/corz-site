import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as esquema from "./esquema";

/**
 * Conexão com o banco — criada sob demanda, nunca na importação.
 *
 * Isto não é preciosismo: durante `next build`, o Next avalia todos os
 * módulos das rotas para descobrir a configuração de cada uma. Se a
 * conexão fosse montada no topo do arquivo, compilar o site exigiria um
 * banco de dados no ar — o que é absurdo, porque compilar não consulta
 * nada. Servidor de implantação sem `DATABASE_URL` reprovaria o build
 * mesmo com tudo correto.
 *
 * Com a inicialização adiada, o endereço do banco só é exigido na
 * primeira consulta de verdade, já em execução.
 *
 * O cliente também é guardado no escopo global em desenvolvimento: o
 * Next recarrega módulos a cada alteração, e sem isso cada recarga
 * abriria um pool novo até esgotar as conexões do Postgres.
 */

declare global {
  var __clientePg: ReturnType<typeof postgres> | undefined;
  var __drizzle: DrizzlePostgres | undefined;
}

type DrizzlePostgres = ReturnType<typeof criarInstancia>;

function criarInstancia() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL não está definida. Em desenvolvimento, copie .env.example " +
        "para .env e preencha. Em produção, defina a variável de ambiente no " +
        "painel da hospedagem ou no arquivo .env do servidor."
    );
  }

  const cliente =
    globalThis.__clientePg ??
    postgres(url, {
      max: process.env.NODE_ENV === "production" ? 10 : 3,
      idle_timeout: 20,
      connect_timeout: 10,
      prepare: false,
    });

  if (process.env.NODE_ENV !== "production") globalThis.__clientePg = cliente;

  return drizzle(cliente, { schema: esquema, casing: "snake_case" });
}

function obterDb(): DrizzlePostgres {
  if (!globalThis.__drizzle) globalThis.__drizzle = criarInstancia();
  return globalThis.__drizzle;
}

/**
 * `db` se comporta exatamente como a instância do Drizzle, mas só a
 * constrói no primeiro acesso a uma propriedade. Métodos são vinculados
 * à instância real para que o `this` interno da biblioteca continue
 * apontando para o objeto certo, e não para o intermediário.
 */
export const db = new Proxy({} as DrizzlePostgres, {
  get(_alvo, propriedade) {
    const real = obterDb() as unknown as Record<string | symbol, unknown>;
    const valor = real[propriedade];
    return typeof valor === "function" ? valor.bind(real) : valor;
  },
  has(_alvo, propriedade) {
    return propriedade in (obterDb() as object);
  },
});

export { esquema };
