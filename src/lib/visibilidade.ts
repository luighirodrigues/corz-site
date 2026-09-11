/**
 * Rotas fora do ar.
 *
 * Quatro áreas do site foram desligadas a pedido do cliente sem que o
 * trabalho feito nelas fosse descartado. As páginas, os componentes e o
 * conteúdo continuam no repositório, prontos para voltar: o que muda
 * aqui é a resposta que o servidor dá a quem pede esses endereços.
 *
 * A ocultação é levada a sério em três frentes, porque esconder pela
 * metade é o que deixa rastro:
 *
 * 1. Nenhum link aparece em menu, rodapé, mapa do site ou resumo para
 *    assistentes. Quem navega não descobre que a área existe.
 * 2. Quem digitar o endereço direto recebe 404, e não uma página órfã.
 * 3. O 404 é de verdade, com o status certo, para o buscador remover o
 *    endereço do índice em vez de guardá-lo como conteúdo escondido.
 *
 * Para trazer uma área de volta, tire a linha daqui e o `oculto: true`
 * correspondente em `conteudo/site.ts`. Nada além disso.
 */

export const ROTAS_OCULTAS = [
  "/blog",
  "/podcast",
  "/sobre/equipe",
  "/sobre/imprensa",
] as const;

/** Verdadeiro para a própria rota e para tudo abaixo dela. */
export function rotaOculta(caminho: string) {
  const limpo = caminho.replace(/\/+$/, "") || "/";
  return ROTAS_OCULTAS.some(
    (rota) => limpo === rota || limpo.startsWith(`${rota}/`)
  );
}

/** Remove de uma lista de navegação tudo o que está fora do ar. */
export function visiveis<T extends { href: string; oculto?: boolean }>(
  itens: readonly T[]
) {
  return itens.filter((item) => !item.oculto && !rotaOculta(item.href));
}
