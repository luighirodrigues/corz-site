import type { NextConfig } from "next";

/* ------------------------------------------------------------------
   Aviso de ambiente

   `NEXT_PUBLIC_SITE_URL` é embutida no código durante a compilação, não
   lida em execução. Isso significa que a decisão "este site pode ser
   indexado?" é tomada aqui, no build — e trocar a variável depois, no
   servidor, não muda nada.

   Como é uma decisão silenciosa de consequência cara nos dois sentidos
   (homologação indexada vira cópia concorrente; produção compilada como
   homologação nunca aparece no Google), ela é anunciada em voz alta no
   próprio terminal, no momento em que acontece.
   ------------------------------------------------------------------ */
const urlDoSite = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://corz.com.br"
).replace(/\/$/, "");

const indexavel = urlDoSite.includes("corz.com.br");

console.log(
  indexavel
    ? `\n  ● PRODUÇÃO — ${urlDoSite}\n    O site será indexado por buscadores.\n`
    : `\n  ▲ HOMOLOGAÇÃO — ${urlDoSite}\n` +
        `    Bloqueado para buscadores: noindex, robots negando tudo, sitemap vazio.\n` +
        `    Para publicar de verdade, compile com NEXT_PUBLIC_SITE_URL=https://corz.com.br\n`
);

const nextConfig: NextConfig = {
  /**
   * Empacota o servidor com apenas as dependências que ele realmente usa.
   * A imagem final fica em torno de 200 MB em vez de 1 GB — importante em
   * VPS de entrada, onde disco e memória são o recurso escasso.
   */
  output: "standalone",

  poweredByHeader: false,

  // Barra final consistente evita conteúdo duplicado aos olhos do Google.
  trailingSlash: false,

  images: {
    formats: ["image/avif", "image/webp"],
    // Domínios autorizados para capa de artigo hospedada fora.
    // Lista de permissões: qualquer host novo precisa entrar aqui, senão
    // o Next recusa otimizar a imagem — é o que impede o site de virar
    // proxy de imagem para terceiros.
    remotePatterns: [
      { protocol: "https", hostname: "**.corz.com.br" },
      { protocol: "https", hostname: "**.agenciafleck.com.br" },
    ],
    /**
     * Imagens locais.
     *
     * A regra geral não aceita busca: sem isso qualquer um poderia
     * pedir `/foto.png?1`, `?2`, `?3` e encher o cache do otimizador
     * com variantes da mesma imagem.
     *
     * A exceção é `?v=2` em `/clientes/`. Dois logotipos foram
     * recolorados sem mudar de nome, e tanto o cache do otimizador
     * quanto o do navegador guardam a versão antiga por muito tempo —
     * uma publicação nova, sozinha, continua servindo a imagem velha.
     * O sufixo troca a chave dos dois caches de uma vez. Ele é exato,
     * e não um curinga, justamente para não reabrir o problema acima.
     */
    localPatterns: [
      { pathname: "/**", search: "" },
      { pathname: "/clientes/**", search: "?v=2" },
    ],
  },

  /**
   * Endereços antigos de solução.
   *
   * Três páginas deixaram de existir por si: "Segurança" virou
   * "Cibersegurança", "Elo entre telecom e TI" foi incorporada a
   * "Conectividade e telecom" e "Desenvolvimento de sistemas" a
   * "Laboratório e desenvolvimento".
   *
   * O redirecionamento é permanente de propósito: assim o buscador
   * transfere a autoridade acumulada para o endereço novo em vez de
   * tratar o antigo como página morta. Quem tiver o link salvo também
   * chega ao lugar certo.
   */
  async redirects() {
    return [
      // As seis frentes antigas viraram quatro. Cada endereço aponta
      // para a frente que absorveu o assunto, de forma permanente: é o
      // que transfere ao endereço novo a autoridade já acumulada, em
      // vez de deixar o buscador tratando o antigo como página morta.
      {
        source: "/solucoes/conectividade",
        destination: "/solucoes/conectividade-redes",
        permanent: true,
      },
      {
        source: "/solucoes/redes",
        destination: "/solucoes/conectividade-redes",
        permanent: true,
      },
      {
        source: "/solucoes/telecom",
        destination: "/solucoes/conectividade-redes",
        permanent: true,
      },
      {
        source: "/solucoes/servidores",
        destination: "/solucoes/cloud-datacenter",
        permanent: true,
      },
      // PABX em nuvem deixou de ser uma frente e virou uma capacidade
      // dentro de Modern Workplace, junto com o resto do que o usuário
      // final toca no dia a dia.
      {
        source: "/solucoes/pabx-em-nuvem",
        destination: "/solucoes/modern-workplace",
        permanent: true,
      },
      {
        source: "/solucoes/laboratorio",
        destination: "/solucoes/modern-workplace",
        permanent: true,
      },
      {
        source: "/solucoes/desenvolvimento",
        destination: "/solucoes/modern-workplace",
        permanent: true,
      },
      {
        source: "/solucoes/seguranca",
        destination: "/solucoes/ciberseguranca",
        permanent: true,
      },
    ];
  },

  experimental: {
    // Comprime a resposta no próprio Node quando não há proxy fazendo isso.
    optimizePackageImports: ["clsx", "date-fns"],
  },
};

export default nextConfig;
