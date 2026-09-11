import { listarPublicados } from "@/lib/artigos";
import { abs, URL_BASE } from "@/lib/seo";
import { site } from "@/conteudo/site";
import { rotaOculta } from "@/lib/visibilidade";

export const revalidate = 900;

function escapar(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  // O blog está fora do ar. Sem isto, o feed continuaria entregando os
  // artigos e denunciando uma área que não deveria aparecer.
  if (rotaOculta("/blog")) {
    return new Response("Not found", { status: 404 });
  }

  let artigos: Awaited<ReturnType<typeof listarPublicados>> = [];
  try {
    artigos = await listarPublicados({ limite: 50 });
  } catch {
    /* sem banco, devolvemos um feed vazio e válido */
  }

  const itens = artigos
    .map((a) => {
      const data = a.publicadoEm ?? a.agendadoPara;
      return `    <item>
      <title>${escapar(a.titulo)}</title>
      <link>${abs(`/blog/${a.slug}`)}</link>
      <guid isPermaLink="true">${abs(`/blog/${a.slug}`)}</guid>
      <description>${escapar(a.resumo)}</description>
      <pubDate>${data ? new Date(data).toUTCString() : ""}</pubDate>
      ${a.autorNome ? `<dc:creator>${escapar(a.autorNome)}</dc:creator>` : ""}
      ${a.categoriaNome ? `<category>${escapar(a.categoriaNome)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Blog da ${escapar(site.nomeCompleto)}</title>
    <link>${abs("/blog")}</link>
    <description>Continuidade operacional na prática: disponibilidade, redes multiunidades, segurança e custo de parada.</description>
    <language>pt-BR</language>
    <copyright>© ${new Date().getFullYear()} ${escapar(site.razaoSocial)}</copyright>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${abs("/blog/rss.xml")}" rel="self" type="application/rss+xml"/>
    <image>
      <url>${URL_BASE}/marca/corz-simbolo.png</url>
      <title>${escapar(site.nomeCompleto)}</title>
      <link>${abs("/blog")}</link>
    </image>
${itens}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=900, stale-while-revalidate=86400",
    },
  });
}
