/**
 * Constantes compartilhadas entre o middleware (runtime de borda) e o
 * servidor Node.
 *
 * Ficam separadas de propósito: o middleware roda na borda, onde não
 * existe módulo nativo. Importar `lib/auth` ali arrastaria o Argon2
 * junto e quebraria o build.
 */

export const NOME_COOKIE = "corz_sessao";
export const NOME_CSRF = "corz_csrf";

/** 8 horas de inatividade encerram a sessão. */
export const OCIOSIDADE_MS = 8 * 60 * 60 * 1000;

/** 7 dias é o teto absoluto, mesmo com uso contínuo. */
export const VIDA_MAXIMA_MS = 7 * 24 * 60 * 60 * 1000;

/** Domínio definitivo do site. */
export const DOMINIO_CANONICO = "corz.com.br";

export const URL_CONFIGURADA = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://corz.com.br"
).replace(/\/$/, "");

/**
 * O site só se deixa indexar quando serve no domínio definitivo.
 *
 * Regra derivada, não bandeira de configuração, e isso é deliberado:
 * bandeira se esquece. Ambiente de homologação indexado vira uma cópia
 * do site competindo com o original nos resultados de busca, e limpar
 * isso custa semanas de reindexação.
 *
 * Em qualquer outro endereço, tudo sai com noindex, o robots bloqueia
 * por completo e o sitemap vem vazio. Ao apontar o domínio real, volta
 * ao normal sozinho — ninguém precisa lembrar de destravar nada.
 */
export const INDEXAVEL = URL_CONFIGURADA.includes(DOMINIO_CANONICO);
