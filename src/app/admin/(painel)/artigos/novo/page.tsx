import { db, esquema } from "@/db";
import { exigirSessao, podeAoMenos } from "@/lib/auth";
import EditorArtigo from "@/components/admin/EditorArtigo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Novo artigo" };

export default async function NovoArtigo() {
  const sessao = await exigirSessao();

  const categorias = await db
    .select({ id: esquema.categorias.id, nome: esquema.categorias.nome })
    .from(esquema.categorias)
    .orderBy(esquema.categorias.ordem);

  return (
    <div className="space-y-8">
      <header>
        <span className="rotulo text-petroleo/45">Novo artigo</span>
      </header>
      <EditorArtigo
        categorias={categorias}
        podePublicar={podeAoMenos(sessao.papel, "EDITOR")}
      />
    </div>
  );
}
