import { db, esquema } from "@/db";
import { esquemaChamado, errosDe } from "@/lib/validacao";
import { ipDoCliente, limitar, respostaJson, mesmaOrigem } from "@/lib/requisicao";
import { enviarAviso } from "@/lib/email";
import type { z } from "zod";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CRITICIDADE = {
  "parada-total": "Parada total",
  degradado: "Degradado",
  duvida: "Dúvida ou solicitação",
} as const;

/**
 * Rótulo legível de cada categoria, para o e-mail que chega ao plantão.
 *
 * O tipo vem do esquema de validação de propósito: acrescentar uma
 * categoria lá e esquecer daqui passa a ser erro de compilação, não uma
 * linha "undefined" no meio de um chamado de operação parada.
 */
const CATEGORIA: Record<
  z.infer<typeof esquemaChamado>["categoria"],
  string
> = {
  conectividade: "Link de internet ou WAN",
  "rede-interna": "Rede interna, Wi-Fi ou switch",
  cloud: "Cloud, servidor ou backup",
  estacao: "Computador, e-mail ou acesso",
  telefonia: "Telefonia e PABX",
  seguranca: "Segurança, firewall ou incidente",
  outro: "Outro assunto",
};

export async function POST(req: Request) {
  if (!(await mesmaOrigem(req))) {
    return respostaJson({ ok: false, erro: "Origem não autorizada." }, 403);
  }

  const ip = await ipDoCliente();

  // Limite mais generoso que o de leads: chamado urgente pode ser
  // reenviado por ansiedade, e travar isso seria pior que o abuso.
  const taxa = limitar(`chamado:${ip}`, { limite: 12, janelaMs: 10 * 60_000 });
  if (!taxa.permitido) {
    return respostaJson(
      {
        ok: false,
        erro: "Muitas aberturas seguidas. Se for urgente, ligue para (53) 3027-2698.",
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

  const analise = esquemaChamado.safeParse(corpo);
  if (!analise.success) {
    return respostaJson(
      { ok: false, erros: errosDe(analise.error as z.ZodError) },
      422
    );
  }

  const d = analise.data;
  if (d.site) return respostaJson({ ok: true, protocolo: "—" });

  // Limite por e-mail para impedir inundações de chamados repetidos.
  const taxaEmail = limitar(`chamado:email:${d.email}`, {
    limite: 4,
    janelaMs: 10 * 60_000,
  });
  if (!taxaEmail.permitido) {
    return respostaJson(
      {
        ok: false,
        erro: "Muitos chamados abertos recentemente para este e-mail. Se for urgente, ligue para (53) 3027-2698.",
      },
      429
    );
  }

  const protocolo = `CZ-${Date.now().toString(36).toUpperCase().slice(-6)}`;

  const mensagem = [
    `Protocolo: ${protocolo}`,
    `Criticidade: ${CRITICIDADE[d.criticidade]}`,
    `Categoria: ${CATEGORIA[d.categoria]}`,
    d.unidade ? `Unidade: ${d.unidade}` : null,
    "",
    d.descricao,
  ]
    .filter(Boolean)
    .join("\n");

  await db.insert(esquema.leads).values({
    nome: d.nome,
    email: d.email,
    telefone: d.telefone,
    empresa: d.empresa,
    interesse: CRITICIDADE[d.criticidade],
    mensagem,
    origem: "SUPORTE",
    pagina: "/suporte/abrir-chamado",
    ip,
  });

  /* Chamado urgente vira e-mail imediato. É o único caminho que toca
     alguém fora do horário — o painel só é visto por quem abre o
     painel, e uma unidade parada às duas da manhã não pode esperar
     isso. Cabeçalho de prioridade quando é parada total, para o
     cliente de e-mail destacar na caixa de entrada. */
  await enviarAviso({
    para: process.env.EMAIL_CHAMADOS,
    urgente: d.criticidade === "parada-total",
    assunto: `[${CRITICIDADE[d.criticidade]}] ${protocolo} — ${d.empresa}`,
    titulo: `${protocolo} · ${CRITICIDADE[d.criticidade]}`,
    resumo: `${d.nome}, da ${d.empresa}, abriu um chamado de ${CATEGORIA[d.categoria].toLowerCase()}.`,
    responderPara: d.email,
    campos: [
      { rotulo: "Protocolo", valor: protocolo },
      { rotulo: "Criticidade", valor: CRITICIDADE[d.criticidade] },
      { rotulo: "Categoria", valor: CATEGORIA[d.categoria] },
      { rotulo: "Empresa", valor: d.empresa },
      { rotulo: "Unidade", valor: d.unidade },
      { rotulo: "Nome", valor: d.nome },
      { rotulo: "E-mail", valor: d.email },
      { rotulo: "Telefone", valor: d.telefone },
      { rotulo: "Descrição", valor: d.descricao },
      {
        rotulo: "Aberto em",
        valor: new Intl.DateTimeFormat("pt-BR", {
          timeZone: "America/Sao_Paulo",
          dateStyle: "short",
          timeStyle: "medium",
        }).format(new Date()),
      },
      { rotulo: "IP", valor: ip },
    ],
  });

  return respostaJson({ ok: true, protocolo });
}
