import { Simbolo } from "@/components/marca/Logo";

/**
 * O símbolo da CORZ, vivo.
 *
 * Substitui o painel de monitoramento que ocupava este lugar. O painel
 * explicava; a marca afirma. Numa primeira dobra, afirmar funciona
 * melhor, e sobra atenção para o texto ao lado, que é quem tem de
 * convencer.
 *
 * Tudo aqui é CSS. Nenhuma biblioteca de animação, nenhum estado, nada
 * que dependa de hidratação para aparecer: o símbolo já está desenhado
 * no HTML e a animação é um acabamento que entra por cima. Se o
 * JavaScript falhar, a marca continua no lugar, parada e correta.
 *
 * A composição tem quatro camadas, da mais lenta para a mais rápida:
 *
 * 1. Halo — dois florescimentos radiais que respiram fora de fase, em
 *    ciano e violeta. É a "iluminação inteligente": luz de trás, não
 *    brilho aplicado no objeto. Transbordam muito além da caixa do
 *    símbolo de propósito, e quem recorta é a seção do herói: é o que
 *    faz a luz participar da seção inteira em vez de terminar numa
 *    circunferência visível em volta da marca.
 * 2. Anéis — dois círculos finos girando em sentidos opostos, um deles
 *    tracejado. Dão a leitura de sistema em operação sem desenhar
 *    nenhum ícone de tecnologia.
 * 3. Símbolo — a marca em branco, com flutuação vertical mínima. As
 *    três faces do sinal acendem em sequência, uma atrás da outra, com
 *    um leve descolamento entre elas.
 * 4. Varredura — uma lâmina de luz que atravessa o conjunto de tempos
 *    em tempos, como se o sistema estivesse sendo lido. Ela é recortada
 *    pela própria silhueta da marca: fora dela não existe, e é isso que
 *    impede a faixa de aparecer como um retângulo claro.
 *
 * Sob prefers-reduced-motion a regra global do site já congela tudo, e
 * o quadro que fica de pé é o estado final: marca branca, halo aceso.
 */
export default function SimboloVivo() {
  return (
    <div className="simbolo-vivo relative mx-auto flex aspect-square w-full max-w-[32rem] items-center justify-center lg:max-w-none">
      {/* 1. Halo */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="halo halo-ciano" />
        <span className="halo halo-violeta" />
      </div>

      {/* 2. Anéis */}
      <svg
        aria-hidden
        viewBox="0 0 400 400"
        className="pointer-events-none absolute inset-0 h-full w-full"
        fill="none"
      >
        <circle
          className="anel anel-externo"
          cx="200"
          cy="200"
          r="192"
          stroke="url(#fio-anel)"
          strokeWidth="1"
          strokeDasharray="2 10"
        />
        <circle
          className="anel anel-interno"
          cx="200"
          cy="200"
          r="166"
          stroke="url(#fio-anel)"
          strokeWidth="1"
          strokeDasharray="90 420"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="fio-anel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00ADE7" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#3F39BD" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#00ADE7" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3. Símbolo, e 4. a varredura recortada por ele */}
      <div className="marca relative w-[78%]">
        <Simbolo variante="branco" className="w-full" />
        {/* A janela é recortada pela silhueta da marca; a faixa que se
            move mora dentro dela. Assim a luz corre por dentro do sinal
            e nunca aparece como um retângulo sobre o fundo. */}
        <span aria-hidden className="varredura">
          <span className="varredura-faixa" />
        </span>
      </div>
    </div>
  );
}
