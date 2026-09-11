import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, esquema } from "@/db";
import { esquemaArtigo, errosDe } from "@/lib/validacao";
import { respostaJson } from "@/lib/requisicao";
import {
  auditar,
  conferirCsrf,
  podeAoMenos,
  sessaoAtual,
} from "@/lib/auth";
import {
  gerarSlug,
  minutosDeLeitura,
  paraTextoPuro,
  sanitizar,
  slugDisponivel,
} from "@/lib/artigos";
import type { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function garantirTags(nomes: string[]) {
  const ids: string[] = [];
  for (const nome of nomes) {
    const slug = gerarSlug(nome);
    if (!slug) continue;
    const [existente] = await db
      .select({ id: esquema.tags.id })
      .from(esquema.tags)
      .where(eq(esquema.tags.slug, slug))
      .limit(1);
    if (existente) {
      ids.push(existente.id);
      continue;
    }
    const [nova] = await db
      .insert(esquema.tags)
      .values({ slug, nome: nome.trim() })
      .returning({ id: esquema.tags.id });
    if (nova) ids.push(nova.id);
  }
  return ids;
}

/**
 * Resolve as datas conforme o status escolhido.
 *
 * Regra que evita o erro mais comum de painel editorial: escolher
 * "agendado" e esquecer a data, ou marcar "publicado" com data futura.
 */
function resolverDatas(
  status: string,
  agendadoPara: string | undefined,
  publicadoEmAtual: Date | null
) {
  if (status === "AGENDADO") {
    if (!agendadoPara) return { erro: "Informe a data e a hora da publicação." };
    const quando = new Date(agendadoPara);
    if (Number.isNaN(quando.getTime())) return { erro: "Data inválida." };
    if (quando.getTime() <= Date.now()) {
      return {
        erro: "A data de agendamento precisa estar no futuro. Para publicar agora, use o status Publicado.",
      };
    }
    return { agendadoPara: quando, publicadoEm: null };
  }

  if (status === "PUBLICADO") {
    return {
      agendadoPara: null,
      publicadoEm: publicadoEmAtual ?? new Date(),
    };
  }

  return { agendadoPara: null, publicadoEm: publicadoEmAtual };
}

export async function POST(req: Request) {
  const sessao = await sessaoAtual();
  if (!sessao) return respostaJson({ ok: false, erro: "Não autenticado." }, 401);
  if (!(await conferirCsrf(req)))
    return respostaJson({ ok: false, erro: "Token de sessão inválido." }, 403);

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return respostaJson({ ok: false, erro: "Requisição inválida." }, 400);
  }

  const analise = esquemaArtigo.safeParse(corpo);
  if (!analise.success)
    return respostaJson(
      { ok: false, erros: errosDe(analise.error as z.ZodError) },
      422
    );

  const d = analise.data;

  // Autor não publica sozinho — só editor e admin podem colocar no ar.
  const statusPedido =
    d.status !== "RASCUNHO" && !podeAoMenos(sessao.papel, "EDITOR")
      ? "RASCUNHO"
      : d.status;

  const datas = resolverDatas(statusPedido, d.agendadoPara || undefined, null);
  if ("erro" in datas) return respostaJson({ ok: false, erro: datas.erro }, 422);

  const conteudo = sanitizar(d.conteudo);
  const textoPuro = paraTextoPuro(conteudo);
  const slug = await slugDisponivel(d.slug || gerarSlug(d.titulo));

  const [artigo] = await db
    .insert(esquema.artigos)
    .values({
      slug,
      titulo: d.titulo,
      subtitulo: d.subtitulo,
      resumo: d.resumo,
      conteudo,
      textoPuro,
      respostaCurta: d.respostaCurta || null,
      status: statusPedido,
      capaUrl: d.capaUrl || null,
      capaAlt: d.capaAlt || null,
      categoriaId: d.categoriaId || null,
      destaque: d.destaque,
      tempoLeitura: minutosDeLeitura(textoPuro),
      seoTitulo: d.seoTitulo || null,
      seoDescricao: d.seoDescricao || null,
      seoImagem: d.seoImagem || null,
      canonical: d.canonical || null,
      noindex: d.noindex,
      faq: d.faq.length ? d.faq : null,
      autorId: sessao.usuarioId,
      agendadoPara: datas.agendadoPara,
      publicadoEm: datas.publicadoEm,
    })
    .returning({ id: esquema.artigos.id, slug: esquema.artigos.slug });

  if (d.tags.length && artigo) {
    const tagIds = await garantirTags(d.tags);
    if (tagIds.length) {
      await db
        .insert(esquema.artigosTags)
        .values(tagIds.map((tagId) => ({ artigoId: artigo.id, tagId })));
    }
  }

  await auditar({
    usuarioId: sessao.usuarioId,
    acao: "criar_artigo",
    entidade: "artigo",
    entidadeId: artigo!.id,
    detalhe: { titulo: d.titulo, status: statusPedido },
  });

  revalidatePath("/blog");

  return respostaJson({ ok: true, id: artigo!.id, slug: artigo!.slug }, 201);
}

export async function PUT(req: Request) {
  const sessao = await sessaoAtual();
  if (!sessao) return respostaJson({ ok: false, erro: "Não autenticado." }, 401);
  if (!(await conferirCsrf(req)))
    return respostaJson({ ok: false, erro: "Token de sessão inválido." }, 403);

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return respostaJson({ ok: false, erro: "Requisição inválida." }, 400);
  }

  const { id, ...resto } = (corpo ?? {}) as { id?: string };
  if (!id) return respostaJson({ ok: false, erro: "Artigo não informado." }, 400);

  const analise = esquemaArtigo.safeParse(resto);
  if (!analise.success)
    return respostaJson(
      { ok: false, erros: errosDe(analise.error as z.ZodError) },
      422
    );

  const [atual] = await db
    .select()
    .from(esquema.artigos)
    .where(eq(esquema.artigos.id, id))
    .limit(1);

  if (!atual)
    return respostaJson({ ok: false, erro: "Artigo não encontrado." }, 404);

  // Autor só mexe no que é dele.
  if (!podeAoMenos(sessao.papel, "EDITOR") && atual.autorId !== sessao.usuarioId) {
    return respostaJson(
      { ok: false, erro: "Você só pode editar os próprios artigos." },
      403
    );
  }

  const d = analise.data;
  const statusPedido =
    d.status !== "RASCUNHO" && !podeAoMenos(sessao.papel, "EDITOR")
      ? atual.status
      : d.status;

  const datas = resolverDatas(
    statusPedido,
    d.agendadoPara || undefined,
    atual.publicadoEm
  );
  if ("erro" in datas) return respostaJson({ ok: false, erro: datas.erro }, 422);

  const conteudo = sanitizar(d.conteudo);
  const textoPuro = paraTextoPuro(conteudo);
  const slug = await slugDisponivel(d.slug || gerarSlug(d.titulo), id);

  await db
    .update(esquema.artigos)
    .set({
      slug,
      titulo: d.titulo,
      subtitulo: d.subtitulo,
      resumo: d.resumo,
      conteudo,
      textoPuro,
      respostaCurta: d.respostaCurta || null,
      status: statusPedido,
      capaUrl: d.capaUrl || null,
      capaAlt: d.capaAlt || null,
      categoriaId: d.categoriaId || null,
      destaque: d.destaque,
      tempoLeitura: minutosDeLeitura(textoPuro),
      seoTitulo: d.seoTitulo || null,
      seoDescricao: d.seoDescricao || null,
      seoImagem: d.seoImagem || null,
      canonical: d.canonical || null,
      noindex: d.noindex,
      faq: d.faq.length ? d.faq : null,
      agendadoPara: datas.agendadoPara,
      publicadoEm: datas.publicadoEm,
      revisadoEm: new Date(),
      atualizadoEm: new Date(),
    })
    .where(eq(esquema.artigos.id, id));

  await db.delete(esquema.artigosTags).where(eq(esquema.artigosTags.artigoId, id));
  if (d.tags.length) {
    const tagIds = await garantirTags(d.tags);
    if (tagIds.length) {
      await db
        .insert(esquema.artigosTags)
        .values(tagIds.map((tagId) => ({ artigoId: id, tagId })));
    }
  }

  await auditar({
    usuarioId: sessao.usuarioId,
    acao: "editar_artigo",
    entidade: "artigo",
    entidadeId: id,
    detalhe: { titulo: d.titulo, status: statusPedido },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (atual.slug !== slug) revalidatePath(`/blog/${atual.slug}`);

  return respostaJson({ ok: true, slug });
}

export async function DELETE(req: Request) {
  const sessao = await sessaoAtual();
  if (!sessao) return respostaJson({ ok: false, erro: "Não autenticado." }, 401);
  if (!podeAoMenos(sessao.papel, "EDITOR"))
    return respostaJson({ ok: false, erro: "Sem permissão." }, 403);
  if (!(await conferirCsrf(req)))
    return respostaJson({ ok: false, erro: "Token de sessão inválido." }, 403);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return respostaJson({ ok: false, erro: "Artigo não informado." }, 400);

  const [artigo] = await db
    .select({ slug: esquema.artigos.slug, titulo: esquema.artigos.titulo })
    .from(esquema.artigos)
    .where(eq(esquema.artigos.id, id))
    .limit(1);

  if (!artigo)
    return respostaJson({ ok: false, erro: "Artigo não encontrado." }, 404);

  // Arquivar em vez de apagar: o endereço continua existindo para quem
  // já linkou, e nada se perde por clique errado.
  await db
    .update(esquema.artigos)
    .set({ status: "ARQUIVADO", atualizadoEm: new Date() })
    .where(eq(esquema.artigos.id, id));

  await auditar({
    usuarioId: sessao.usuarioId,
    acao: "arquivar_artigo",
    entidade: "artigo",
    entidadeId: id,
    detalhe: { titulo: artigo.titulo },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${artigo.slug}`);

  return respostaJson({ ok: true });
}
