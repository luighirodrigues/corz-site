CREATE TYPE "public"."origem_lead" AS ENUM('CONTATO', 'DIAGNOSTICO', 'SUPORTE', 'MATERIAL', 'NEWSLETTER');--> statement-breakpoint
CREATE TYPE "public"."papel" AS ENUM('ADMIN', 'EDITOR', 'AUTOR');--> statement-breakpoint
CREATE TYPE "public"."status_artigo" AS ENUM('RASCUNHO', 'AGENDADO', 'PUBLICADO', 'ARQUIVADO');--> statement-breakpoint
CREATE TABLE "artigos" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(200) NOT NULL,
	"titulo" varchar(200) NOT NULL,
	"subtitulo" text,
	"resumo" text NOT NULL,
	"conteudo" text NOT NULL,
	"texto_puro" text DEFAULT '' NOT NULL,
	"status" "status_artigo" DEFAULT 'RASCUNHO' NOT NULL,
	"capa_url" text,
	"capa_alt" varchar(240),
	"publicado_em" timestamp with time zone,
	"agendado_para" timestamp with time zone,
	"revisado_em" timestamp with time zone,
	"destaque" boolean DEFAULT false NOT NULL,
	"tempo_leitura" integer DEFAULT 1 NOT NULL,
	"visualizacoes" integer DEFAULT 0 NOT NULL,
	"seo_titulo" varchar(180),
	"seo_descricao" text,
	"seo_imagem" text,
	"canonical" text,
	"noindex" boolean DEFAULT false NOT NULL,
	"faq" jsonb,
	"resposta_curta" text,
	"autor_id" text NOT NULL,
	"categoria_id" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "artigos_tags" (
	"artigo_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "artigos_tags_artigo_id_tag_id_pk" PRIMARY KEY("artigo_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "assinantes" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(180) NOT NULL,
	"nome" varchar(160),
	"confirmado" boolean DEFAULT false NOT NULL,
	"token_confirmacao" text,
	"token_descadastro" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmado_em" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "categorias" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(120) NOT NULL,
	"nome" varchar(120) NOT NULL,
	"descricao" text,
	"cor" varchar(9) DEFAULT '#00ADE7' NOT NULL,
	"ordem" integer DEFAULT 0 NOT NULL,
	"seo_titulo" varchar(180),
	"seo_descricao" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "configuracoes" (
	"chave" varchar(120) PRIMARY KEY NOT NULL,
	"valor" jsonb NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" varchar(160) NOT NULL,
	"email" varchar(180) NOT NULL,
	"telefone" varchar(40),
	"empresa" varchar(160),
	"cargo" varchar(120),
	"interesse" varchar(120),
	"mensagem" text,
	"origem" "origem_lead" DEFAULT 'CONTATO' NOT NULL,
	"pagina" text,
	"utm" jsonb,
	"ip" varchar(64),
	"lido" boolean DEFAULT false NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "logs_auditoria" (
	"id" text PRIMARY KEY NOT NULL,
	"usuario_id" text,
	"acao" varchar(80) NOT NULL,
	"entidade" varchar(60) NOT NULL,
	"entidade_id" text,
	"detalhe" jsonb,
	"ip" varchar(64),
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "midias" (
	"id" text PRIMARY KEY NOT NULL,
	"chave" text NOT NULL,
	"url" text NOT NULL,
	"nome" varchar(240) NOT NULL,
	"mime" varchar(80) NOT NULL,
	"tamanho" integer NOT NULL,
	"largura" integer,
	"altura" integer,
	"alt" varchar(240),
	"enviado_por" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "redirecionamentos" (
	"id" text PRIMARY KEY NOT NULL,
	"de" text NOT NULL,
	"para" text NOT NULL,
	"tipo" integer DEFAULT 301 NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessoes" (
	"id" text PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"usuario_id" text NOT NULL,
	"expira_em" timestamp with time zone NOT NULL,
	"ultimo_uso" timestamp with time zone DEFAULT now() NOT NULL,
	"ip" varchar(64),
	"agente" text,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" varchar(120) NOT NULL,
	"nome" varchar(120) NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tentativas_login" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(180) NOT NULL,
	"ip" varchar(64) NOT NULL,
	"sucesso" boolean DEFAULT false NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usuarios" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" varchar(120) NOT NULL,
	"email" varchar(180) NOT NULL,
	"senha_hash" text NOT NULL,
	"papel" "papel" DEFAULT 'AUTOR' NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"avatar_url" text,
	"cargo" varchar(120),
	"bio" text,
	"segredo_2fa" text,
	"dois_fatores" boolean DEFAULT false NOT NULL,
	"codigos_backup" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"senha_alterada_em" timestamp with time zone DEFAULT now() NOT NULL,
	"ultimo_acesso" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "artigos" ADD CONSTRAINT "artigos_autor_id_usuarios_id_fk" FOREIGN KEY ("autor_id") REFERENCES "public"."usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artigos" ADD CONSTRAINT "artigos_categoria_id_categorias_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categorias"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artigos_tags" ADD CONSTRAINT "artigos_tags_artigo_id_artigos_id_fk" FOREIGN KEY ("artigo_id") REFERENCES "public"."artigos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "artigos_tags" ADD CONSTRAINT "artigos_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "midias" ADD CONSTRAINT "midias_enviado_por_usuarios_id_fk" FOREIGN KEY ("enviado_por") REFERENCES "public"."usuarios"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "artigos_slug_idx" ON "artigos" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "artigos_publicacao_idx" ON "artigos" USING btree ("status","publicado_em");--> statement-breakpoint
CREATE INDEX "artigos_agenda_idx" ON "artigos" USING btree ("status","agendado_para");--> statement-breakpoint
CREATE INDEX "artigos_categoria_idx" ON "artigos" USING btree ("categoria_id");--> statement-breakpoint
CREATE UNIQUE INDEX "assinantes_email_idx" ON "assinantes" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "categorias_slug_idx" ON "categorias" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "leads_data_idx" ON "leads" USING btree ("criado_em");--> statement-breakpoint
CREATE INDEX "auditoria_data_idx" ON "logs_auditoria" USING btree ("criado_em");--> statement-breakpoint
CREATE INDEX "auditoria_entidade_idx" ON "logs_auditoria" USING btree ("entidade","entidade_id");--> statement-breakpoint
CREATE UNIQUE INDEX "midias_chave_idx" ON "midias" USING btree ("chave");--> statement-breakpoint
CREATE UNIQUE INDEX "redirecionamentos_de_idx" ON "redirecionamentos" USING btree ("de");--> statement-breakpoint
CREATE UNIQUE INDEX "sessoes_token_idx" ON "sessoes" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "sessoes_usuario_idx" ON "sessoes" USING btree ("usuario_id");--> statement-breakpoint
CREATE INDEX "sessoes_expira_idx" ON "sessoes" USING btree ("expira_em");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tentativas_email_idx" ON "tentativas_login" USING btree ("email","criado_em");--> statement-breakpoint
CREATE INDEX "tentativas_ip_idx" ON "tentativas_login" USING btree ("ip","criado_em");--> statement-breakpoint
CREATE UNIQUE INDEX "usuarios_email_idx" ON "usuarios" USING btree ("email");