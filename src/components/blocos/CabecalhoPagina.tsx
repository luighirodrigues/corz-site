import Link from "next/link";
import { Destaque, Envelope, Rotulo } from "@/components/sistema/primitivos";
import Revelar from "@/components/sistema/Revelar";
import Icone, { type ChaveIcone } from "@/components/marca/Icones";

export type Migalha = { nome: string; caminho: string };

export default function CabecalhoPagina({
  rotulo,
  titulo,
  destaque,
  depois,
  texto,
  migalhas,
  indice,
  aside,
  icone,
  corIcone = "#00ADE7",
}: {
  rotulo: string;
  titulo: string;
  destaque?: string;
  depois?: string;
  texto?: string;
  migalhas?: Migalha[];
  indice?: string;
  aside?: React.ReactNode;
  /** Diagrama da solução, quando a página tem um. */
  icone?: ChaveIcone;
  corIcone?: string;
}) {
  return (
    <section className="sup-escura relative overflow-hidden bg-tinta-950 text-branco">
      <div aria-hidden className="absolute inset-0">
        <div className="malha-escura absolute inset-0 opacity-55" />
        <div
          className="absolute right-[-16%] top-[-30%] h-[42rem] w-[42rem] rounded-full opacity-35"
          style={{
            background:
              "radial-gradient(circle, #3F39BD 0%, #2C3191 40%, transparent 70%)",
          }}
        />
      </div>

      <Envelope className="relative pb-16 pt-[calc(var(--altura-cabecalho)+3rem)] sm:pb-20 sm:pt-[calc(var(--altura-cabecalho)+4.5rem)]">
        {migalhas && migalhas.length > 0 && (
          <nav aria-label="Trilha de navegação" className="mb-9">
            <ol className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[0.8125rem] text-branco/40">
              {migalhas.map((m, i) => (
                <li key={m.caminho} className="flex items-center gap-2.5">
                  {i > 0 && <span aria-hidden>/</span>}
                  {i === migalhas.length - 1 ? (
                    <span className="text-branco/60">{m.nome}</span>
                  ) : (
                    <Link
                      href={m.caminho}
                      className="transition-colors hover:text-ciano"
                    >
                      {m.nome}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className={aside ? "min-w-0 lg:col-span-7" : "min-w-0 lg:col-span-9"}>
            <Revelar>
              <div className="flex items-center gap-5">
                {icone && (
                  <span
                    aria-hidden
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px]"
                    style={{ background: `${corIcone}1F`, color: corIcone }}
                  >
                    <Icone nome={icone} className="h-8 w-8" />
                  </span>
                )}
                {indice && !icone && (
                  <span className="text-[0.8125rem] font-medium text-branco/35">
                    {indice}
                  </span>
                )}
                <Rotulo cor="ciano">{rotulo}</Rotulo>
              </div>
            </Revelar>

            <Revelar atraso={80}>
              <h1 className="mt-7 font-display text-[clamp(2.125rem,5.4vw,4rem)] font-bold leading-[1.0] tracking-[-0.042em]">
                {titulo}
                {destaque && (
                  <>
                    {" "}
                    <Destaque>{destaque}</Destaque>
                  </>
                )}
                {depois && ` ${depois}`}
              </h1>
            </Revelar>

            {texto && (
              <Revelar atraso={150}>
                <p className="mt-7 max-w-[54ch] text-[1.0625rem] leading-[1.62] text-branco/60 sm:text-[1.125rem]">
                  {texto}
                </p>
              </Revelar>
            )}
          </div>

          {aside && (
            <Revelar atraso={200} className="min-w-0 lg:col-span-5">
              {aside}
            </Revelar>
          )}
        </div>
      </Envelope>
    </section>
  );
}
