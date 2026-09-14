import type { Metadata } from "next";
import { site } from "@/conteudo/site";
import { DOMINIO_CANONICO, INDEXAVEL } from "@/lib/constantes";

export const URL_BASE = site.url.replace(/\/$/, "");

/**
 * Nome do site como ele deve aparecer no resultado de busca e no cartão
 * de link. Mais longo que a marca sozinha de propósito: "CORZ" isolado
 * não diz a ninguém o que a empresa faz, e é justamente esta linha que
 * o Google lê para montar o nome do site.
 */
export const NOME_DO_SITE =
  "CORZ Tecnologia | Continuidade Operacional e Cibersegurança";

/**
 * Cartão de link padrão.
 *
 * O banner da marca, e não a imagem gerada por página. Um cartão de
 * link é visto de relance numa conversa de WhatsApp ou numa timeline —
 * ali reconhecer a marca vale mais do que ler o título da página
 * repetido dentro da imagem.
 *
 * JPEG e não PNG: o mesmo banner em PNG tem 594 KB contra 28 KB aqui, e
 * vários raspadores de preview desistem antes de baixar meio megabyte.
 */
export const IMAGEM_CARTAO = "/marca/og-corz.jpg";

export { DOMINIO_CANONICO, INDEXAVEL };

export function abs(caminho = "/") {
  return `${URL_BASE}${caminho.startsWith("/") ? caminho : `/${caminho}`}`;
}

/**
 * Metadados de página. Título sempre no formato
 * "Assunto | CORZ" — curto o bastante para não truncar no resultado
 * de busca e específico o bastante para não competir consigo mesmo.
 */
export function metadados({
  titulo,
  descricao,
  caminho,
  imagem,
  tipo = "website",
  noindex,
  publicadoEm,
  atualizadoEm,
  autor,
  absoluto,
}: {
  titulo: string;
  descricao: string;
  caminho: string;
  imagem?: string;
  tipo?: "website" | "article";
  noindex?: boolean;
  publicadoEm?: string;
  atualizadoEm?: string;
  autor?: string;
  /**
   * Usa o título exatamente como veio, sem o sufixo " | CORZ" que o
   * gabarito do layout acrescenta. Existe para a home: lá o título já
   * é o nome do site inteiro, e o sufixo o deixaria "…Cibersegurança |
   * CORZ" — repetição que o buscador corta e que fica feia na aba.
   */
  absoluto?: boolean;
}): Metadata {
  const url = abs(caminho);
  const og = imagem ?? abs(IMAGEM_CARTAO);

  return {
    title: absoluto ? { absolute: titulo } : titulo,
    description: descricao,
    alternates: { canonical: url },
    robots: noindex || !INDEXAVEL
      ? { index: false, follow: false, nocache: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: tipo,
      url,
      siteName: NOME_DO_SITE,
      title: titulo,
      description: descricao,
      locale: "pt_BR",
      images: [{ url: og, width: 1200, height: 630, alt: titulo }],
      ...(tipo === "article"
        ? {
            publishedTime: publicadoEm,
            modifiedTime: atualizadoEm,
            authors: autor ? [autor] : undefined,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: descricao,
      images: [og],
    },
  };
}

/* ============================================================
   Dados estruturados
   Um grafo único e conectado por @id vale mais do que vários
   blocos soltos: buscadores e agentes conseguem resolver as
   relações entre organização, site, página e conteúdo.
   ============================================================ */

const ID_ORG = `${URL_BASE}/#organizacao`;
const ID_SITE = `${URL_BASE}/#site`;

export function organizacao() {
  return {
    "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
    "@id": ID_ORG,
    name: site.nomeCompleto,
    alternateName: "CORZ",
    legalName: site.razaoSocial,
    url: URL_BASE,
    logo: {
      "@type": "ImageObject",
      url: abs("/marca/corz-simbolo.png"),
      width: 512,
      height: 512,
    },
    image: abs("/marca/corz-simbolo.png"),
    description: site.descricao,
    slogan: site.assinatura,
    foundingDate: site.fundacao,
    taxID: site.cnpj,
    telephone: site.telefoneE164,
    email: site.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.endereco.logradouro,
      addressLocality: site.endereco.cidade,
      addressRegion: site.endereco.uf,
      postalCode: site.endereco.cep,
      addressCountry: site.endereco.pais,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.endereco.latitude,
      longitude: site.endereco.longitude,
    },
    areaServed: [
      { "@type": "Country", name: "Brasil" },
      { "@type": "State", name: "Rio Grande do Sul" },
    ],
    knowsAbout: [
      "Continuidade operacional",
      "Redes corporativas multiunidades",
      "Gestão de links de internet",
      "Cibersegurança empresarial",
      "Cloud dedicada",
      "PABX em nuvem com inteligência artificial",
      "Auditoria de telecom",
    ],
    sameAs: [site.redes.instagram, site.redes.linkedin],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "08:30",
        closes: "18:00",
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: site.telefoneE164,
        contactType: "customer support",
        areaServed: "BR",
        availableLanguage: ["Portuguese"],
      },
    ],
  };
}

export function siteWeb() {
  return {
    "@type": "WebSite",
    "@id": ID_SITE,
    url: URL_BASE,
    /* O nome completo, e não só "CORZ": é daqui que o buscador tira o
       nome do site exibido acima do resultado. `alternateName` dá a
       forma curta, para quem procura pela marca sozinha. */
    name: NOME_DO_SITE,
    alternateName: [site.nomeCompleto, site.nome],
    inLanguage: "pt-BR",
    publisher: { "@id": ID_ORG },
    // Sem `potentialAction`. A busca vivia no blog, que está fora do ar,
    // e declarar uma ação que responde 404 é a forma mais silenciosa de
    // entregar ao buscador uma área que não deveria aparecer.
  };
}

/**
 * Navegação principal declarada para o buscador.
 *
 * É a marcação que o Google lê como candidata a sitelink — aquele bloco
 * de atalhos que aparece embaixo do resultado quando alguém busca pela
 * marca. Vale dizer com todas as letras: **sitelink não se pede, se
 * merece**. O Google escolhe sozinho, pelo comportamento de quem clica
 * e pela estrutura interna do site, e pode simplesmente não exibir
 * nenhum. Esta lista é a melhor pista possível de qual é a hierarquia
 * pretendida, não um comando.
 *
 * A ordem é deliberada: contato primeiro, porque é a página que resolve
 * a intenção de quem busca pela marca — quem digita "CORZ" no Google na
 * maioria das vezes quer falar com a CORZ, não ler sobre ela. Depois
 * vêm as quatro frentes, na mesma ordem do menu e das páginas internas.
 * Divergir entre as três seria justamente o sinal de estrutura confusa
 * que faz o buscador desistir de montar o bloco.
 */
export function navegacaoPrincipal(
  itens: { nome: string; caminho: string }[]
) {
  return {
    "@type": "ItemList",
    "@id": `${URL_BASE}/#navegacao`,
    name: "Navegação principal",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: itens.length,
    itemListElement: itens.map((item, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: item.nome,
      url: abs(item.caminho),
    })),
  };
}

export function trilha(itens: { nome: string; caminho: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: itens.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.nome,
      item: abs(item.caminho),
    })),
  };
}

export function perguntas(faq: { pergunta: string; resposta: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faq.map((q) => ({
      "@type": "Question",
      name: q.pergunta,
      acceptedAnswer: { "@type": "Answer", text: q.resposta },
    })),
  };
}

export function servico({
  nome,
  descricao,
  caminho,
}: {
  nome: string;
  descricao: string;
  caminho: string;
}) {
  return {
    "@type": "Service",
    "@id": `${abs(caminho)}#servico`,
    name: nome,
    description: descricao,
    url: abs(caminho),
    provider: { "@id": ID_ORG },
    areaServed: { "@type": "Country", name: "Brasil" },
    serviceType: nome,
  };
}

export function pagina({
  nome,
  descricao,
  caminho,
}: {
  nome: string;
  descricao: string;
  caminho: string;
}) {
  return {
    "@type": "WebPage",
    "@id": `${abs(caminho)}#pagina`,
    url: abs(caminho),
    name: nome,
    description: descricao,
    isPartOf: { "@id": ID_SITE },
    about: { "@id": ID_ORG },
    inLanguage: "pt-BR",
  };
}

/** Serializa o grafo. Chamar uma vez por página. */
export function grafo(...nos: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nos,
  };
}

export function DadosEstruturados({ dados }: { dados: object }) {
  return (
    <script
      type="application/ld+json"
      // O conteúdo é gerado no servidor a partir de dados nossos,
      // nunca de entrada de usuário não sanitizada.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(dados).replace(/</g, "\\u003c"),
      }}
    />
  );
}
