import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const mdPath = path.resolve("AVALIACAO-SEGURANCA.md");
const pdfPath = path.resolve("AVALIACAO-SEGURANCA.pdf");

const markdown = fs.readFileSync(mdPath, "utf-8");

const htmlContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Relatório de Avaliação de Segurança - CORZ</title>
  <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 20mm 16mm;
      @bottom-right {
        content: counter(page);
      }
    }
    
    * {
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      line-height: 1.6;
      font-size: 13.5px;
      margin: 0;
      padding: 0;
      background: #ffffff;
    }

    .header-cover {
      border-bottom: 3px solid #1D4FD8;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }

    h1 {
      font-size: 26px;
      font-weight: 800;
      color: #00131F;
      margin: 0 0 10px 0;
      letter-spacing: -0.03em;
    }

    h2 {
      font-size: 18px;
      font-weight: 700;
      color: #00131F;
      margin-top: 28px;
      margin-bottom: 12px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 6px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 20px;
      margin-bottom: 8px;
      page-break-after: avoid;
    }

    p {
      margin: 0 0 10px 0;
      text-align: justify;
    }

    strong {
      color: #0f172a;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12px;
      page-break-inside: avoid;
    }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: left;
      vertical-align: top;
    }

    th {
      background-color: #00131F;
      color: #ffffff;
      font-weight: 600;
      font-size: 11.5px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    tr:nth-child(even) {
      background-color: #f8fafc;
    }

    code {
      font-family: "JetBrains Mono", Menlo, Consolas, monospace;
      font-size: 11.5px;
      background-color: #f1f5f9;
      color: #0f172a;
      padding: 2px 5px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    pre {
      background-color: #0b1329;
      color: #f8fafc;
      padding: 12px 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 11.5px;
      line-height: 1.5;
      margin: 12px 0;
      page-break-inside: avoid;
    }

    pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
      border: none;
    }

    ul, ol {
      margin: 0 0 12px 0;
      padding-left: 20px;
    }

    li {
      margin-bottom: 5px;
    }

    hr {
      border: 0;
      border-top: 1px solid #e2e8f0;
      margin: 24px 0;
    }

    /* Badges de Severidade */
    .badge-critica {
      display: inline-block;
      background-color: #fee2e2;
      color: #991b1b;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #f87171;
    }

    .badge-alta {
      display: inline-block;
      background-color: #ffedd5;
      color: #9a3412;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #fb923c;
    }

    .badge-media {
      display: inline-block;
      background-color: #fef9c3;
      color: #854d0e;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #facc15;
    }

    .badge-baixa {
      display: inline-block;
      background-color: #e0f2fe;
      color: #075985;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #7dd3fc;
    }

    .badge-corrigida {
      display: inline-block;
      background-color: #dcfce7;
      color: #166534;
      font-weight: bold;
      padding: 2px 8px;
      border-radius: 4px;
      border: 1px solid #86efac;
    }

    .page-break {
      page-break-before: always;
    }
  </style>
</head>
<body>
  <div id="content"></div>
  <script>
    const rawMd = ${JSON.stringify(markdown)};
    const html = marked.parse(rawMd);
    const container = document.getElementById('content');
    container.innerHTML = html;

    // Substituir tags de texto por badges estilizados
    container.innerHTML = container.innerHTML
      .replace(/<strong>CRÍTICA<\/strong>/g, '<span class="badge-critica">CRÍTICA</span>')
      .replace(/<strong>ALTA<\/strong>/g, '<span class="badge-alta">ALTA</span>')
      .replace(/<strong>MÉDIA<\/strong>/g, '<span class="badge-media">MÉDIA</span>')
      .replace(/<strong>BAIXA<\/strong>/g, '<span class="badge-baixa">BAIXA</span>')
      .replace(/<strong>CORRIGIDA<\/strong>/g, '<span class="badge-corrigida">CORRIGIDA</span>');
  </script>
</body>
</html>`;

async function gerarPdf() {
  console.log("Iniciando Chromium via Playwright...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Carregando conteúdo do relatório...");
  await page.setContent(htmlContent, { waitUntil: "networkidle" });

  // Pequeno timeout para garantir que o script de parse concluiu
  await page.waitForTimeout(1000);

  console.log("Gerando PDF em " + pdfPath + "...");
  await page.pdf({
    path: pdfPath,
    format: "A4",
    printBackground: true,
    margin: {
      top: "16mm",
      bottom: "16mm",
      left: "14mm",
      right: "14mm",
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="font-size: 8px; font-family: sans-serif; color: #94a3b8; width: 100%; text-align: right; padding-right: 14mm;">
        CORZ · Avaliação de Segurança e Auditoria Técnica
      </div>
    `,
    footerTemplate: `
      <div style="font-size: 8px; font-family: sans-serif; color: #94a3b8; width: 100%; display: flex; justify-content: space-between; padding: 0 14mm;">
        <span>CONFIDENCIAL & INTERNO</span>
        <span>Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
      </div>
    `,
  });

  await browser.close();
  console.log("PDF gerado com sucesso!");
}

gerarPdf().catch((err) => {
  console.error("Erro ao gerar PDF:", err);
  process.exit(1);
});
