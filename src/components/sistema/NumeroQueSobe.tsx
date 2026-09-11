"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Número que sobe até o valor final quando entra na tela.
 *
 * A faixa de provas logo depois do herói era o único bloco parado da
 * primeira dobra, e quatro números estáticos passam despercebidos. Ver
 * o número correr até parar faz o olho acompanhar até o fim e ler o
 * rótulo que vem embaixo — que é onde está o argumento.
 *
 * Três cuidados que separam isto de um contador de template:
 *
 * O valor final já vem no HTML. A animação começa substituindo o texto
 * que o servidor mandou, e não um zero: quem tem JavaScript bloqueado,
 * quem lê por buscador e quem usa leitor de tela recebem "14 anos", não
 * "0 anos" nem um vazio. Por isso o elemento também é `aria-hidden`
 * durante a contagem e volta a ser lido quando ela termina.
 *
 * A curva desacelera no fim (quinta potência). Contagem linear parece
 * cronômetro; esta parece um valor assentando, e os últimos dígitos
 * ficam legíveis em vez de borrarem.
 *
 * Roda uma vez só, na primeira vez que a faixa aparece. Um número que
 * reinicia a cada rolagem vira enfeite, e enfeite que se repete cansa.
 */

const DURACAO = 1150;

/** Desaceleração forte no fim: `1 - (1-t)^5`. */
const curva = (t: number) => 1 - Math.pow(1 - t, 5);

export default function NumeroQueSobe({ valor }: { valor: string }) {
  /* O valor chega formatado em pt-BR ("99,7", "14"). A conta é feita
     em número e a exibição volta para a vírgula, preservando as casas
     decimais do original — "99,0" no meio do caminho, nunca "99". */
  const casas = valor.includes(",") ? valor.split(",")[1]!.length : 0;
  const alvo = Number(valor.replace(",", "."));

  const [texto, setTexto] = useState(valor);
  const raiz = useRef<HTMLSpanElement>(null);
  const contando = useRef(false);

  useEffect(() => {
    const el = raiz.current;
    if (!el || !Number.isFinite(alvo)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let quadro = 0;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada?.isIntersecting || contando.current) return;
        contando.current = true;
        observador.disconnect();

        const inicio = performance.now();
        const passo = (agora: number) => {
          /* O carimbo que o rAF entrega é o início do quadro, e ele
             pode ser anterior ao `performance.now()` lido logo acima —
             o quadro já estava agendado. Sem travar o piso em zero, o
             primeiro quadro entra com `t` negativo e a contagem começa
             em "-6 anos". */
          const t = Math.max(0, Math.min(1, (agora - inicio) / DURACAO));
          const atual = alvo * curva(t);
          setTexto(atual.toFixed(casas).replace(".", ","));
          if (t < 1) quadro = requestAnimationFrame(passo);
          else setTexto(valor);
        };
        quadro = requestAnimationFrame(passo);
      },
      { threshold: 0.4 }
    );
    observador.observe(el);

    return () => {
      cancelAnimationFrame(quadro);
      observador.disconnect();
    };
  }, [alvo, casas, valor]);

  return (
    <span ref={raiz} aria-hidden={texto !== valor || undefined}>
      {texto}
    </span>
  );
}
