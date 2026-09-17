import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("ERRO: DATABASE_URL não está definida no ambiente.");
  process.exit(1);
}

const client = postgres(url, { max: 1 });

async function migrar() {
  console.log("Conectando ao banco de dados...");

  // Tabela de controle de migrações
  await client`
    CREATE TABLE IF NOT EXISTS "__migracoes" (
      id serial PRIMARY KEY,
      nome text NOT NULL UNIQUE,
      aplicado_em timestamp with time zone DEFAULT now() NOT NULL
    );
  `;

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const pastaDrizzle = path.resolve(__dirname, "../drizzle");
  const arquivos = fs
    .readdirSync(pastaDrizzle)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  for (const arquivo of arquivos) {
    const jaAplicado = await client`
      SELECT id FROM "__migracoes" WHERE nome = ${arquivo} LIMIT 1;
    `;
    if (jaAplicado.length > 0) {
      console.log(`· ${arquivo} (já aplicado)`);
      continue;
    }

    console.log(`Aplicando ${arquivo}...`);
    const conteudo = fs.readFileSync(path.join(pastaDrizzle, arquivo), "utf-8");
    const instrucoes = conteudo
      .split("--> statement-breakpoint")
      .map((s) => s.trim())
      .filter(Boolean);

    await client.begin(async (tx) => {
      for (const sql of instrucoes) {
        await tx.unsafe(sql);
      }
      await tx`
        INSERT INTO "__migracoes" (nome) VALUES (${arquivo});
      `;
    });

    console.log(`✓ ${arquivo} aplicado com sucesso!`);
  }

  console.log("\nTodas as tabelas foram criadas e estão prontas!");
  await client.end();
}

migrar().catch(async (err) => {
  console.error("Falha ao migrar banco:", err);
  await client.end();
  process.exit(1);
});
