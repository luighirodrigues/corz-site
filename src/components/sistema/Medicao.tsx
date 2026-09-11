"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { medicao, COOKIE_CONSENTIMENTO } from "@/lib/medicao";

/**
 * Medição.
 *
 * Nenhum script de terceiro entra na página antes de a pessoa aceitar.
 * Isso não é excesso de zelo: a LGPD trata cookie de medição como dado
 * pessoal, e carregar o GA4 ou o pixel "só para ver se ela aceita
 * depois" já é o tratamento que se deveria ter pedido antes.
 *
 * A consequência prática é que este componente não renderiza nada até
 * `AvisoCookies` gravar o cookie e avisar. Enquanto isso, zero
 * requisição para googletagmanager.com ou connect.facebook.net — o que
 * também explica por que a primeira dobra do site é tão rápida.
 *
 * O `Consent Mode v2` do Google é declarado antes de qualquer tag, com
 * tudo negado. Assim, mesmo na janela entre o aceite e o carregamento,
 * a biblioteca já sabe em que regime está operando.
 *
 * Os identificadores vêm todos de variável de ambiente. Sem valor
 * configurado, a tag correspondente nem existe: o site publica hoje sem
 * nenhuma delas e passa a medir quando a CORZ preencher as variáveis,
 * sem alterar uma linha de código.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[] };
  }
}

const EVENTO_CONSENTIMENTO = "corz:consentimento";

function leuCookie() {
  if (typeof document === "undefined") return null;
  const achado = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${COOKIE_CONSENTIMENTO}=`));
  return achado ? achado.split("=")[1] : null;
}

export default function Medicao() {
  const [liberado, setLiberado] = useState(false);

  useEffect(() => {
    const conferir = () => setLiberado(leuCookie() === "aceito");
    conferir();
    window.addEventListener(EVENTO_CONSENTIMENTO, conferir);
    return () => window.removeEventListener(EVENTO_CONSENTIMENTO, conferir);
  }, []);

  if (!liberado) return null;

  const { ga4, gtm, metaPixel, googleAds, linkedin } = medicao;
  const temGoogle = Boolean(ga4 || googleAds);

  return (
    <>
      {/* ---- Google: GA4 e Ads ---- */}
      {temGoogle && (
        <>
          <Script
            id="gtag-base"
            src={`https://www.googletagmanager.com/gtag/js?id=${ga4 ?? googleAds}`}
            strategy="afterInteractive"
          />
          <Script id="gtag-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('consent','default',{
                ad_storage:'denied', ad_user_data:'denied',
                ad_personalization:'denied', analytics_storage:'denied'
              });
              gtag('consent','update',{
                ad_storage:'granted', ad_user_data:'granted',
                ad_personalization:'granted', analytics_storage:'granted'
              });
              gtag('js', new Date());
              ${ga4 ? `gtag('config','${ga4}',{anonymize_ip:true});` : ""}
              ${googleAds ? `gtag('config','${googleAds}');` : ""}
            `}
          </Script>
        </>
      )}

      {/* ---- Google Tag Manager ---- */}
      {gtm && (
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
        </Script>
      )}

      {/* ---- Pixel da Meta ---- */}
      {metaPixel && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
            (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${metaPixel}');fbq('track','PageView');`}
        </Script>
      )}

      {/* ---- LinkedIn Insight ---- */}
      {linkedin && (
        <Script id="linkedin-insight" strategy="afterInteractive">
          {`_linkedin_partner_id='${linkedin}';
            window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];
            window._linkedin_data_partner_ids.push(_linkedin_partner_id);
            (function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}
            var s=document.getElementsByTagName('script')[0];var b=document.createElement('script');
            b.type='text/javascript';b.async=true;
            b.src='https://snap.licdn.com/li.lms-analytics/insight.min.js';
            s.parentNode.insertBefore(b,s);})(window.lintrk);`}
        </Script>
      )}
    </>
  );
}

/**
 * Marca uma conversão nas ferramentas que estiverem ativas.
 *
 * Chamada pelos formulários depois do envio bem-sucedido. Cada `if`
 * existe porque a ferramenta pode não estar configurada, ou a pessoa
 * pode ter recusado — nos dois casos a função global não existe, e
 * chamar sem conferir quebraria o formulário por causa da medição, que
 * é exatamente o contrário da ordem de importância.
 */
export function marcarConversao(
  nome: string,
  detalhes?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", nome, detalhes ?? {});
    window.fbq?.("track", "Lead", detalhes ?? {});
    window.dataLayer?.push({ event: nome, ...(detalhes ?? {}) });
  } catch {
    /* Medição nunca derruba o envio de um formulário. */
  }
}
