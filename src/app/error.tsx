"use client";

import Link from "next/link";
import { useEffect } from "react";

/**
 * Barreira de erro das páginas.
 *
 * Sem um arquivo assim, qualquer exceção em componente de cliente deixa
 * o Next entregar uma tela vazia com uma frase técnica em inglês. Numa
 * página institucional isso é pior que o próprio erro: quem chegou pelo
 * Google conclui que a empresa está fora do ar.
 *
 * Tudo aqui é estilo embutido, e nenhuma classe do Tailwind.
 *
 * O motivo é a própria natureza desta tela: uma das causas mais comuns
 * de ela aparecer é a folha de estilo não ter chegado — publicação sem
 * os arquivos estáticos, cache velho apontando para um chunk que já não
 * existe, rede caindo no meio. Se a página de erro dependesse do mesmo
 * CSS que faltou, ela apareceria descaracterizada exatamente quando
 * mais precisa parecer intencional. Estilo embutido chega junto com o
 * HTML, sem segunda requisição, e é a única forma de garantir que esta
 * tela funcione quando nada mais funcionou.
 */

const FUNDO = "#00131f";
const CIANO = "#00ade7";
const FONTE =
  '"Bricolage Grotesque", "Manrope", system-ui, -apple-system, sans-serif';

export default function Erro({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[corz] falha ao renderizar a página", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        background: FUNDO,
        color: "#ffffff",
        fontFamily: FONTE,
        padding: "6rem 1.25rem",
        boxSizing: "border-box",
      }}
    >
      <div style={{ margin: "0 auto", width: "100%", maxWidth: "42rem" }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: CIANO,
          }}
        >
          Algo falhou por aqui
        </p>
        <h1
          style={{
            margin: "1.25rem 0 0",
            fontSize: "clamp(1.875rem, 4.6vw, 3rem)",
            fontWeight: 700,
            lineHeight: 1.04,
            letterSpacing: "-0.04em",
          }}
        >
          Esta página não carregou como deveria.
        </h1>
        <p
          style={{
            margin: "1.25rem 0 0",
            maxWidth: "52ch",
            fontSize: "1.0625rem",
            lineHeight: 1.62,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          O problema é nosso, não seu. Tentar de novo costuma resolver. Se
          insistir, fale com a gente pelos canais de sempre que a equipe é
          avisada.
        </p>

        <div
          style={{
            marginTop: "2.25rem",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
          }}
        >
          <button
            type="button"
            onClick={reset}
            data-cursor="acao"
            style={{
              appearance: "none",
              border: 0,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              whiteSpace: "nowrap",
              borderRadius: 10,
              background: "#ffffff",
              color: FUNDO,
              padding: "0.875rem 1.5rem",
              fontFamily: "inherit",
              fontSize: "0.9375rem",
              fontWeight: 600,
            }}
          >
            Tentar de novo
          </button>
          <Link
            href="/"
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
            Voltar ao início
          </Link>
        </div>

        {error.digest && (
          <p
            style={{
              margin: "2rem 0 0",
              fontSize: "0.8125rem",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Código da ocorrência: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
