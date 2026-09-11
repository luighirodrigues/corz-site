import { z } from "zod";

/** Limpa espaços e normaliza vazios para undefined. */
const texto = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Máximo de ${max} caracteres.`)
    .transform((v) => (v === "" ? undefined : v))
    .optional();

export const esquemaLead = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Informe seu nome.")
    .max(160, "Nome muito longo."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("E-mail inválido.")
    .max(180),
  telefone: texto(40),
  empresa: texto(160),
  cargo: texto(120),
  interesse: texto(120),
  mensagem: z
    .string()
    .trim()
    .max(4000, "Mensagem muito longa.")
    .optional(),
  origem: z
    .enum(["CONTATO", "DIAGNOSTICO", "SUPORTE", "MATERIAL", "NEWSLETTER"])
    .default("CONTATO"),
  pagina: texto(300),
  utm: z.record(z.string(), z.string().max(200)).optional(),
  /**
   * Campo-armadilha. Formulário legítimo nunca preenche. Bot preenche
   * quase sempre — é o filtro mais barato e menos invasivo que existe,
   * e não exige captcha de terceiro nem cookie extra.
   */
  site: z.string().max(0).optional(),
});

export type EntradaLead = z.infer<typeof esquemaLead>;

export const esquemaChamado = z.object({
  nome: z.string().trim().min(2, "Informe seu nome.").max(160),
  email: z.string().trim().toLowerCase().email("E-mail inválido.").max(180),
  telefone: z.string().trim().min(8, "Informe um telefone.").max(40),
  empresa: z.string().trim().min(2, "Informe a empresa.").max(160),
  unidade: texto(160),
  criticidade: z.enum(["parada-total", "degradado", "duvida"]),
  // Precisa acompanhar a lista do formulário de chamado. Categoria que
  // existe na tela e não existe aqui vira erro de validação silencioso
  // para quem estava tentando abrir um chamado urgente.
  categoria: z.enum([
    "conectividade",
    "rede-interna",
    "cloud",
    "estacao",
    "telefonia",
    "seguranca",
    "outro",
  ]),
  descricao: z
    .string()
    .trim()
    .min(10, "Descreva o que está acontecendo.")
    .max(4000),
  site: z.string().max(0).optional(),
});

export const esquemaAssinatura = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido.").max(180),
  nome: texto(160),
  site: z.string().max(0).optional(),
});

export const esquemaLogin = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido.").max(180),
  senha: z.string().min(1, "Informe a senha.").max(200),
  codigo: z
    .string()
    .trim()
    .regex(/^\d{6}$|^[A-Za-z0-9-]{8,24}$/, "Código inválido.")
    .optional()
    .or(z.literal("")),
});

const FAQ_ITEM = z.object({
  pergunta: z.string().trim().min(3).max(240),
  resposta: z.string().trim().min(3).max(1200),
});

export const esquemaArtigo = z.object({
  titulo: z.string().trim().min(4, "Título muito curto.").max(200),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "O endereço só aceita letras minúsculas, números e hífen."
    )
    .max(200),
  subtitulo: texto(400),
  resumo: z
    .string()
    .trim()
    .min(20, "O resumo precisa de pelo menos 20 caracteres.")
    .max(400, "Resumo muito longo. O ideal é até 300 caracteres."),
  conteudo: z.string().min(1, "O artigo está vazio."),
  respostaCurta: z
    .string()
    .trim()
    .max(600)
    .optional()
    .or(z.literal("")),
  status: z.enum(["RASCUNHO", "AGENDADO", "PUBLICADO", "ARQUIVADO"]),
  agendadoPara: z.string().datetime({ offset: true }).optional().or(z.literal("")),
  capaUrl: z.string().max(600).optional().or(z.literal("")),
  capaAlt: texto(240),
  categoriaId: z.string().max(60).optional().or(z.literal("")),
  tags: z.array(z.string().trim().min(1).max(60)).max(12).default([]),
  destaque: z.boolean().default(false),
  seoTitulo: texto(180),
  seoDescricao: z.string().trim().max(320).optional().or(z.literal("")),
  seoImagem: z.string().max(600).optional().or(z.literal("")),
  canonical: z.string().max(600).optional().or(z.literal("")),
  noindex: z.boolean().default(false),
  faq: z.array(FAQ_ITEM).max(12).default([]),
});

export type EntradaArtigo = z.infer<typeof esquemaArtigo>;

/** Converte erros do zod no formato que os formulários consomem. */
export function errosDe(erro: z.ZodError) {
  const mapa: Record<string, string> = {};
  for (const questao of erro.issues) {
    const chave = questao.path.join(".") || "geral";
    if (!mapa[chave]) mapa[chave] = questao.message;
  }
  return mapa;
}
