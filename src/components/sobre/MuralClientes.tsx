"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  clientesMural,
  MURAL_ALTURA,
  MURAL_LARGURA,
} from "@/conteudo/site";

/**
 * Mural de clientes em fita contínua.
 *
 * Quinze marcas não cabem numa grade sem virar parede de logotipo, que
 * é o gesto mais datado que uma página institucional pode fazer. Aqui
 * elas passam: uma fita que corre devagar, sem começo nem fim visível,
 * e o olho lê três ou quatro por vez em vez de tentar abarcar quinze.
 *
 * O laço é a duplicata exata da lista deslocando -50%: quando a
 * animação reinicia, a segunda cópia está exatamente onde a primeira
 * estava, e a emenda não existe. Nenhum JavaScript participa do
 * movimento — é uma `@keyframes` só, o que significa que a fita corre
 * na thread de composição e não trava junto com a página.
 *
 * A parte que pensa: passar o mouse na fita pausa o movimento e apaga
 * as outras marcas, deixando só a que está sob o cursor em cor cheia.
 * Quem reconheceu um cliente consegue parar e olhar, em vez de correr
 * atrás dele com o olho. Sair devolve o movimento de onde parou.
 *
 * Fora isso: o teclado pausa igual pelo foco, o leitor de tela recebe
 * uma lista só (a duplicata é `aria-hidden`), e quem pediu menos
 * movimento no sistema recebe uma fita parada que rola no dedo.
 */

/** Segundos que cada marca leva para atravessar. Define a velocidade. */
const RITMO = 3.4;

export default function MuralClientes() {
  const [pausado, setPausado] = useState(false);
  const [visivel, setVisivel] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);

  /* Fora da tela a fita não anima. Não é micro-otimização: é uma
     animação infinita, ela roda o resto da sessão se ninguém desligar. */
  useEffect(() => {
    const el = raiz.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => setVisivel(!!entrada?.isIntersecting),
      { threshold: 0 }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  const fita = (copia: boolean) => (
    <ul
      className="mural-fita"
      aria-hidden={copia || undefined}
      {...(copia ? {} : { "aria-label": "Clientes da CORZ" })}
    >
      {clientesMural.map((c) => (
        <li key={(copia ? "b-" : "a-") + c.nome} className="mural-item">
          <Image
            src={c.arquivo}
            alt={copia ? "" : c.nome}
            width={MURAL_LARGURA}
            height={MURAL_ALTURA}
            sizes="200px"
            className="h-full w-full object-contain"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      ref={raiz}
      className="mural"
      data-pausado={pausado ? "sim" : "nao"}
      data-correndo={visivel ? "sim" : "nao"}
      style={{ ["--volta" as string]: `${clientesMural.length * RITMO}s` }}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocusCapture={() => setPausado(true)}
      onBlurCapture={() => setPausado(false)}
    >
      <div className="mural-trilho">
        {fita(false)}
        {fita(true)}
      </div>
    </div>
  );
}
