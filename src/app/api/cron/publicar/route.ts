import { revalidatePath } from "next/cache";
import { publicarAgendados } from "@/lib/artigos";
import { respostaJson } from "@/lib/requisicao";
import { iguaisEmTempoConstante } from "@/lib/cifra";
import { auditar } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Publicação de artigos agendados.
 *
 * Chamar periodicamente (a cada 5 minutos é suficiente) com o cabeçalho
 * `Authorization: Bearer $CRON_SEGREDO`. Funciona igual com o cron da
 * Vercel, um cron do sistema com curl, ou um agendador externo.
 *
 * Vale registrar: o blog público não depende deste endpoint para exibir
 * o artigo na hora certa — a consulta pública já considera artigos
 * AGENDADOS cuja hora chegou. Este endpoint apenas normaliza o estado
 * no banco e revalida o cache das páginas estáticas.
 */
export async function GET(req: Request) {
  const segredo = process.env.CRON_SEGREDO;
  if (!segredo) {
    return respostaJson({ ok: false, erro: "CRON_SEGREDO não configurado." }, 500);
  }

  const cabecalho = req.headers.get("authorization") ?? "";
  const token = cabecalho.startsWith("Bearer ") ? cabecalho.slice(7) : "";

  if (!token || !iguaisEmTempoConstante(token, segredo)) {
    return respostaJson({ ok: false, erro: "Não autorizado." }, 401);
  }

  const publicados = await publicarAgendados();

  if (publicados.length > 0) {
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath("/sitemap.xml");
    for (const artigo of publicados) {
      await auditar({
        acao: "publicar_agendado",
        entidade: "artigo",
        entidadeId: artigo.id,
        detalhe: { slug: artigo.slug, titulo: artigo.titulo },
      });
    }
  }

  return respostaJson({
    ok: true,
    publicados: publicados.length,
    itens: publicados.map((a) => a.slug),
  });
}
