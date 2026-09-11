import { db, esquema } from "@/db";
import { esquemaLead, errosDe } from "@/lib/validacao";
import { ipDoCliente, limitar, respostaJson, mesmaOrigem } from "@/lib/requisicao";
import { enviarAviso } from "@/lib/email";
import { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Rótulo legível de cada origem, para o assunto do e-mail. */
const ORIGEM: Record<z.infer<typeof esquemaLead>["origem"], string> = {
  CONTATO: "Contato",
  DIAGNOSTICO: "Pedido de diagnóstico",
  SUPORTE: "Suporte",
  MATERIAL: "Download de material",
  NEWSLETTER: "Assinatura da newsletter",
};

/** Data e hora no fuso de quem vai ler, não no do servidor. */
const agora = () =>
  new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date());

export async function POST(req: Request) {
  /* Formulário do próprio site não chega de outro domínio. Recusar o
     que chega de fora corta o envio automatizado que copia o endereço
     do formulário sem nem carregar a página. */
  if (!(await mesmaOrigem(req))) {
    return respostaJson({ ok: false, erro: "Origem não autorizada." }, 403);
  }

  const ip = await ipDoCliente();

  const taxa = limitar(`lead:${ip}`, { limite: 5, janelaMs: 10 * 60_000 });
  if (!taxa.permitido) {
    return respostaJson(
      {
        ok: false,
        erro: "Muitos envios seguidos. Tente novamente em alguns minutos.",
      },
      429
    );
  }

  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    return respostaJson({ ok: false, erro: "Requisição inválida." }, 400);
  }

  const analise = esquemaLead.safeParse(corpo);
  if (!analise.success) {
    return respostaJson(
      { ok: false, erros: errosDe(analise.error as z.ZodError) },
      422
    );
  }

  const dados = analise.data;

  // Armadilha preenchida: respondemos como sucesso para não ensinar o bot,
  // mas não gravamos nada.
  if (dados.site) return respostaJson({ ok: true });

  await db.insert(esquema.leads).values({
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    empresa: dados.empresa,
    cargo: dados.cargo,
    interesse: dados.interesse,
    mensagem: dados.mensagem,
    origem: dados.origem,
    pagina: dados.pagina,
    utm: dados.utm,
    ip,
  });

  /* Depois da gravação, e com `await` sem `try`: `enviarAviso` trata o
     próprio erro e devolve `false` em vez de lançar. Esperar garante
     que a tentativa termine antes de a resposta fechar — em servidor
     que encerra o processo junto com a requisição, disparar sem
     esperar é o mesmo que não enviar. E se o SMTP estiver fora, o lead
     continua salvo e a tela de confirmação segue honesta. */
  await enviarAviso({
    para: process.env.EMAIL_LEADS,
    assunto: `[Site] ${ORIGEM[dados.origem]} — ${dados.nome}${dados.empresa ? ` (${dados.empresa})` : ""}`,
    titulo: ORIGEM[dados.origem],
    resumo: `${dados.nome} preencheu o formulário em ${dados.pagina ?? "/"}.`,
    responderPara: dados.email,
    campos: [
      { rotulo: "Nome", valor: dados.nome },
      { rotulo: "E-mail", valor: dados.email },
      { rotulo: "Telefone", valor: dados.telefone },
      { rotulo: "Empresa", valor: dados.empresa },
      { rotulo: "Cargo", valor: dados.cargo },
      { rotulo: "Interesse", valor: dados.interesse },
      { rotulo: "Mensagem", valor: dados.mensagem },
      { rotulo: "Página", valor: dados.pagina },
      { rotulo: "Origem", valor: ORIGEM[dados.origem] },
      {
        rotulo: "Campanha",
        valor: dados.utm
          ? Object.entries(dados.utm)
              .map(([k, v]) => `${k}=${v}`)
              .join("\n")
          : undefined,
      },
      { rotulo: "Recebido em", valor: agora() },
      { rotulo: "IP", valor: ip },
    ],
  });

  return respostaJson({ ok: true });
}
