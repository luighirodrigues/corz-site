import Link from "next/link";

/**
 * Página 404.
 *
 * Um endereço que não existe é quase sempre um link antigo, e a pessoa
 * que chegou aqui queria alguma coisa. Por isso a tela não termina em si
 * mesma: leva para as quatro frentes e para o contato.
 *
 * Fica no nível da raiz porque é o único lugar de onde o Next atende
 * endereço não encontrado, e por isso traz o próprio cabeçalho enxuto em
 * vez de herdar o do site.
 *
 * Como a tela de erro, é toda em estilo embutido e sem nenhuma classe do
 * Tailwind: um 404 costuma ser a primeira página que alguém vê depois de
 * uma publicação com problema, e uma página de erro descaracterizada
 * parece site quebrado em vez de link velho. Estilo embutido chega junto
 * com o HTML e não depende de nenhuma segunda requisição dar certo.
 *
 * A marca é SVG desenhado aqui mesmo, pelo mesmo motivo: um `<img>`
 * para um arquivo que talvez não esteja sendo servido deixaria um
 * quadrado vazio no topo justamente nesta tela.
 */

const FUNDO = "#00131f";
const CIANO = "#00ade7";
const FONTE =
  '"Bricolage Grotesque", "Manrope", system-ui, -apple-system, sans-serif';

const ATALHOS = [
  { rotulo: "Conectividade e Redes", href: "/solucoes/conectividade-redes" },
  { rotulo: "Cloud e Datacenter", href: "/solucoes/cloud-datacenter" },
  { rotulo: "Modern Workplace", href: "/solucoes/modern-workplace" },
  { rotulo: "Cibersegurança", href: "/solucoes/ciberseguranca" },
];

const seta = (
  <svg viewBox="0 0 16 16" aria-hidden width="14" height="14" style={{ flex: "none", color: CIANO }}>
    <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
  </svg>
);

export default function NaoEncontrado() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: FUNDO,
        color: "#ffffff",
        fontFamily: FONTE,
      }}
    >
      <header
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          padding: "1.5rem 1.25rem",
        }}
      >
        <Link
          href="/"
          aria-label="CORZ, página inicial"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.6rem",
            color: "#ffffff",
            textDecoration: "none",
          }}
        >
          <svg viewBox="0 0 28 24" aria-hidden width="26" height="22">
            <path d="M14 2 26 22H2L14 2Z" fill="#ffffff" />
            <path d="M14 9.5 19.5 19h-11L14 9.5Z" fill={FUNDO} />
          </svg>
          <span
            style={{
              fontWeight: 700,
              fontSize: "1.0625rem",
              letterSpacing: "0.22em",
            }}
          >
            CORZ
          </span>
        </Link>
      </header>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "5rem 1.25rem",
          boxSizing: "border-box",
        }}
      >
        <div style={{ margin: "0 auto", width: "100%", maxWidth: "52rem" }}>
          <p style={{ margin: 0, fontSize: "0.9375rem", fontWeight: 600, color: CIANO }}>
            Erro 404
          </p>
          <h1
            style={{
              margin: "1.25rem 0 0",
              fontSize: "clamp(2rem, 5.4vw, 3.5rem)",
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-0.042em",
            }}
          >
            Esta página não existe mais.
          </h1>
          <p
            style={{
              margin: "1.5rem 0 0",
              maxWidth: "52ch",
              fontSize: "1.0625rem",
              lineHeight: 1.62,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            O endereço mudou ou o link que você seguiu está desatualizado. O que
            a CORZ faz continua tudo aqui embaixo.
          </p>

          <ul
            style={{
              listStyle: "none",
              margin: "2.5rem 0 0",
              padding: 0,
              display: "grid",
              gap: "0.75rem",
              gridTemplateColumns: "repeat(auto-fit, minmax(15rem, 1fr))",
            }}
          >
            {ATALHOS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  data-cursor="acao"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.12)",
                    padding: "1rem 1.25rem",
                    fontSize: "0.9375rem",
                    fontWeight: 600,
                    color: "#ffffff",
                    textDecoration: "none",
                  }}
                >
                  {item.rotulo}
                  {seta}
                </Link>
              </li>
            ))}
          </ul>

          <div
            style={{
              marginTop: "2.5rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <Link
              href="/"
              data-cursor="acao"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                borderRadius: 10,
                background: "#ffffff",
                color: FUNDO,
                textDecoration: "none",
                padding: "0.875rem 1.5rem",
                fontSize: "0.9375rem",
                fontWeight: 600,
              }}
            >
              Voltar ao início
            </Link>
            <Link
              href="/contato"
              data-cursor="acao"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
                borderRadius: 10,
                border: "1px solid rgba(255,255,255,0.22)",
                color: "#ffffff",
                textDecoration: "none",
                padding: "0.875rem 1.5rem",
                fontSize: "0.9375rem",
                fontWeight: 600,
              }}
            >
              Fale com a CORZ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
