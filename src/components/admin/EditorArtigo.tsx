"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";
import EditorTexto from "./EditorTexto";
import { apiAdmin, deCampoDataHora } from "@/lib/cliente";

export type Rascunho = {
  id?: string;
  titulo: string;
  slug: string;
  subtitulo: string;
  resumo: string;
  conteudo: string;
  respostaCurta: string;
  status: "RASCUNHO" | "AGENDADO" | "PUBLICADO" | "ARQUIVADO";
  agendadoPara: string;
  capaUrl: string;
  capaAlt: string;
  categoriaId: string;
  tags: string[];
  destaque: boolean;
  seoTitulo: string;
  seoDescricao: string;
  seoImagem: string;
  canonical: string;
  noindex: boolean;
  faq: { pergunta: string; resposta: string }[];
};

const VAZIO: Rascunho = {
  titulo: "",
  slug: "",
  subtitulo: "",
  resumo: "",
  conteudo: "",
  respostaCurta: "",
  status: "RASCUNHO",
  agendadoPara: "",
  capaUrl: "",
  capaAlt: "",
  categoriaId: "",
  tags: [],
  destaque: false,
  seoTitulo: "",
  seoDescricao: "",
  seoImagem: "",
  canonical: "",
  noindex: false,
  faq: [],
};

const STATUS = [
  { valor: "RASCUNHO", rotulo: "Rascunho", ajuda: "Só a equipe enxerga" },
  { valor: "AGENDADO", rotulo: "Agendado", ajuda: "Publica sozinho na hora marcada" },
  { valor: "PUBLICADO", rotulo: "Publicado", ajuda: "No ar imediatamente" },
  { valor: "ARQUIVADO", rotulo: "Arquivado", ajuda: "Sai do ar, endereço preservado" },
] as const;

function paraSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export default function EditorArtigo({
  inicial,
  categorias,
  podePublicar,
}: {
  inicial?: Partial<Rascunho>;
  categorias: { id: string; nome: string }[];
  podePublicar: boolean;
}) {
  const router = useRouter();
  const [artigo, setArtigo] = useState<Rascunho>({ ...VAZIO, ...inicial });
  const [slugTravado, setSlugTravado] = useState(Boolean(inicial?.slug));
  const [salvando, setSalvando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: "erro" | "ok"; texto: string } | null>(
    null
  );
  const [aba, setAba] = useState<"conteudo" | "busca" | "publicacao">("conteudo");

  const definir = <K extends keyof Rascunho>(chave: K, valor: Rascunho[K]) =>
    setArtigo((a) => ({ ...a, [chave]: valor }));

  const tituloBusca = artigo.seoTitulo || artigo.titulo;
  const descricaoBusca = artigo.seoDescricao || artigo.resumo;

  const alertas = useMemo(() => {
    const lista: string[] = [];
    if (tituloBusca.length > 62)
      lista.push("O título de busca passa de 62 caracteres e será cortado no Google.");
    if (descricaoBusca && descricaoBusca.length > 165)
      lista.push("A descrição de busca passa de 165 caracteres e será cortada.");
    if (!artigo.respostaCurta)
      lista.push(
        "Sem resposta curta o artigo perde a chance de ser citado por assistentes de IA."
      );
    if (!artigo.capaUrl) lista.push("Sem imagem de capa o compartilhamento fica sem cartão.");
    if (artigo.status === "AGENDADO" && !artigo.agendadoPara)
      lista.push("Status agendado exige data e hora.");
    return lista;
  }, [tituloBusca, descricaoBusca, artigo]);

  async function salvar(statusForcado?: Rascunho["status"]) {
    setSalvando(true);
    setAviso(null);

    const status = statusForcado ?? artigo.status;
    const corpo = {
      ...artigo,
      status,
      slug: artigo.slug || paraSlug(artigo.titulo),
      agendadoPara:
        status === "AGENDADO" ? deCampoDataHora(artigo.agendadoPara) : "",
      faq: artigo.faq.filter((f) => f.pergunta.trim() && f.resposta.trim()),
    };

    const { ok, dados } = await apiAdmin("/api/admin/artigos", {
      metodo: artigo.id ? "PUT" : "POST",
      corpo: artigo.id ? { id: artigo.id, ...corpo } : corpo,
    });

    setSalvando(false);

    if (!ok) {
      const erros = dados.erros as Record<string, string> | undefined;
      setAviso({
        tipo: "erro",
        texto:
          (dados.erro as string) ??
          (erros ? Object.values(erros)[0]! : "Não foi possível salvar."),
      });
      return;
    }

    setAviso({ tipo: "ok", texto: "Artigo salvo." });
    if (!artigo.id && dados.id) {
      router.replace(`/admin/artigos/${dados.id}`);
    }
    router.refresh();
  }

  const campo =
    "mt-2 w-full rounded-[10px] border border-petroleo/18 bg-branco px-4 py-2.5 text-[0.9375rem] text-tinta-900 outline-none transition-colors duration-200 placeholder:text-tinta-900/28 focus:border-[#1D4FD8]";

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="lg:col-span-8">
        <input
          value={artigo.titulo}
          onChange={(e) => {
            definir("titulo", e.target.value);
            if (!slugTravado) definir("slug", paraSlug(e.target.value));
          }}
          placeholder="Título do artigo"
          aria-label="Título do artigo"
          className="w-full bg-transparent font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.06] tracking-[-0.038em] text-tinta-900 outline-none placeholder:text-tinta-900/22"
        />

        <input
          value={artigo.subtitulo}
          onChange={(e) => definir("subtitulo", e.target.value)}
          placeholder="Linha de apoio (opcional)"
          aria-label="Subtítulo"
          className="mt-3 w-full bg-transparent text-[1.0625rem] text-tinta-900/65 outline-none placeholder:text-tinta-900/25"
        />

        <div className="mt-5 flex flex-wrap items-center gap-2 border-y border-petroleo/12 py-3">
          <span className="rotulo text-petroleo/45">corz.com.br/blog/</span>
          <input
            value={artigo.slug}
            onChange={(e) => {
              setSlugTravado(true);
              definir("slug", paraSlug(e.target.value));
            }}
            placeholder="endereco-do-artigo"
            aria-label="Endereço do artigo"
            className="flex-1 bg-transparent font-mono text-[0.8125rem] text-tinta-900 outline-none"
          />
        </div>

        <div className="mt-6 flex gap-1 border-b border-petroleo/14">
          {(
            [
              ["conteudo", "Conteúdo"],
              ["busca", "Busca e IA"],
              ["publicacao", "Publicação"],
            ] as const
          ).map(([chave, rotulo]) => (
            <button
              key={chave}
              type="button"
              onClick={() => setAba(chave)}
              className={clsx(
                "relative px-4 py-2.5 text-[0.875rem] font-medium transition-colors",
                aba === chave
                  ? "text-tinta-900"
                  : "text-tinta-900/45 hover:text-tinta-900"
              )}
            >
              {rotulo}
              {aba === chave && (
                <span
                  aria-hidden
                  className="absolute inset-x-4 -bottom-px h-[2px] bg-[#1D4FD8]"
                />
              )}
            </button>
          ))}
        </div>

        {aba === "conteudo" && (
          <div className="mt-6 space-y-6">
            <div>
              <label htmlFor="resumo" className="rotulo text-petroleo/55">
                Resumo <span className="text-negativo">*</span>
              </label>
              <textarea
                id="resumo"
                value={artigo.resumo}
                onChange={(e) => definir("resumo", e.target.value)}
                rows={2}
                className={campo}
                placeholder="Duas linhas que fazem o leitor querer abrir. Aparece na listagem e no compartilhamento."
              />
              <Contador atual={artigo.resumo.length} ideal={300} />
            </div>

            <EditorTexto
              valorInicial={artigo.conteudo}
              aoMudar={(html) => definir("conteudo", html)}
            />
          </div>
        )}

        {aba === "busca" && (
          <div className="mt-6 space-y-6">
            <div className="rounded-[10px] border border-petroleo/14 bg-papel-050 p-5">
              <span className="rotulo text-petroleo/50">
                Prévia no resultado de busca
              </span>
              <div className="mt-4">
                <p className="font-mono text-[0.75rem] text-positivo">
                  corz.com.br › blog › {artigo.slug || "endereco"}
                </p>
                <p className="mt-1 text-[1.0625rem] leading-snug text-[#1a0dab]">
                  {tituloBusca || "Título do artigo"}
                </p>
                <p className="mt-1 max-w-[38rem] text-[0.8125rem] leading-relaxed text-tinta-900/65">
                  {descricaoBusca || "A descrição aparece aqui."}
                </p>
              </div>
            </div>

            <div>
              <label htmlFor="respostaCurta" className="rotulo text-petroleo/55">
                Resposta curta (para IA e destaque)
              </label>
              <textarea
                id="respostaCurta"
                value={artigo.respostaCurta}
                onChange={(e) => definir("respostaCurta", e.target.value)}
                rows={3}
                className={campo}
                placeholder="Entre 40 e 60 palavras respondendo diretamente à pergunta do artigo. É este trecho que assistentes de IA citam."
              />
              <p className="mt-2 text-[0.75rem] leading-relaxed text-tinta-900/45">
                Escreva como se fosse a única coisa que a pessoa vai ler. Sem
                “neste artigo você vai descobrir”: responda de fato.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="seoTitulo" className="rotulo text-petroleo/55">
                  Título de busca
                </label>
                <input
                  id="seoTitulo"
                  value={artigo.seoTitulo}
                  onChange={(e) => definir("seoTitulo", e.target.value)}
                  className={campo}
                  placeholder="Deixe vazio para usar o título do artigo"
                />
                <Contador atual={tituloBusca.length} ideal={62} />
              </div>
              <div>
                <label htmlFor="canonical" className="rotulo text-petroleo/55">
                  URL canônica
                </label>
                <input
                  id="canonical"
                  value={artigo.canonical}
                  onChange={(e) => definir("canonical", e.target.value)}
                  className={campo}
                  placeholder="Só se este conteúdo existir primeiro em outro lugar"
                />
              </div>
            </div>

            <div>
              <label htmlFor="seoDescricao" className="rotulo text-petroleo/55">
                Descrição de busca
              </label>
              <textarea
                id="seoDescricao"
                value={artigo.seoDescricao}
                onChange={(e) => definir("seoDescricao", e.target.value)}
                rows={2}
                className={campo}
                placeholder="Deixe vazio para usar o resumo"
              />
              <Contador atual={descricaoBusca.length} ideal={165} />
            </div>

            <ConstrutorFaq
              itens={artigo.faq}
              aoMudar={(faq) => definir("faq", faq)}
            />

            <label className="flex items-start gap-3 rounded-[10px] border border-petroleo/14 p-4">
              <input
                type="checkbox"
                checked={artigo.noindex}
                onChange={(e) => definir("noindex", e.target.checked)}
                className="mt-1"
              />
              <span>
                <span className="block text-[0.9375rem] font-medium text-tinta-900">
                  Ocultar dos buscadores
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-tinta-900/55">
                  O artigo fica acessível pelo endereço, mas sai do índice.
                  Use para material de campanha ou página de agradecimento.
                </span>
              </span>
            </label>
          </div>
        )}

        {aba === "publicacao" && (
          <div className="mt-6 space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="capaUrl" className="rotulo text-petroleo/55">
                  Imagem de capa
                </label>
                <input
                  id="capaUrl"
                  value={artigo.capaUrl}
                  onChange={(e) => definir("capaUrl", e.target.value)}
                  className={campo}
                  placeholder="https://…"
                />
              </div>
              <div>
                <label htmlFor="capaAlt" className="rotulo text-petroleo/55">
                  Descrição da capa
                </label>
                <input
                  id="capaAlt"
                  value={artigo.capaAlt}
                  onChange={(e) => definir("capaAlt", e.target.value)}
                  className={campo}
                  placeholder="O que a imagem mostra"
                />
              </div>
            </div>

            {artigo.capaUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={artigo.capaUrl}
                alt={artigo.capaAlt || "Prévia da capa"}
                className="w-full rounded-[10px] border border-petroleo/14"
              />
            )}

            <div>
              <label htmlFor="categoria" className="rotulo text-petroleo/55">
                Categoria
              </label>
              <select
                id="categoria"
                value={artigo.categoriaId}
                onChange={(e) => definir("categoriaId", e.target.value)}
                className={campo}
              >
                <option value="">Sem categoria</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            <CampoTags
              tags={artigo.tags}
              aoMudar={(tags) => definir("tags", tags)}
            />

            <label className="flex items-start gap-3 rounded-[10px] border border-petroleo/14 p-4">
              <input
                type="checkbox"
                checked={artigo.destaque}
                onChange={(e) => definir("destaque", e.target.checked)}
                className="mt-1"
              />
              <span>
                <span className="block text-[0.9375rem] font-medium text-tinta-900">
                  Destacar no topo do blog
                </span>
                <span className="mt-0.5 block text-[0.8125rem] text-tinta-900/55">
                  Só um artigo por vez costuma funcionar.
                </span>
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Barra lateral de publicação */}
      <aside className="lg:col-span-4">
        <div className="lg:sticky lg:top-24 space-y-5">
          <div className="rounded-[10px] border border-petroleo/14 bg-branco p-5">
            <span className="rotulo text-petroleo/50">Situação</span>

            <div className="mt-4 space-y-1.5">
              {STATUS.map((s) => {
                const bloqueado = !podePublicar && s.valor !== "RASCUNHO";
                return (
                  <label
                    key={s.valor}
                    className={clsx(
                      "flex cursor-pointer items-start gap-3 rounded-[10px] border p-3 transition-colors",
                      artigo.status === s.valor
                        ? "border-[#1D4FD8] bg-[#1D4FD8]/[0.05]"
                        : "border-petroleo/12 hover:border-petroleo/30",
                      bloqueado && "cursor-not-allowed opacity-40"
                    )}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={s.valor}
                      disabled={bloqueado}
                      checked={artigo.status === s.valor}
                      onChange={() => definir("status", s.valor)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-[0.875rem] font-semibold text-tinta-900">
                        {s.rotulo}
                      </span>
                      <span className="block text-[0.75rem] text-tinta-900/55">
                        {s.ajuda}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>

            {artigo.status === "AGENDADO" && (
              <div className="mt-4 border-t border-petroleo/12 pt-4">
                <label htmlFor="agendadoPara" className="rotulo text-petroleo/55">
                  Publicar em
                </label>
                <input
                  id="agendadoPara"
                  type="datetime-local"
                  value={artigo.agendadoPara}
                  onChange={(e) => definir("agendadoPara", e.target.value)}
                  className={campo}
                />
                <p className="mt-2 text-[0.75rem] leading-relaxed text-tinta-900/50">
                  Horário de Brasília. O artigo entra no ar sozinho. Não
                  precisa ninguém acessar o painel na hora.
                </p>
              </div>
            )}

            {!podePublicar && (
              <p className="mt-4 rounded-[10px] border border-alerta/40 bg-alerta/[0.08] px-3 py-2.5 text-[0.75rem] leading-relaxed text-tinta-900/75">
                Seu perfil salva rascunhos. Um editor revisa e publica.
              </p>
            )}

            <div className="mt-5 space-y-2 border-t border-petroleo/12 pt-5">
              <button
                type="button"
                onClick={() => salvar()}
                disabled={salvando}
                className="w-full rounded-[10px] bg-[#1D4FD8] px-5 py-3 text-[0.9375rem] font-semibold text-branco transition-colors hover:bg-[#153bab] disabled:opacity-50"
              >
                {salvando ? "Salvando…" : "Salvar"}
              </button>
              {podePublicar && artigo.status !== "PUBLICADO" && (
                <button
                  type="button"
                  onClick={() => salvar("PUBLICADO")}
                  disabled={salvando}
                  className="w-full rounded-[10px] border border-petroleo/22 px-5 py-3 text-[0.875rem] font-semibold text-tinta-900 transition-colors hover:border-tinta-900 disabled:opacity-50"
                >
                  Publicar agora
                </button>
              )}
              {artigo.id && (
                <a
                  href={`/blog/${artigo.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full py-2 text-center text-[0.8125rem] text-tinta-900/55 transition-colors hover:text-[#1D4FD8]"
                >
                  Abrir no site ↗
                </a>
              )}
            </div>

            {aviso && (
              <p
                role="status"
                className={clsx(
                  "mt-4 rounded-[10px] px-3 py-2.5 text-[0.8125rem]",
                  aviso.tipo === "ok"
                    ? "border border-positivo/40 bg-positivo/10 text-tinta-900"
                    : "border border-negativo/40 bg-negativo/[0.07] text-negativo"
                )}
              >
                {aviso.texto}
              </p>
            )}
          </div>

          {alertas.length > 0 && (
            <div className="rounded-[10px] border border-petroleo/14 bg-branco p-5">
              <span className="rotulo text-alerta">Antes de publicar</span>
              <ul className="mt-4 space-y-2.5">
                {alertas.map((a) => (
                  <li
                    key={a}
                    className="flex gap-3 text-[0.8125rem] leading-relaxed text-tinta-900/70"
                  >
                    <span aria-hidden className="mt-[0.55rem] h-px w-3 shrink-0 bg-alerta" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function Contador({ atual, ideal }: { atual: number; ideal: number }) {
  const excedeu = atual > ideal;
  return (
    <p
      className={clsx(
        "mt-1.5 font-mono text-[0.625rem] tracking-[0.06em]",
        excedeu ? "text-negativo" : "text-tinta-900/35"
      )}
    >
      {atual} / {ideal} CARACTERES
    </p>
  );
}

function CampoTags({
  tags,
  aoMudar,
}: {
  tags: string[];
  aoMudar: (t: string[]) => void;
}) {
  const [entrada, setEntrada] = useState("");

  function adicionar() {
    const nova = entrada.trim();
    if (!nova || tags.includes(nova) || tags.length >= 12) return;
    aoMudar([...tags, nova]);
    setEntrada("");
  }

  return (
    <div>
      <span className="rotulo text-petroleo/55">Tags</span>
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-2 rounded-[6px] border border-petroleo/18 bg-papel-050 px-2.5 py-1 text-[0.8125rem] text-tinta-900"
          >
            {t}
            <button
              type="button"
              onClick={() => aoMudar(tags.filter((x) => x !== t))}
              aria-label={`Remover ${t}`}
              className="text-tinta-900/40 transition-colors hover:text-negativo"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <input
        value={entrada}
        onChange={(e) => setEntrada(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            adicionar();
          }
        }}
        onBlur={adicionar}
        placeholder="Escreva e pressione Enter"
        className="mt-2 w-full rounded-[10px] border border-petroleo/18 bg-branco px-4 py-2.5 text-[0.9375rem] outline-none focus:border-[#1D4FD8]"
      />
    </div>
  );
}

function ConstrutorFaq({
  itens,
  aoMudar,
}: {
  itens: { pergunta: string; resposta: string }[];
  aoMudar: (f: { pergunta: string; resposta: string }[]) => void;
}) {
  return (
    <div className="rounded-[10px] border border-petroleo/14 p-5">
      <div className="flex items-center justify-between">
        <span className="rotulo text-petroleo/50">Perguntas e respostas</span>
        <button
          type="button"
          onClick={() => aoMudar([...itens, { pergunta: "", resposta: "" }])}
          className="text-[0.8125rem] font-semibold text-[#1D4FD8]"
        >
          + Adicionar
        </button>
      </div>

      <p className="mt-3 text-[0.75rem] leading-relaxed text-tinta-900/50">
        Vira dado estruturado FAQPage na página. É o formato que o Google usa
        para resposta em destaque e o que assistentes de IA citam com mais
        frequência.
      </p>

      {itens.length === 0 ? (
        <p className="mt-4 text-[0.8125rem] text-tinta-900/40">
          Nenhuma pergunta cadastrada.
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {itens.map((item, i) => (
            <li key={i} className="rounded-[10px] border border-petroleo/12 p-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[0.625rem] tracking-[0.1em] text-tinta-900/35">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <button
                  type="button"
                  onClick={() => aoMudar(itens.filter((_, j) => j !== i))}
                  className="text-[0.75rem] text-tinta-900/40 transition-colors hover:text-negativo"
                >
                  Remover
                </button>
              </div>
              <input
                value={item.pergunta}
                onChange={(e) => {
                  const copia = [...itens];
                  copia[i] = { ...item, pergunta: e.target.value };
                  aoMudar(copia);
                }}
                placeholder="Pergunta"
                className="mt-2 w-full border-b border-petroleo/14 bg-transparent py-2 text-[0.9375rem] font-medium text-tinta-900 outline-none focus:border-[#1D4FD8]"
              />
              <textarea
                value={item.resposta}
                onChange={(e) => {
                  const copia = [...itens];
                  copia[i] = { ...item, resposta: e.target.value };
                  aoMudar(copia);
                }}
                rows={3}
                placeholder="Resposta autossuficiente: quem ler só ela precisa entender."
                className="mt-2 w-full bg-transparent py-2 text-[0.875rem] leading-relaxed text-tinta-900/75 outline-none"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
