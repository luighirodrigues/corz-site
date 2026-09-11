import Link from "next/link";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import { rodape, site } from "@/conteudo/site";

export type SecaoLegal = {
  id: string;
  titulo: string;
  paragrafos: (string | string[])[];
};

export default function DocumentoLegal({
  rotulo,
  titulo,
  destaque,
  resumo,
  atualizadoEm,
  caminho,
  secoes,
}: {
  rotulo: string;
  titulo: string;
  destaque: string;
  resumo: string;
  atualizadoEm: string;
  caminho: string;
  secoes: SecaoLegal[];
}) {
  return (
    <>
      <CabecalhoPagina
        rotulo={rotulo}
        titulo={titulo}
        destaque={destaque}
        texto={resumo}
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Políticas", caminho: "/legal" },
          { nome: rotulo, caminho },
        ]}
      />

      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <nav
              aria-label="Índice do documento"
              className="lg:col-span-3 lg:sticky lg:top-[calc(var(--altura-cabecalho)+2rem)] lg:self-start"
            >
              <Rotulo cor="petroleo">Neste documento</Rotulo>
              <ol className="mt-5 space-y-2.5">
                {secoes.map((s, i) => (
                  <li key={s.id} className="flex gap-3">
                    <span className="font-mono text-[0.6875rem] tabular-nums text-petroleo/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <a
                      href={`#${s.id}`}
                      className="text-[0.875rem] leading-snug text-tinta-900/62 transition-colors hover:text-[#1D4FD8]"
                    >
                      {s.titulo}
                    </a>
                  </li>
                ))}
              </ol>

              <p className="mt-8 border-t border-petroleo/14 pt-5 font-mono text-[0.625rem] leading-relaxed tracking-[0.06em] text-tinta-900/40">
                ATUALIZADO EM {atualizadoEm.toUpperCase()}
              </p>

              <ul className="mt-6 space-y-2">
                {rodape.legal
                  .filter((l) => l.href !== caminho)
                  .map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-[0.8125rem] text-tinta-900/50 transition-colors hover:text-[#1D4FD8]"
                      >
                        {l.rotulo} →
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>

            <div className="lg:col-span-9">
              {secoes.map((secao, i) => (
                <section
                  key={secao.id}
                  id={secao.id}
                  className={i > 0 ? "mt-12 scroll-mt-32" : "scroll-mt-32"}
                >
                  <h2 className="flex gap-4 font-display text-[1.25rem] font-bold leading-snug tracking-[-0.028em] text-tinta-900 sm:text-[1.5rem]">
                    <span className="mt-1 font-mono text-[0.6875rem] tabular-nums font-normal text-petroleo/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {secao.titulo}
                  </h2>
                  <div className="mt-4 max-w-[70ch] space-y-4 pl-0 sm:pl-[2.2rem]">
                    {secao.paragrafos.map((p, j) =>
                      Array.isArray(p) ? (
                        <ul key={j} className="space-y-2 border-l border-petroleo/14 pl-5">
                          {p.map((item) => (
                            <li
                              key={item}
                              className="text-[0.9375rem] leading-[1.72] text-tinta-900/72"
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p
                          key={j}
                          className="text-[0.9375rem] leading-[1.76] text-tinta-900/72"
                        >
                          {p}
                        </p>
                      )
                    )}
                  </div>
                </section>
              ))}

              <div className="mt-14 rounded-[10px] border border-petroleo/14 bg-papel-050 p-7">
                <Rotulo cor="petroleo">Dúvidas sobre este documento</Rotulo>
                <p className="mt-4 max-w-[58ch] text-[0.9375rem] leading-relaxed text-tinta-900/70">
                  Fale com o encarregado de dados da {site.nomeCompleto} pelo
                  e-mail{" "}
                  <a
                    href={`mailto:${site.email}`}
                    className="font-semibold text-[#1D4FD8]"
                  >
                    {site.email}
                  </a>{" "}
                  ou pelo telefone {site.telefone}. Endereço para
                  correspondência: {site.endereco.logradouro},{" "}
                  {site.endereco.bairro}, {site.endereco.cidade}/
                  {site.endereco.uf}, CEP {site.endereco.cep}.
                </p>
              </div>
            </div>
          </div>
        </Envelope>
      </section>
    </>
  );
}
