import localFont from "next/font/local";

/**
 * Tipografia CORZ — auto-hospedada.
 *
 * Bricolage Grotesque — títulos e subtítulos (variável: opsz, wdth, wght).
 * Manrope            — corpo de texto.
 * Archivo            — substituto aberto de ScaleVF (grotesca variável com
 *                      eixo de largura); numerais e display largo.
 * JetBrains Mono     — no papel de Final Six: rótulos técnicos, índices,
 *                      dados e carimbos de seção.
 *
 * Os arquivos ficam em src/fontes/ e são servidos do próprio domínio.
 * Isso elimina a requisição a fonts.gstatic.com — melhor para Core Web
 * Vitals, melhor para privacidade e sem dependência externa em produção.
 *
 * Se a CORZ possuir as licenças de ScaleVF (Adobe Fonts) e Final Six
 * (Type-O-Tones), basta trocar os dois arquivos correspondentes: as
 * variáveis CSS consumidas pelo tema não mudam.
 */

export const fonteDisplay = localFont({
  src: "../fontes/bricolage-grotesque.woff2",
  variable: "--fonte-display",
  display: "swap",
  weight: "200 800",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const fonteCorpo = localFont({
  src: "../fontes/manrope.woff2",
  variable: "--fonte-corpo",
  display: "swap",
  weight: "200 800",
  preload: true,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
  adjustFontFallback: "Arial",
});

export const fonteLarga = localFont({
  src: "../fontes/archivo.woff2",
  variable: "--fonte-larga",
  display: "swap",
  weight: "100 900",
  preload: false,
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const fonteMono = localFont({
  src: "../fontes/jetbrains-mono.woff2",
  variable: "--fonte-mono",
  display: "swap",
  weight: "100 800",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export const classesDeFonte = [
  fonteDisplay.variable,
  fonteCorpo.variable,
  fonteLarga.variable,
  fonteMono.variable,
].join(" ");
