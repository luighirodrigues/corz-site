import type { MetadataRoute } from "next";
import { abs, URL_BASE, INDEXAVEL } from "@/lib/seo";

/**
 * robots.txt
 *
 * Fora do domínio canônico — homologação, prévia, IP cru — o arquivo
 * bloqueia tudo. É a primeira linha de defesa contra um ambiente de
 * teste virar uma cópia indexada do site.
 *
 * No domínio real, a postura é o oposto, e também deliberada: a CORZ
 * *quer* ser citada por assistentes de IA. Ser encontrada quando um
 * diretor pergunta ao ChatGPT "como reduzir parada de loja" vale mais do
 * que proteger texto institucional que já é público. Por isso GPTBot,
 * ClaudeBot, PerplexityBot e afins são liberados explicitamente — e o
 * /llms.txt existe para dar a eles um resumo estruturado.
 */
export default function robots(): MetadataRoute.Robots {
  if (!INDEXAVEL) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
        ],
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/"],
      },
    ],
    sitemap: abs("/sitemap.xml"),
    host: URL_BASE,
  };
}
