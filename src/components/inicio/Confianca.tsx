import Image from "next/image";
import Link from "next/link";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import Revelar from "@/components/sistema/Revelar";
import { clientes } from "@/conteudo/site";

/**
 * Prova social.
 *
 * Terceira seção da home: logo depois de dizer o que a empresa faz, vem
 * quem já confia nisso. É a ordem que a pessoa usa para decidir, e
 * adiar a prova para o fim da página desperdiça a única chance de
 * responder "quem mais usa?" no momento em que a pergunta aparece.
 *
 * A faixa é clara de propósito. Cada marca tem paleta própria e oito
 * delas sobre fundo escuro exigiriam versões monocromáticas, o que
 * descaracteriza logo de cliente. Sobre superfície clara, todas entram
 * como são, em repouso levemente rebaixadas e cheias no hover.
 */
export default function Confianca() {
  return (
    <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
      <Envelope>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <Revelar>
              <Rotulo cor="petroleo">Quem confia a operação à CORZ</Rotulo>
              <h2 className="mt-5 font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.038em] text-tinta-900">
                Operações que não podem depender da sorte.
              </h2>
            </Revelar>
            <Revelar atraso={100}>
              <p className="mt-6 max-w-[40ch] text-[1rem] leading-[1.66] text-tinta-900/62">
                Indústria, saúde, ensino, compliance e redes de supermercados.
                Portes e setores diferentes, com a mesma exigência: a operação
                não pode parar, e é ela que define o nosso padrão.
              </p>
            </Revelar>
            <Revelar atraso={160}>
              <Link
                href="/solucoes"
                data-cursor="acao"
                className="group mt-7 inline-flex items-center gap-2.5 text-[0.9375rem] font-semibold text-[#1D4FD8]"
              >
                Ver o que entregamos a elas
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                </svg>
              </Link>
            </Revelar>
          </div>

          <div className="lg:col-span-8">
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {clientes.map((cliente, i) => (
                <Revelar
                  key={cliente.nome}
                  atraso={(i % 4) * 55}
                  como="li"
                  className="group flex min-h-[8.25rem] items-center justify-center rounded-[var(--radius-bloco)] border border-petroleo/10 bg-papel-050 px-3 py-4 transition-colors duration-400 hover:border-petroleo/22 hover:bg-papel-000 sm:px-4"
                >
                  {/* Caixa de 2,4:1, a mesma proporção em que os oito
                      arquivos foram nivelados pela área de tinta. Com a
                      caixa e o arquivo na mesma proporção, a marca
                      preenche o espaço todo em vez de flutuar no meio —
                      e, como o nivelamento é por tinta e não por altura,
                      o selo redondo e o logotipo em linha passam a pesar
                      igual em vez de um parecer o dobro do outro. */}
                  <Image
                    src={cliente.arquivo}
                    alt={cliente.nome}
                    width={cliente.largura}
                    height={cliente.altura}
                    sizes="(min-width: 1024px) 220px, 45vw"
                    className="h-auto w-full max-w-[11.5rem] object-contain opacity-[0.9] transition-opacity duration-400 group-hover:opacity-100"
                  />
                </Revelar>
              ))}
            </ul>
          </div>
        </div>
      </Envelope>
    </section>
  );
}
