/**
 * CORZ — esquema de dados (Drizzle + Postgres)
 *
 * Blog editorial com agendamento, painel administrativo com sessões
 * server-side revogáveis, captação de leads e trilha de auditoria.
 */

import {
  pgTable,
  pgEnum,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  jsonb,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

// ---------- Enums --------------------------------------------

export const papelEnum = pgEnum("papel", ["ADMIN", "EDITOR", "AUTOR"]);
export const statusArtigoEnum = pgEnum("status_artigo", [
  "RASCUNHO",
  "AGENDADO",
  "PUBLICADO",
  "ARQUIVADO",
]);
export const origemLeadEnum = pgEnum("origem_lead", [
  "CONTATO",
  "DIAGNOSTICO",
  "SUPORTE",
  "MATERIAL",
  "NEWSLETTER",
]);

// ---------- Acesso -------------------------------------------

export const usuarios = pgTable(
  "usuarios",
  {
    id: id(),
    nome: varchar("nome", { length: 120 }).notNull(),
    email: varchar("email", { length: 180 }).notNull(),
    senhaHash: text("senha_hash").notNull(),
    papel: papelEnum("papel").notNull().default("AUTOR"),
    ativo: boolean("ativo").notNull().default(true),
    avatarUrl: text("avatar_url"),
    cargo: varchar("cargo", { length: 120 }),
    bio: text("bio"),
    /** Segredo TOTP cifrado em repouso (AES-256-GCM). */
    segredo2fa: text("segredo_2fa"),
    doisFatores: boolean("dois_fatores").notNull().default(false),
    /** Hashes dos códigos de recuperação — nunca em texto claro. */
    codigosBackup: text("codigos_backup")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),
    senhaAlteradaEm: timestamp("senha_alterada_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ultimoAcesso: timestamp("ultimo_acesso", { withTimezone: true }),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
    atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("usuarios_email_idx").on(t.email)]
);

export const sessoes = pgTable(
  "sessoes",
  {
    id: id(),
    /** Apenas o hash SHA-256 do token: vazamento do banco não concede acesso. */
    tokenHash: text("token_hash").notNull(),
    usuarioId: text("usuario_id")
      .notNull()
      .references(() => usuarios.id, { onDelete: "cascade" }),
    expiraEm: timestamp("expira_em", { withTimezone: true }).notNull(),
    /** Renovação deslizante: a sessão morre se ficar ociosa. */
    ultimoUso: timestamp("ultimo_uso", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ip: varchar("ip", { length: 64 }),
    agente: text("agente"),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("sessoes_token_idx").on(t.tokenHash),
    index("sessoes_usuario_idx").on(t.usuarioId),
    index("sessoes_expira_idx").on(t.expiraEm),
  ]
);

export const tentativasLogin = pgTable(
  "tentativas_login",
  {
    id: id(),
    email: varchar("email", { length: 180 }).notNull(),
    ip: varchar("ip", { length: 64 }).notNull(),
    sucesso: boolean("sucesso").notNull().default(false),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("tentativas_email_idx").on(t.email, t.criadoEm),
    index("tentativas_ip_idx").on(t.ip, t.criadoEm),
  ]
);

export const logsAuditoria = pgTable(
  "logs_auditoria",
  {
    id: id(),
    usuarioId: text("usuario_id").references(() => usuarios.id, {
      onDelete: "set null",
    }),
    acao: varchar("acao", { length: 80 }).notNull(),
    entidade: varchar("entidade", { length: 60 }).notNull(),
    entidadeId: text("entidade_id"),
    detalhe: jsonb("detalhe"),
    ip: varchar("ip", { length: 64 }),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("auditoria_data_idx").on(t.criadoEm),
    index("auditoria_entidade_idx").on(t.entidade, t.entidadeId),
  ]
);

// ---------- Conteúdo -----------------------------------------

export const categorias = pgTable(
  "categorias",
  {
    id: id(),
    slug: varchar("slug", { length: 120 }).notNull(),
    nome: varchar("nome", { length: 120 }).notNull(),
    descricao: text("descricao"),
    cor: varchar("cor", { length: 9 }).notNull().default("#00ADE7"),
    ordem: integer("ordem").notNull().default(0),
    seoTitulo: varchar("seo_titulo", { length: 180 }),
    seoDescricao: text("seo_descricao"),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("categorias_slug_idx").on(t.slug)]
);

export const tags = pgTable(
  "tags",
  {
    id: id(),
    slug: varchar("slug", { length: 120 }).notNull(),
    nome: varchar("nome", { length: 120 }).notNull(),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("tags_slug_idx").on(t.slug)]
);

export const artigos = pgTable(
  "artigos",
  {
    id: id(),
    slug: varchar("slug", { length: 200 }).notNull(),
    titulo: varchar("titulo", { length: 200 }).notNull(),
    subtitulo: text("subtitulo"),
    resumo: text("resumo").notNull(),
    /** HTML já sanitizado no servidor antes de gravar. */
    conteudo: text("conteudo").notNull(),
    /** Texto puro: busca interna e leitura por agentes. */
    textoPuro: text("texto_puro").notNull().default(""),
    status: statusArtigoEnum("status").notNull().default("RASCUNHO"),

    capaUrl: text("capa_url"),
    capaAlt: varchar("capa_alt", { length: 240 }),

    publicadoEm: timestamp("publicado_em", { withTimezone: true }),
    agendadoPara: timestamp("agendado_para", { withTimezone: true }),
    revisadoEm: timestamp("revisado_em", { withTimezone: true }),

    destaque: boolean("destaque").notNull().default(false),
    tempoLeitura: integer("tempo_leitura").notNull().default(1),
    visualizacoes: integer("visualizacoes").notNull().default(0),

    // SEO / GEO
    seoTitulo: varchar("seo_titulo", { length: 180 }),
    seoDescricao: text("seo_descricao"),
    seoImagem: text("seo_imagem"),
    canonical: text("canonical"),
    noindex: boolean("noindex").notNull().default(false),
    /** [{pergunta, resposta}] → FAQPage no JSON-LD. */
    faq: jsonb("faq").$type<{ pergunta: string; resposta: string }[]>(),
    /** 40-60 palavras. O trecho que um LLM cita. */
    respostaCurta: text("resposta_curta"),

    autorId: text("autor_id")
      .notNull()
      .references(() => usuarios.id),
    categoriaId: text("categoria_id").references(() => categorias.id, {
      onDelete: "set null",
    }),

    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
    atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("artigos_slug_idx").on(t.slug),
    index("artigos_publicacao_idx").on(t.status, t.publicadoEm),
    index("artigos_agenda_idx").on(t.status, t.agendadoPara),
    index("artigos_categoria_idx").on(t.categoriaId),
  ]
);

export const artigosTags = pgTable(
  "artigos_tags",
  {
    artigoId: text("artigo_id")
      .notNull()
      .references(() => artigos.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.artigoId, t.tagId] })]
);

export const midias = pgTable(
  "midias",
  {
    id: id(),
    chave: text("chave").notNull(),
    url: text("url").notNull(),
    nome: varchar("nome", { length: 240 }).notNull(),
    mime: varchar("mime", { length: 80 }).notNull(),
    tamanho: integer("tamanho").notNull(),
    largura: integer("largura"),
    altura: integer("altura"),
    alt: varchar("alt", { length: 240 }),
    enviadoPor: text("enviado_por").references(() => usuarios.id, {
      onDelete: "set null",
    }),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("midias_chave_idx").on(t.chave)]
);

// ---------- Captação e operação -------------------------------

export const leads = pgTable(
  "leads",
  {
    id: id(),
    nome: varchar("nome", { length: 160 }).notNull(),
    email: varchar("email", { length: 180 }).notNull(),
    telefone: varchar("telefone", { length: 40 }),
    empresa: varchar("empresa", { length: 160 }),
    cargo: varchar("cargo", { length: 120 }),
    interesse: varchar("interesse", { length: 120 }),
    mensagem: text("mensagem"),
    origem: origemLeadEnum("origem").notNull().default("CONTATO"),
    pagina: text("pagina"),
    utm: jsonb("utm"),
    ip: varchar("ip", { length: 64 }),
    lido: boolean("lido").notNull().default(false),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("leads_data_idx").on(t.criadoEm)]
);

export const assinantes = pgTable(
  "assinantes",
  {
    id: id(),
    email: varchar("email", { length: 180 }).notNull(),
    nome: varchar("nome", { length: 160 }),
    confirmado: boolean("confirmado").notNull().default(false),
    tokenConfirmacao: text("token_confirmacao"),
    tokenDescadastro: text("token_descadastro").notNull(),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
    confirmadoEm: timestamp("confirmado_em", { withTimezone: true }),
  },
  (t) => [uniqueIndex("assinantes_email_idx").on(t.email)]
);

export const redirecionamentos = pgTable(
  "redirecionamentos",
  {
    id: id(),
    de: text("de").notNull(),
    para: text("para").notNull(),
    tipo: integer("tipo").notNull().default(301),
    ativo: boolean("ativo").notNull().default(true),
    criadoEm: timestamp("criado_em", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("redirecionamentos_de_idx").on(t.de)]
);

export const configuracoes = pgTable("configuracoes", {
  chave: varchar("chave", { length: 120 }).primaryKey(),
  valor: jsonb("valor").notNull(),
  atualizadoEm: timestamp("atualizado_em", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// ---------- Relações -----------------------------------------

export const relUsuarios = relations(usuarios, ({ many }) => ({
  sessoes: many(sessoes),
  artigos: many(artigos),
  midias: many(midias),
}));

export const relSessoes = relations(sessoes, ({ one }) => ({
  usuario: one(usuarios, {
    fields: [sessoes.usuarioId],
    references: [usuarios.id],
  }),
}));

export const relArtigos = relations(artigos, ({ one, many }) => ({
  autor: one(usuarios, {
    fields: [artigos.autorId],
    references: [usuarios.id],
  }),
  categoria: one(categorias, {
    fields: [artigos.categoriaId],
    references: [categorias.id],
  }),
  tags: many(artigosTags),
}));

export const relCategorias = relations(categorias, ({ many }) => ({
  artigos: many(artigos),
}));

export const relTags = relations(tags, ({ many }) => ({
  artigos: many(artigosTags),
}));

export const relArtigosTags = relations(artigosTags, ({ one }) => ({
  artigo: one(artigos, {
    fields: [artigosTags.artigoId],
    references: [artigos.id],
  }),
  tag: one(tags, { fields: [artigosTags.tagId], references: [tags.id] }),
}));

export type Artigo = typeof artigos.$inferSelect;
export type NovoArtigo = typeof artigos.$inferInsert;
export type Usuario = typeof usuarios.$inferSelect;
export type Categoria = typeof categorias.$inferSelect;
