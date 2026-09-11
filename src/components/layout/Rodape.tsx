import Link from "next/link";
import Logo from "@/components/marca/Logo";
import { rodape, site } from "@/conteudo/site";
import { visiveis } from "@/lib/visibilidade";
import { Rotulo } from "@/components/sistema/primitivos";

const colunas = [
  { titulo: "Soluções", itens: visiveis(rodape.solucoes) },
  { titulo: "Institucional", itens: visiveis(rodape.institucional) },
  { titulo: "Suporte", itens: visiveis(rodape.conteudo) },
];

export default function Rodape() {
  const ano = new Date().getFullYear();

  return (
    <footer className="sup-escura relative overflow-hidden bg-tinta-950 text-branco">
      <div className="malha-escura absolute inset-0 opacity-45" aria-hidden />

      <div className="relative mx-auto w-full max-w-[84rem] px-5 sm:px-8">
        {/* Assinatura em escala editorial */}
        <div className="border-b border-branco/10 py-16 sm:py-24">
          <Rotulo cor="ciano">Desde {site.fundacao} · {site.cidade}/{site.uf}</Rotulo>
          <p className="mt-6 font-display text-[clamp(2.25rem,7vw,5.25rem)] font-bold leading-[0.92] tracking-[-0.04em]">
            Tecnologia sem
            <br />
            dor de cabeça.
          </p>
        </div>

        <div className="grid gap-12 py-14 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-4">
            <Logo className="h-7" />
            <p className="mt-5 max-w-[30ch] text-[0.9375rem] leading-relaxed text-branco/55">
              Especialistas em continuidade operacional para empresas com
              múltiplas unidades que não podem parar.
            </p>

            <address className="mt-7 space-y-1.5 text-[0.875rem] not-italic leading-relaxed text-branco/55">
              <p>{site.endereco.logradouro}</p>
              <p>
                {site.endereco.bairro} · {site.endereco.cidade}/
                {site.endereco.uf} · {site.endereco.cep}
              </p>
              <p className="pt-2">
                <a
                  href={`tel:${site.telefoneE164}`}
                  className="text-branco/80 transition-colors hover:text-ciano"
                >
                  {site.telefone}
                </a>
              </p>
              <p>
                <a
                  href={`mailto:${site.email}`}
                  className="text-branco/80 transition-colors hover:text-ciano"
                >
                  {site.email}
                </a>
              </p>
            </address>

            <div className="mt-7 flex gap-3">
              <a
                href={site.redes.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da CORZ"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-branco/15 text-branco/70 transition-colors hover:border-ciano hover:text-ciano"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 6.11a3.73 3.73 0 1 0 0 7.46 3.73 3.73 0 0 0 0-7.46Zm0 6.15a2.42 2.42 0 1 1 0-4.84 2.42 2.42 0 0 1 0 4.84Zm4.75-6.3a.87.87 0 1 1-1.74 0 .87.87 0 0 1 1.74 0Z" />
                </svg>
              </a>
              <a
                href={site.redes.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn da CORZ"
                className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-branco/15 text-branco/70 transition-colors hover:border-ciano hover:text-ciano"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.3 8.94h3.4V21H3.3V8.94Zm5.55 0h3.26v1.65h.05c.45-.86 1.56-1.77 3.22-1.77 3.44 0 4.08 2.27 4.08 5.21V21h-3.4v-5.32c0-1.27-.02-2.9-1.77-2.9-1.77 0-2.04 1.38-2.04 2.81V21h-3.4V8.94Z" />
                </svg>
              </a>
            </div>
          </div>

          {colunas.map((coluna) => (
            <nav
              key={coluna.titulo}
              aria-label={coluna.titulo}
              className="md:col-span-2"
            >
              <h2 className="rotulo text-branco/40">{coluna.titulo}</h2>
              <ul className="mt-5 space-y-2.5">
                {coluna.itens.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-[0.875rem] text-branco/60 transition-colors duration-200 hover:text-branco"
                    >
                      {item.rotulo}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="md:col-span-2">
            <h2 className="rotulo text-branco/40">Atendimento</h2>
            <dl className="mt-5 space-y-4 text-[0.875rem]">
              <div>
                <dt className="text-branco/40">Comercial</dt>
                <dd className="text-branco/70">{site.atendimento.comercial}</dd>
              </div>
              <div>
                <dt className="text-branco/40">Suporte</dt>
                <dd className="text-branco/70">
                  Primeira resposta em até {site.atendimento.slaPrimeiraResposta}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-branco/10 py-7 text-[0.8125rem] text-branco/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {ano} {site.razaoSocial} · CNPJ {site.cnpj}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {rodape.legal.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-branco/80"
                >
                  {item.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
