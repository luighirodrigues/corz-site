import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, esquema } from "@/db";
import { exigirSessao, podeAoMenos } from "@/lib/auth";
import EditorArtigo from "@/components/admin/EditorArtigo";
import { formatarDataHora, paraCampoDataHora } from "@/lib/cliente";
import BotaoArquivar from "@/components/admin/BotaoArquivar";

export const dynamic = "force-dynamic";
export const metadata = { title: "Editar artigo" };

export default async function EditarArtigo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const sessao = await exigirSessao();
  const { id } = await params;

  const [artigo] = await db
    .select()
    .from(esquema.artigos)
    .where(eq(esquema.artigos.id, id))
    .limit(1);

  if (!artigo) notFound();

  const podeEditar =
    podeAoMenos(sessao.papel, "EDITOR") || artigo.autorId === sessao.usuarioId;
  if (!podeEditar) notFound();

  const [categorias, tags] = await Promise.all([
    db
      .select({ id: esquema.categorias.id, nome: esquema.categorias.nome })
      .from(esquema.categorias)
      .orderBy(esquema.categorias.ordem),
    db
      .select({ nome: esquema.tags.nome })
      .from(esquema.artigosTags)
      .innerJoin(esquema.tags, eq(esquema.artigosTags.tagId, esquema.tags.id))
      .where(eq(esquema.artigosTags.artigoId, id)),
  ]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="rotulo text-petroleo/45">Editando</span>
          <p className="mt-2 font-mono text-[0.6875rem] text-tinta-900/45">
            Criado em {formatarDataHora(artigo.criadoEm)} · última alteração em{" "}
            {formatarDataHora(artigo.atualizadoEm)}
          </p>
        </div>
        {podeAoMenos(sessao.papel, "EDITOR") && artigo.status !== "ARQUIVADO" && (
          <BotaoArquivar id={artigo.id} />
        )}
      </header>

      <EditorArtigo
        categorias={categorias}
        podePublicar={podeAoMenos(sessao.papel, "EDITOR")}
        inicial={{
          id: artigo.id,
          titulo: artigo.titulo,
          slug: artigo.slug,
          subtitulo: artigo.subtitulo ?? "",
          resumo: artigo.resumo,
          conteudo: artigo.conteudo,
          respostaCurta: artigo.respostaCurta ?? "",
          status: artigo.status,
          agendadoPara: paraCampoDataHora(artigo.agendadoPara),
          capaUrl: artigo.capaUrl ?? "",
          capaAlt: artigo.capaAlt ?? "",
          categoriaId: artigo.categoriaId ?? "",
          tags: tags.map((t) => t.nome),
          destaque: artigo.destaque,
          seoTitulo: artigo.seoTitulo ?? "",
          seoDescricao: artigo.seoDescricao ?? "",
          seoImagem: artigo.seoImagem ?? "",
          canonical: artigo.canonical ?? "",
          noindex: artigo.noindex,
          faq: artigo.faq ?? [],
        }}
      />
    </div>
  );
}
