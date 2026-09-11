import type { Metadata, Viewport } from "next";
import "./globals.css";
import { classesDeFonte } from "@/lib/fontes";
import { medicao } from "@/lib/medicao";
import { site } from "@/conteudo/site";
import { URL_BASE, INDEXAVEL } from "@/lib/seo";

export const viewport: Viewport = {
  themeColor: "#00131F",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(URL_BASE),
  title: {
    default: `${site.nomeCompleto}: continuidade operacional para quem não pode parar`,
    template: `%s | ${site.nome}`,
  },
  description: site.descricao,
  applicationName: site.nomeCompleto,
  authors: [{ name: site.nomeCompleto, url: URL_BASE }],
  creator: site.nomeCompleto,
  publisher: site.nomeCompleto,
  category: "technology",
  formatDetection: { telephone: true, address: true, email: true },
  // Padrão do documento inteiro. Cada página pode reforçar, nunca afrouxar.
  robots: INDEXAVEL
    ? { index: true, follow: true }
    : { index: false, follow: false, nocache: true },
  // Sem `types` enquanto o blog estiver fora do ar: anunciar um feed
  // que responde 404 é a forma mais rápida de entregar a área escondida.
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.nomeCompleto,
    url: URL_BASE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nomeCompleto}: continuidade operacional`,
    description: site.descricao,
  },
  /* Verificação do Search Console por meta tag. Sai do HTML quando a
     variável não existe, então nada de tag vazia no ar. O método por
     registro DNS dispensa isto e é preferível quando dá para usar. */
  ...(medicao.googleSearchConsole
    ? { verification: { google: medicao.googleSearchConsole } }
    : {}),
};

export default function LayoutRaiz({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={classesDeFonte} suppressHydrationWarning>
      <head>
        {/*
          Interruptor da animação de entrada.

          O conteúdo nasce visível no HTML. Só depois que este script
          roda é que o CSS passa a poder escondê-lo para animar, e ele
          roda antes da primeira pintura, então não há piscada.

          A inversão é deliberada e não é preciosismo. Antes, o HTML
          nascia escondido e dependia de o JavaScript da página revelar.
          Qualquer coisa que impedisse esse JavaScript de rodar — um
          chunk defasado depois de uma publicação, um erro de hidratação,
          uma extensão do navegador — entregava uma página em branco.
          Agora a pior falha possível devolve o site sem animação, que é
          um site que funciona.

          O vigia fecha a última brecha: se a hidratação não acontecer em
          3 segundos, o interruptor é desligado e tudo reaparece.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var r=document.documentElement;r.dataset.anima="sim";' +
              'setTimeout(function(){if(r.dataset.hidratado!=="sim")' +
              'delete r.dataset.anima},3000)}catch(e){}',
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
