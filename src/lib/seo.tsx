import type { Metadata } from "next";
import { site } from "@/conteudo/site";
import { DOMINIO_CANONICO, INDEXAVEL } from "@/lib/constantes";

export const URL_BASE = site.url.replace(/\/$/, "");

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
}): Metadata {
  const url = abs(caminho);
  const og = imagem ?? abs(`/api/og?titulo=${encodeURIComponent(titulo)}`);

  return {
    title: titulo,
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
      siteName: site.nomeCompleto,
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
    name: site.nomeCompleto,
    inLanguage: "pt-BR",
    publisher: { "@id": ID_ORG },
    // Sem `potentialAction`. A busca vivia no blog, que está fora do ar,
    // e declarar uma ação que responde 404 é a forma mais silenciosa de
    // entregar ao buscador uma área que não deveria aparecer.
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
