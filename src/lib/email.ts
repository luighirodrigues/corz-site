import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { site } from "@/conteudo/site";

/**
 * Envio de e-mail.
 *
 * Toda submissão de formulário vira um e-mail para a CORZ. O banco
 * continua sendo a fonte da verdade — o e-mail é o aviso, para ninguém
 * depender de alguém lembrar de abrir o painel.
 *
 * Três decisões que valem explicação:
 *
 * **Nunca derruba a resposta ao visitante.** Quem preencheu o
 * formulário não tem nada a ver com o servidor SMTP estar fora do ar.
 * O envio acontece depois da gravação e o erro é registrado no log,
 * nunca propagado: o lead está salvo de qualquer jeito, e a tela de
 * confirmação é honesta.
 *
 * **Sem configuração, não falha — não envia.** Se as variáveis de SMTP
 * não existirem, a função registra um aviso e devolve. É o que permite
 * o site rodar em homologação e em desenvolvimento sem servidor de
 * e-mail e sem `try/catch` espalhado em cada rota.
 *
 * **Todo valor que vem do visitante é escapado.** Assunto e cabeçalhos
 * passam por remoção de quebra de linha (injeção de cabeçalho SMTP), e
 * o corpo HTML escapa `& < > " '`. Um nome com `<script>` chega à caixa
 * de entrada como texto, não como marcação.
 */

const cfg = {
  host: process.env.SMTP_HOST,
  porta: Number(process.env.SMTP_PORT ?? 587),
  usuario: process.env.SMTP_USUARIO,
  senha: process.env.SMTP_SENHA,
  /* Remetente. Precisa ser um endereço do próprio domínio, senão SPF e
     DMARC reprovam e a mensagem cai em spam ou é recusada. */
  de: process.env.SMTP_DE ?? `CORZ Site <nao-responda@corz.com.br>`,
};

const configurado = Boolean(cfg.host && cfg.usuario && cfg.senha);

let transporte: Transporter | null = null;

function obterTransporte() {
  if (transporte) return transporte;
  transporte = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.porta,
    /* 465 é TLS implícito; 587 abre em texto e sobe para TLS via
       STARTTLS. `requireTLS` garante que a subida aconteça — sem ele,
       um servidor mal configurado aceitaria a mensagem em claro. */
    secure: cfg.porta === 465,
    requireTLS: cfg.porta !== 465,
    auth: { user: cfg.usuario!, pass: cfg.senha! },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
  });
  return transporte;
}

/** Remove CR/LF: é o vetor clássico de injeção de cabeçalho SMTP. */
const umaLinha = (v: string) => v.replace(/[\r\n]+/g, " ").trim().slice(0, 200);

const escapar = (v: string) =>
  v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export type Campo = { rotulo: string; valor: string | undefined | null };

type Aviso = {
  /** Para onde vai. Sem valor, cai no endereço institucional. */
  para?: string;
  assunto: string;
  titulo: string;
  resumo: string;
  campos: Campo[];
  /** Endereço de quem preencheu, para responder direto da caixa. */
  responderPara?: string;
  urgente?: boolean;
};

function montarHtml({ titulo, resumo, campos, urgente }: Aviso) {
  const linhas = campos
    .filter((c) => c.valor)
    .map(
      (c) => `
      <tr>
        <td style="padding:10px 16px;border-bottom:1px solid #e6ecf1;color:#5a6b7a;font-size:13px;white-space:nowrap;vertical-align:top">${escapar(c.rotulo)}</td>
        <td style="padding:10px 16px;border-bottom:1px solid #e6ecf1;color:#00131f;font-size:14px;vertical-align:top">${escapar(String(c.valor)).replace(/\n/g, "<br>")}</td>
      </tr>`
    )
    .join("");

  /* Tabela e estilo embutido, sem folha de estilo e sem imagem externa:
     é o único formato que sobrevive igual a Gmail, Outlook e Apple
     Mail, e não pede o "carregar imagens" que muita caixa bloqueia. */
  return `<!doctype html>
<html lang="pt-BR"><body style="margin:0;padding:24px;background:#f6f8fa;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
  <table role="presentation" width="100%" style="max-width:640px;margin:0 auto;border-collapse:collapse;background:#ffffff;border:1px solid #dfe6ec;border-radius:10px;overflow:hidden">
    <tr>
      <td style="padding:20px 24px;background:${urgente ? "#e20d50" : "#00131f"};color:#ffffff">
        <div style="font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.7">${urgente ? "Chamado urgente" : "Site CORZ"}</div>
        <div style="margin-top:6px;font-size:19px;font-weight:700">${escapar(titulo)}</div>
      </td>
    </tr>
    <tr><td style="padding:18px 24px;color:#38495a;font-size:14px;line-height:1.6">${escapar(resumo)}</td></tr>
    <tr><td style="padding:0 8px 8px">
      <table role="presentation" width="100%" style="border-collapse:collapse">${linhas}</table>
    </td></tr>
    <tr><td style="padding:16px 24px;background:#f6f8fa;color:#7b8b99;font-size:12px;line-height:1.5">
      Enviado automaticamente por ${escapar(site.url)}. Responder esta mensagem fala direto com quem preencheu o formulário.
    </td></tr>
  </table>
</body></html>`;
}

function montarTexto({ titulo, resumo, campos }: Aviso) {
  return [
    titulo,
    "",
    resumo,
    "",
    ...campos.filter((c) => c.valor).map((c) => `${c.rotulo}: ${c.valor}`),
    "",
    `— ${site.url}`,
  ].join("\n");
}

export async function enviarAviso(aviso: Aviso): Promise<boolean> {
  if (!configurado) {
    console.warn(
      "[corz] SMTP não configurado: o aviso por e-mail não foi enviado.",
      { assunto: aviso.assunto }
    );
    return false;
  }

  const para = aviso.para || process.env.EMAIL_DESTINO || site.email;

  try {
    await obterTransporte().sendMail({
      from: cfg.de,
      to: para,
      /* `replyTo` é o que transforma o aviso em conversa: quem recebe
         responde do próprio cliente de e-mail e a resposta chega a quem
         preencheu, sem copiar endereço na mão. */
      replyTo: aviso.responderPara ? umaLinha(aviso.responderPara) : undefined,
      subject: umaLinha(aviso.assunto),
      text: montarTexto(aviso),
      html: montarHtml(aviso),
      headers: { "X-Entity-Ref-ID": "corz-site" },
    });
    return true;
  } catch (erro) {
    /* Registrado e engolido de propósito: ver a explicação no topo. */
    console.error("[corz] falha ao enviar o aviso por e-mail", erro);
    return false;
  }
}

/** Diz se o envio está configurado, para a rota de saúde reportar. */
export const emailConfigurado = configurado;
