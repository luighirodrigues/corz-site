/**
 * Publicação de artigos agendados, direto no banco.
 *
 * Alternativa ao endpoint /api/cron/publicar para quem prefere um cron
 * do sistema em vez de uma chamada HTTP:
 *
 *   a cada 5 minutos:  cd /caminho/do/site && npm run publicar:agendados
 *
 * Idempotente. Se não houver nada vencido, não faz nada.
 */

import "dotenv/config";
import { publicarAgendados } from "../src/lib/artigos";

async function principal() {
  const publicados = await publicarAgendados();

  if (publicados.length === 0) {
    console.log(`[${new Date().toISOString()}] nada a publicar`);
    return;
  }

  for (const artigo of publicados) {
    console.log(
      `[${new Date().toISOString()}] publicado: ${artigo.slug} — ${artigo.titulo}`
    );
  }
}

principal()
  .then(() => process.exit(0))
  .catch((erro) => {
    console.error(erro);
    process.exit(1);
  });
