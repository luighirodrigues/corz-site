import "server-only";
import sanitizeHtml from "sanitize-html";
import slugify from "slugify";
import { and, desc, eq, isNotNull, lte, or, sql, ne } from "drizzle-orm";
import { db, esquema } from "@/db";
import { artigosDemo, categoriasDemo } from "@/conteudo/artigos-demo";

/**
 * Modo vitrine.
 *
 * Enquanto não houver `DATABASE_URL`, as consultas públicas respondem a
 * partir do conteúdo local em `conteudo/artigos-demo`. É o que permite
 * subir o site inteiro e navegar o blog antes de existir Postgres no
 * servidor, sem stub espalhado pelas páginas: quem chama continua
 * chamando a mesma função e recebendo a mesma forma de registro.
 *
 * A verificação é feita a cada chamada, e não uma vez na importação,
 * porque a variável é lida em execução: o mesmo build precisa servir
 * homologação sem banco e produção com banco.
 *
 * A escrita não tem equivalente de vitrine, de propósito. Publicar
 * exige banco, e é melhor falhar de forma clara no painel do que fingir
 * que o artigo foi salvo em algum lugar.
 */
function semBanco() {
  return !process.env.DATABASE_URL;
}

let avisou = false;

/**
 * Executa a consulta e, se o banco não responder, entrega a vitrine.
 *
 * Isto não é só conveniência de homologação. Uma página institucional
 * não pode devolver erro 500 porque o Postgres piscou: o visitante veio
 * ler um artigo, e derrubar a rota inteira é o pior desfecho possível
 * para ele e para a indexação da página.
 *
 * O aviso sai uma vez por processo. Repetir a cada requisição só entope
 * o log e esconde o que importa.
 */
async function comVitrine<T>(
  consulta: () => Promise<T>,
  // `NoInfer` faz o formato ser ditado pela consulta real. O conteúdo
  // local precisa caber nela, e não o contrário: se um campo sumir do
  // banco, o erro aparece aqui e não em produção.
  alternativa: () => NoInfer<T>
): Promise<T> {
  if (semBanco()) return alternativa();

  try {
    return await consulta();
  } catch (erro) {
    if (!avisou) {
      avisou = true;
      console.warn(
        "[artigos] banco indisponível, servindo o conteúdo local do blog.",
        erro instanceof Error ? erro.message : erro
      );
    }
    return alternativa();
  }
}

/* ============================================================
   Camada de artigos
   ============================================================ */

/**
 * Sanitização do HTML do editor.
 *
 * Lista de permissões, nunca de bloqueios: qualquer tag ou atributo
 * não listado aqui é descartado. É o que impede que um editor com
 * conta comprometida injete script na página pública.
 */
const REGRAS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p", "br", "hr",
    "h2", "h3", "h4",
    "strong", "em", "u", "s", "mark", "sup", "sub",
    "ul", "ol", "li",
    "blockquote", "cite",
    "a", "img", "figure", "figcaption",
    "table", "thead", "tbody", "tr", "th", "td",
    "code", "pre",
    "iframe",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height", "loading", "decoding"],
    iframe: ["src", "title", "allow", "allowfullscreen", "loading"],
    th: ["colspan", "rowspan", "scope"],
    td: ["colspan", "rowspan"],
    "*": ["id"],
  },
  allowedSchemes: ["https", "mailto", "tel"],
  allowedSchemesByTag: { img: ["https", "data"] },
  // Só permitimos incorporação de players conhecidos. Iframe livre é
  // equivalente a permitir script de terceiro dentro do artigo.
  allowedIframeHostnames: [
    "www.youtube-nocookie.com",
    "www.youtube.com",
    "open.spotify.com",
    "player.vimeo.com",
  ],
  transformTags: {
    a: (nomeTag, atributos) => {
      const href = atributos.href ?? "";
      const externo = /^https?:\/\//i.test(href) && !href.includes("corz.com.br");
      return {
        tagName: nomeTag,
        attribs: {
          ...atributos,
          ...(externo
            ? { target: "_blank", rel: "noopener noreferrer nofollow" }
            : {}),
        },
      };
    },
    img: (nomeTag, atributos) => ({
      tagName: nomeTag,
      attribs: { ...atributos, loading: "lazy", decoding: "async" },
    }),
  },
  nonTextTags: ["style", "script", "textarea", "option", "noscript"],
};

export function sanitizar(html: string) {
  return sanitizeHtml(html, REGRAS);
}

export function paraTextoPuro(html: string) {
  return sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, " ")
    .trim();
}

/** 200 palavras por minuto — média confortável para leitura técnica em pt-BR. */
export function minutosDeLeitura(texto: string) {
  const palavras = texto.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

export function gerarSlug(titulo: string) {
  return slugify(titulo, { lower: true, strict: true, locale: "pt" }).slice(
    0,
    200
  );
}

/** Garante unicidade acrescentando sufixo numérico quando necessário. */
export async function slugDisponivel(slug: string, ignorarId?: string) {
  let candidato = slug;
  let contador = 2;

  for (;;) {
    const existentes = await db
      .select({ id: esquema.artigos.id })
      .from(esquema.artigos)
      .where(
        ignorarId
          ? and(
              eq(esquema.artigos.slug, candidato),
              ne(esquema.artigos.id, ignorarId)
            )
          : eq(esquema.artigos.slug, candidato)
      )
      .limit(1);

    if (existentes.length === 0) return candidato;
    candidato = `${slug}-${contador++}`.slice(0, 200);
  }
}

/* ---------- Consultas públicas ---------------------------- */

/**
 * Condição de visibilidade pública.
 *
 * Um artigo aparece se estiver PUBLICADO com data já passada, ou se
 * estiver AGENDADO e o horário já chegou. A segunda metade é o que faz
 * o agendamento funcionar mesmo se a tarefa de publicação atrasar —
 * o site nunca fica esperando um cron rodar.
 */
function visivel() {
  const agora = sql`now()`;
  return or(
    and(
      eq(esquema.artigos.status, "PUBLICADO"),
      isNotNull(esquema.artigos.publicadoEm),
      lte(esquema.artigos.publicadoEm, agora)
    ),
    and(
      eq(esquema.artigos.status, "AGENDADO"),
      isNotNull(esquema.artigos.agendadoPara),
      lte(esquema.artigos.agendadoPara, agora)
    )
  );
}

const CAMPOS_LISTA = {
  id: esquema.artigos.id,
  slug: esquema.artigos.slug,
  titulo: esquema.artigos.titulo,
  subtitulo: esquema.artigos.subtitulo,
  resumo: esquema.artigos.resumo,
  capaUrl: esquema.artigos.capaUrl,
  capaAlt: esquema.artigos.capaAlt,
  tempoLeitura: esquema.artigos.tempoLeitura,
  destaque: esquema.artigos.destaque,
  publicadoEm: esquema.artigos.publicadoEm,
  agendadoPara: esquema.artigos.agendadoPara,
  atualizadoEm: esquema.artigos.atualizadoEm,
  categoriaNome: esquema.categorias.nome,
  categoriaSlug: esquema.categorias.slug,
  categoriaCor: esquema.categorias.cor,
  autorNome: esquema.usuarios.nome,
};

export async function listarPublicados({
  limite = 12,
  deslocamento = 0,
  categoria,
}: { limite?: number; deslocamento?: number; categoria?: string } = {}) {
  const condicoes = categoria
    ? and(visivel(), eq(esquema.categorias.slug, categoria))
    : visivel();

  return comVitrine(
    () =>
      db
        .select(CAMPOS_LISTA)
        .from(esquema.artigos)
        .leftJoin(
          esquema.categorias,
          eq(esquema.artigos.categoriaId, esquema.categorias.id)
        )
        .leftJoin(
          esquema.usuarios,
          eq(esquema.artigos.autorId, esquema.usuarios.id)
        )
        .where(condicoes)
        .orderBy(
          desc(
            sql`coalesce(${esquema.artigos.publicadoEm}, ${esquema.artigos.agendadoPara})`
          )
        )
        .limit(limite)
        .offset(deslocamento),
    () =>
      artigosDemo
        .filter((a) => !categoria || a.categoriaSlug === categoria)
        .slice(deslocamento, deslocamento + limite)
  );
}

export async function contarPublicados(categoria?: string) {
  const condicoes = categoria
    ? and(visivel(), eq(esquema.categorias.slug, categoria))
    : visivel();

  return comVitrine(
    async () => {
      const [linha] = await db
        .select({ total: sql<number>`count(*)::int` })
        .from(esquema.artigos)
        .leftJoin(
          esquema.categorias,
          eq(esquema.artigos.categoriaId, esquema.categorias.id)
        )
        .where(condicoes);

      return linha?.total ?? 0;
    },
    () =>
      artigosDemo.filter((a) => !categoria || a.categoriaSlug === categoria)
        .length
  );
}

export async function buscarPublicado(slug: string) {
  const consulta = () =>
    db
      .select({
        ...CAMPOS_LISTA,
        conteudo: esquema.artigos.conteudo,
        textoPuro: esquema.artigos.textoPuro,
        respostaCurta: esquema.artigos.respostaCurta,
        faq: esquema.artigos.faq,
        seoTitulo: esquema.artigos.seoTitulo,
        seoDescricao: esquema.artigos.seoDescricao,
        seoImagem: esquema.artigos.seoImagem,
        canonical: esquema.artigos.canonical,
        noindex: esquema.artigos.noindex,
        criadoEm: esquema.artigos.criadoEm,
        autorCargo: esquema.usuarios.cargo,
        autorBio: esquema.usuarios.bio,
      })
      .from(esquema.artigos)
      .leftJoin(
        esquema.categorias,
        eq(esquema.artigos.categoriaId, esquema.categorias.id)
      )
      .leftJoin(
        esquema.usuarios,
        eq(esquema.artigos.autorId, esquema.usuarios.id)
      )
      .where(and(eq(esquema.artigos.slug, slug), visivel()))
      .limit(1);

  // O artigo pode não existir, então o tipo precisa admitir nulo. Sem
  // esta anotação a inferência sai da linha encontrada e o conteúdo
  // local, que também pode não achar nada, deixa de encaixar.
  type Linha = Awaited<ReturnType<typeof consulta>>[number] | null;

  return comVitrine<Linha>(
    async () => (await consulta())[0] ?? null,
    () => artigosDemo.find((a) => a.slug === slug) ?? null
  );
}

export async function relacionados(artigoId: string, categoriaSlug?: string | null) {
  return comVitrine(
    () =>
      db
        .select(CAMPOS_LISTA)
        .from(esquema.artigos)
        .leftJoin(
          esquema.categorias,
          eq(esquema.artigos.categoriaId, esquema.categorias.id)
        )
        .leftJoin(
          esquema.usuarios,
          eq(esquema.artigos.autorId, esquema.usuarios.id)
        )
        .where(
          and(
            visivel(),
            ne(esquema.artigos.id, artigoId),
            categoriaSlug ? eq(esquema.categorias.slug, categoriaSlug) : sql`true`
          )
        )
        .orderBy(desc(esquema.artigos.publicadoEm))
        .limit(3),
    () => {
      const mesmaCategoria = artigosDemo.filter(
        (a) =>
          a.id !== artigoId &&
          (!categoriaSlug || a.categoriaSlug === categoriaSlug)
      );
      // Completa com artigos de outras categorias quando a própria não
      // tem três: faixa de relacionados vazia fica pior que variada.
      const complemento = artigosDemo.filter(
        (a) => a.id !== artigoId && !mesmaCategoria.includes(a)
      );
      return [...mesmaCategoria, ...complemento].slice(0, 3);
    }
  );
}

export async function listarCategorias() {
  return comVitrine(
    () =>
      db
        .select({
          id: esquema.categorias.id,
          slug: esquema.categorias.slug,
          nome: esquema.categorias.nome,
          descricao: esquema.categorias.descricao,
          cor: esquema.categorias.cor,
          total: sql<number>`count(${esquema.artigos.id})::int`,
        })
        .from(esquema.categorias)
        .leftJoin(
          esquema.artigos,
          and(eq(esquema.artigos.categoriaId, esquema.categorias.id), visivel())
        )
        .groupBy(esquema.categorias.id)
        .orderBy(esquema.categorias.ordem),
    () =>
      categoriasDemo.map((c) => ({
        ...c,
        total: artigosDemo.filter((a) => a.categoriaSlug === c.slug).length,
      }))
  );
}

/* ---------- Publicação agendada --------------------------- */

/**
 * Promove a PUBLICADO todo artigo AGENDADO cuja hora já passou.
 * Idempotente: rodar duas vezes não muda nada na segunda.
 */
export async function publicarAgendados() {
  const publicados = await db
    .update(esquema.artigos)
    .set({
      status: "PUBLICADO",
      publicadoEm: sql`coalesce(${esquema.artigos.agendadoPara}, now())`,
      atualizadoEm: new Date(),
    })
    .where(
      and(
        eq(esquema.artigos.status, "AGENDADO"),
        isNotNull(esquema.artigos.agendadoPara),
        lte(esquema.artigos.agendadoPara, sql`now()`)
      )
    )
    .returning({
      id: esquema.artigos.id,
      slug: esquema.artigos.slug,
      titulo: esquema.artigos.titulo,
    });

  return publicados;
}
