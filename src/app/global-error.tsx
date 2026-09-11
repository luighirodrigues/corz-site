"use client";

/**
 * Última barreira.
 *
 * Só entra em cena quando a falha acontece no próprio layout raiz, e por
 * isso precisa trazer <html> e <body> por conta própria: nesse ponto o
 * layout do site não existe mais para envolver nada.
 *
 * Estilo em atributo, sem depender da folha de estilos, sem fonte
 * própria e sem nenhum import além do React. Se o CSS foi justamente o
 * que não carregou, esta tela ainda precisa ficar de pé.
 */
export default function ErroGlobal({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "3rem 1.25rem",
          background: "#00131f",
          color: "#ffffff",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: "36rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: "#00ade7",
            }}
          >
            CORZ Tecnologia
          </p>
          <h1
            style={{
              margin: "1.25rem 0 0",
              fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            O site não conseguiu carregar.
          </h1>
          <p
            style={{
              margin: "1.25rem 0 0",
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.62)",
            }}
          >
            Recarregar a página resolve na maior parte das vezes. Se o problema
            continuar, ligue para (53) 3027-2698 que a equipe atende.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.875rem 1.5rem",
              borderRadius: "10px",
              border: 0,
              background: "#ffffff",
              color: "#00131f",
              fontSize: "0.9375rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recarregar
          </button>
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
      </body>
    </html>
  );
}
