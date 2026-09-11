import Link from "next/link";
import { Envelope, Rotulo, Destaque } from "@/components/sistema/primitivos";
import Revelar from "@/components/sistema/Revelar";
import BarramentoUnidade from "./BarramentoUnidade";

/**
 * Conectividade como condição de faturamento.
 *
 * A seção antiga listava oito quadradinhos de equipamento e falava de
 * loja e caixa. Dois problemas: a grade de células iguais é a textura
 * que mais entrega layout automático, e o exemplo de varejo estreitava
 * o argumento para um setor só.
 *
 * Agora o desenho é um barramento: uma linha que representa a conexão e
 * tudo que depende dela pendurado ali. Quando a linha quebra, a coluna
 * inteira apaga, e isso acontece na tela em vez de ser descrito. O
 * diagrama vive em `BarramentoUnidade`, que tem estado próprio.
 */
export default function Cadeia() {
  return (
    <section className="sup-escura relative overflow-hidden border-t border-branco/10 bg-tinta-950 py-20 text-branco sm:py-28">
      <Envelope className="relative">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Revelar>
              <Rotulo cor="ciano">Conectividade</Rotulo>
              <h2 className="mt-6 font-display text-[clamp(1.875rem,3.8vw,3rem)] font-bold leading-[1.02] tracking-[-0.038em]">
                Conectividade é a alma do{" "}
                <Destaque>negócio moderno.</Destaque>
              </h2>
            </Revelar>
            <Revelar atraso={100}>
              <p className="mt-6 max-w-[44ch] text-[1.0625rem] leading-[1.62] text-branco/62">
                Estar sem conexão e sem proteção é estar sem faturar. Não existe
                mais operação que funcione offline por algumas horas e recupere
                o prejuízo depois.
              </p>
              <p className="mt-5 max-w-[44ch] text-[1rem] leading-[1.68] text-branco/50">
                Nenhum diretor perde o sono pensando em roteador. Perde pensando
                na manhã em que a operação não anda e ninguém sabe dizer quando
                volta.
              </p>
            </Revelar>
            <Revelar atraso={160}>
              <Link
                href="/solucoes/conectividade-redes"
                data-cursor="acao"
                className="group mt-8 inline-flex items-center gap-2.5 text-[0.9375rem] font-semibold text-ciano transition-colors hover:text-branco"
              >
                Como a CORZ responde pela conexão de cada unidade
                <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                  <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                </svg>
              </Link>
            </Revelar>
          </div>

          <div className="lg:col-span-7">
            <Revelar atraso={140}>
              <BarramentoUnidade />
            </Revelar>
          </div>
        </div>
      </Envelope>
    </section>
  );
}
