"use client";

/**
 * Fio de progresso de leitura, ancorado sob o cabeçalho.
 *
 * Fica numa camada abaixo do cabeçalho de propósito: os menus suspensos
 * descem por cima dele e, com o fio na frente, uma linha colorida
 * atravessava a lista aberta.
 *
 * Lê --progresso-rolagem, já publicado pela rolagem suave, sem precisar
 * de um observador próprio.
 */
export default function BarraProgresso() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-[var(--altura-cabecalho)] z-[90] h-px"
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-ciano via-[#1D4FD8] to-violeta"
        style={{
          transform: "scaleX(var(--progresso-rolagem, 0))",
        }}
      />
    </div>
  );
}
