import { NextResponse, type NextRequest } from "next/server";
import { NOME_COOKIE, INDEXAVEL } from "@/lib/constantes";

/* ------------------------------------------------------------------
   Domínios de medição liberados na política de conteúdo.

   Só entram na política das páginas públicas. O /admin fica com a
   política estrita de nonce e sem nenhum terceiro: é a superfície com
   sessão autenticada, e nenhuma tag de marketing tem o que fazer lá.

   A lista é fechada de propósito. `script-src https:` resolveria em uma
   linha e devolveria justamente o que a CSP existe para tirar — a
   liberdade de um XSS carregar código de qualquer lugar.
   ------------------------------------------------------------------ */
const MEDICAO_SCRIPT = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://connect.facebook.net",
  "https://snap.licdn.com",
];

const MEDICAO_CONEXAO = [
  "https://www.google-analytics.com",
  "https://analytics.google.com",
  "https://region1.google-analytics.com",
  "https://stats.g.doubleclick.net",
  "https://www.googletagmanager.com",
  "https://connect.facebook.net",
  "https://px.ads.linkedin.com",
];

const MEDICAO_QUADRO = [
  "https://td.doubleclick.net",
  "https://www.googletagmanager.com",
];

/**
 * Proxy (antigo middleware)
 *
 * O Next 16.3 renomeou a convenção `middleware` para `proxy`. Mesma
 * função, mesmo momento de execução — roda no servidor antes de a rota
 * ser resolvida.
 *
 * Duas responsabilidades, ambas baratas o bastante para rodar na borda:
 * cabeçalhos de segurança e a barreira de presença no /admin.
 *
 * ---------------------------------------------------------------
 * Sobre a política de scripts (CSP)
 *
 * O Next injeta scripts inline para transportar o estado do servidor
 * até o cliente. Para permitir isso sem abrir 'unsafe-inline', ele
 * precisa de um nonce por requisição — e o nonce só chega até as tags
 * se o middleware devolver a CSP **no cabeçalho da requisição**, não
 * apenas no da resposta.
 *
 * O detalhe importante: usar nonce obriga o Next a renderizar a página
 * a cada requisição, porque o valor muda toda vez. Aplicar isso ao site
 * inteiro custaria a geração estática de todas as páginas públicas.
 *
 * Por isso a política é dividida:
 *
 * - Painel administrativo — nonce + 'strict-dynamic'. É a superfície que guarda
 *   sessão autenticada e onde um XSS teria consequência real. Essas
 *   rotas já são dinâmicas por natureza, então o nonce não custa nada.
 *
 * - **público** — 'self' + 'unsafe-inline', mantendo a geração estática.
 *   O risco aqui é baixo por construção: as páginas são HTML estático e
 *   todo HTML de artigo passa por sanitização com lista de permissões no
 *   servidor antes de ser gravado, o que já elimina script, manipulador
 *   de evento e href javascript: na origem.
 * ---------------------------------------------------------------
 */

export function proxy(req: NextRequest) {
  const caminho = req.nextUrl.pathname;
  const admin = caminho.startsWith("/admin");
  const desenvolvimento = process.env.NODE_ENV !== "production";

  if (admin && caminho !== "/admin/login" && !req.cookies.get(NOME_COOKIE)) {
    const destino = new URL("/admin/login", req.url);
    destino.searchParams.set("proximo", caminho);
    return NextResponse.redirect(destino);
  }

  const nonce = admin
    ? Buffer.from(crypto.randomUUID()).toString("base64")
    : null;

  const politicaDeScript = nonce
    ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${desenvolvimento ? " 'unsafe-eval'" : ""}`
    : `script-src 'self' 'unsafe-inline' ${MEDICAO_SCRIPT.join(" ")}${desenvolvimento ? " 'unsafe-eval'" : ""}`;

  const csp = [
    `default-src 'self'`,
    politicaDeScript,
    // O Next injeta estilos críticos inline; sem 'unsafe-inline' aqui a
    // página renderiza sem CSS. É um risco muito menor que o de script.
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self'${admin ? "" : ` ${MEDICAO_CONEXAO.join(" ")}`}${desenvolvimento ? " ws: wss:" : ""}`,
    `media-src 'self' https:`,
    `frame-src 'self' https://www.youtube-nocookie.com https://www.youtube.com https://open.spotify.com https://player.vimeo.com${admin ? "" : ` ${MEDICAO_QUADRO.join(" ")}`}`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const cabecalhosDaRequisicao = new Headers(req.headers);
  if (nonce) {
    cabecalhosDaRequisicao.set("x-nonce", nonce);
    // É esta linha que faz o Next carimbar o nonce nas próprias tags.
    cabecalhosDaRequisicao.set("Content-Security-Policy", csp);
  }

  const resposta = NextResponse.next({
    request: { headers: cabecalhosDaRequisicao },
  });

  resposta.headers.set("Content-Security-Policy", csp);
  resposta.headers.set("X-Content-Type-Options", "nosniff");
  resposta.headers.set("X-Frame-Options", "DENY");
  resposta.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  resposta.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=()"
  );
  resposta.headers.set("X-DNS-Prefetch-Control", "on");
  resposta.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  // Impede que outra origem embuta este documento como sub-recurso.
  resposta.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  // Cabeçalho antigo, ignorado por navegador atual, mas ainda lido por
  // proxy corporativo e scanner de conformidade. Custa uma linha.
  resposta.headers.set("X-Permitted-Cross-Domain-Policies", "none");

  // Fora do domínio definitivo, nada é indexável — e o cabeçalho é a
  // garantia mais forte que existe: vale para toda resposta, inclusive
  // RSS, imagens e arquivos, onde uma meta tag de HTML não alcança.
  if (!INDEXAVEL) {
    resposta.headers.set(
      "X-Robots-Tag",
      "noindex, nofollow, noarchive, nosnippet, noimageindex"
    );
  }

  if (!desenvolvimento) {
    resposta.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  // O painel nunca deve ser guardado por proxy, cache ou histórico.
  if (admin) {
    resposta.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private"
    );
    resposta.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  }

  return resposta;
}

export const config = {
  matcher: [
    // Tudo, menos arquivos estáticos e otimização de imagem.
    "/((?!_next/static|_next/image|favicon.ico|favicon-32.png|icone-192.png|icone-512.png|icone-maskable.png|apple-touch-icon.png|site.webmanifest|clientes/|marca/).*)",
  ],
};
