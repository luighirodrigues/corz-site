import { INDEXAVEL, DOMINIO_CANONICO } from "@/lib/constantes";

/**
 * Selo de ambiente de homologação.
 *
 * Aparece apenas fora do domínio definitivo. Existe para que ninguém —
 * cliente, equipe ou você mesmo daqui a três semanas — confunda a versão
 * de testes com o site no ar, e mande o endereço errado para alguém.
 *
 * Fica no canto inferior esquerdo, pequeno e discreto de propósito: o
 * ambiente serve para revisar design, e um aviso grande atrapalharia
 * justamente o que se foi ali fazer.
 *
 * Some sozinho quando o domínio real for apontado. Não há nada para
 * lembrar de remover.
 */
export default function SeloHomologacao() {
  if (INDEXAVEL) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-4 left-4 z-[90] select-none"
      aria-hidden
    >
      <span className="flex items-center gap-2 rounded-[10px] border border-alerta/45 bg-tinta-950/92 py-1.5 pl-2.5 pr-3 font-mono text-[0.625rem] tracking-[0.1em] text-alerta backdrop-blur-sm">
        <span className="h-1.5 w-1.5 rounded-full bg-alerta" />
        HOMOLOGAÇÃO · NÃO INDEXADO
      </span>
      <span className="sr-only">
        Este é um ambiente de testes. O site oficial fica em{" "}
        {DOMINIO_CANONICO}.
      </span>
    </div>
  );
}
