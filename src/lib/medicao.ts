/**
 * Identificadores de medição.
 *
 * Tudo aqui é opcional e vem de variável de ambiente. Sem o
 * identificador, o script correspondente simplesmente não existe na
 * página: nada de tag vazia, nada de requisição para um domínio de
 * terceiro "só por garantia". Ligar a medição é preencher uma variável
 * e recompilar, sem tocar em código.
 *
 * São `NEXT_PUBLIC_` porque precisam chegar ao navegador. Isso torna os
 * valores públicos — o que é aceitável: um ID de GA4 ou de pixel é
 * visível no HTML de qualquer site que os use. Nenhum segredo entra
 * aqui.
 */

const limpo = (v: string | undefined) => {
  const t = (v ?? "").trim();
  return t.length ? t : null;
};

export const medicao = {
  /** Google Analytics 4 — "G-XXXXXXXXXX". */
  ga4: limpo(process.env.NEXT_PUBLIC_GA4_ID),
  /** Google Tag Manager — "GTM-XXXXXXX". Alternativa ao GA4 direto. */
  gtm: limpo(process.env.NEXT_PUBLIC_GTM_ID),
  /** Pixel da Meta (Facebook e Instagram) — só dígitos. */
  metaPixel: limpo(process.env.NEXT_PUBLIC_META_PIXEL_ID),
  /** Google Ads, para conversão — "AW-XXXXXXXXX". */
  googleAds: limpo(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
  /** LinkedIn Insight Tag — ID numérico do parceiro. */
  linkedin: limpo(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID),
  /** Verificação do Search Console, quando feita por meta tag. */
  googleSearchConsole: limpo(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
} as const;

/** Existe alguma medição de terceiro configurada? */
export const temMedicao = Object.entries(medicao).some(
  ([chave, valor]) => chave !== "googleSearchConsole" && valor
);

/** Nome do cookie que guarda a escolha de quem visita. */
export const COOKIE_CONSENTIMENTO = "corz_consentimento";

export type Consentimento = "aceito" | "recusado";
