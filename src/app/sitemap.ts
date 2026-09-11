import type { MetadataRoute } from "next";
import { solucoes } from "@/conteudo/solucoes";
import { listarPublicados, listarCategorias } from "@/lib/artigos";
import { abs, INDEXAVEL } from "@/lib/seo";
import { rotaOculta } from "@/lib/visibilidade";

export const revalidate = 3600;

/**
 * Sitemap.
 *
 * `priority` e `changeFrequency` são dicas fracas — o Google já disse
 * que basicamente as ignora. O que importa aqui é a lista estar completa
 * e o `lastModified` ser honesto: data mentida faz o rastreador
 * desconfiar do arquivo inteiro.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fora do domínio canônico não existe sitemap. Um ambiente de teste
  // não deve nem sugerir ao rastreador o que visitar.
  if (!INDEXAVEL) return [];

  const agora = new Date();

  const institucionais = [
    { caminho: "/", prioridade: 1 },
    { caminho: "/solucoes", prioridade: 0.9 },
    { caminho: "/sobre", prioridade: 0.8 },
    { caminho: "/sobre/equipe", prioridade: 0.5 },
    { caminho: "/sobre/carreiras", prioridade: 0.5 },
    { caminho: "/sobre/imprensa", prioridade: 0.4 },
    { caminho: "/suporte", prioridade: 0.7 },
    { caminho: "/suporte/abrir-chamado", prioridade: 0.6 },
    { caminho: "/suporte/faq", prioridade: 0.7 },
    { caminho: "/blog", prioridade: 0.8 },
    { caminho: "/podcast", prioridade: 0.5 },
    { caminho: "/contato", prioridade: 0.8 },
    { caminho: "/legal", prioridade: 0.2 },
    { caminho: "/legal/privacidade", prioridade: 0.3 },
    { caminho: "/legal/termos", prioridade: 0.2 },
    { caminho: "/legal/cookies", prioridade: 0.2 },
  ]
    // Rota fora do ar não entra no mapa: seria a única pista de que
    // existe, justamente para quem mais repara.
    .filter((p) => !rotaOculta(p.caminho))
    .map((p) => ({
    url: abs(p.caminho),
    lastModified: agora,
    changeFrequency: "monthly" as const,
    priority: p.prioridade,
  }));

  const paginasSolucoes = solucoes.map((s) => ({
    url: abs(`/solucoes/${s.slug}`),
    lastModified: agora,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  let artigos: MetadataRoute.Sitemap = [];
  let categorias: MetadataRoute.Sitemap = [];

  // O blog está fora do ar: nem artigo nem categoria são consultados.
  if (!rotaOculta("/blog")) try {
    const [lista, cats] = await Promise.all([
      listarPublicados({ limite: 1000 }),
      listarCategorias(),
    ]);

    artigos = lista
      .filter((a) => a.publicadoEm || a.agendadoPara)
      .map((a) => ({
        url: abs(`/blog/${a.slug}`),
        lastModified: a.atualizadoEm ?? a.publicadoEm ?? agora,
        changeFrequency: "yearly" as const,
        priority: 0.7,
      }));

    categorias = cats
      .filter((c) => c.total > 0)
      .map((c) => ({
        url: abs(`/blog?categoria=${c.slug}`),
        lastModified: agora,
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }));
  } catch {
    // Sem banco disponível no momento da geração, o sitemap ainda sai
    // com as páginas estáticas em vez de falhar por completo.
  }

  return [...institucionais, ...paginasSolucoes, ...categorias, ...artigos];
}
