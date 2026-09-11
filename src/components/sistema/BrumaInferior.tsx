/**
 * Bruma inferior.
 *
 * Marcação vazia por decisão: todo o efeito mora no CSS (`.bruma-base`
 * em globals.css), em dois pseudo-elementos. Sem JavaScript, sem estado
 * e sem custo de hidratação — se o bundle nunca chegar, a faixa continua
 * lá, porque ela é só uma regra de estilo.
 *
 * `aria-hidden` porque não há nada para ler: a faixa não pinta cor nem
 * cobre conteúdo, apenas desfoca o que passa por baixo dela.
 */
export default function BrumaInferior() {
  return <div aria-hidden className="bruma-base" />;
}
