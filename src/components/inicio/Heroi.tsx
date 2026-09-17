import Link from "next/link";
import { Destaque, Envelope, Rotulo } from "@/components/sistema/primitivos";
import SimboloVivo from "./SimboloVivo";
import Revelar from "@/components/sistema/Revelar";
import { provasDeAgora } from "@/conteudo/site";
import NumeroQueSobe from "@/components/sistema/NumeroQueSobe";

export default function Heroi() {
  return (
    <section className="sup-escura relative overflow-hidden bg-tinta-950 text-branco">
      {/* Fundo: colunas de apoio e dois florescimentos discretos. A luz
          forte do herói não mora aqui: ela sai do próprio símbolo, e é
          por isso que estes dois ficam de propósito no registro baixo. */}
      <div aria-hidden className="absolute inset-0">
        <div className="malha-escura absolute inset-0 opacity-60" />
        <div
          className="absolute right-[-14%] top-[-24%] h-[52rem] w-[52rem] rounded-full opacity-[0.42]"
          style={{
            background:
              "radial-gradient(circle, #3F39BD 0%, #2C3191 38%, transparent 68%)",
          }}
        />
        <div
          className="absolute bottom-[-38%] left-[-18%] h-[46rem] w-[46rem] rounded-full opacity-[0.22]"
          style={{
            background: "radial-gradient(circle, #00ADE7 0%, transparent 65%)",
          }}
        />
        {/* Vinheta inferior para o conteúdo seguinte não competir. */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-tinta-950 to-transparent" />
      </div>

      <Envelope className="relative pb-20 pt-[calc(var(--altura-cabecalho)+4.5rem)] sm:pb-28 sm:pt-[calc(var(--altura-cabecalho)+7rem)]">
        {/* Uma grade de duas linhas, e não uma coluna de texto ao lado
            de uma coluna de imagem.

            É o que permite o símbolo entrar no meio do texto no celular
            — entre o parágrafo e os botões — e continuar sendo a coluna
            da direita no desktop. Argumento e símbolo pertencem a
            células diferentes, então nenhuma ordem de DOM resolveria
            isso sozinha: quem decide é a posição na grade.

            `gap-y-0` no desktop de propósito. O espaçamento vertical
            entre o parágrafo e os botões continua vindo do `mt-9` de
            sempre, e não de um vão de grade, para as duas linhas
            empilharem exatamente como empilhavam quando eram um bloco
            só. */}
        <div className="grid gap-0 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
          {/* Rótulo, título e parágrafo.
              `relative z-10` para o texto ficar por cima: os halos do
              símbolo são absolutos e, sem isso, pintariam sobre as
              letras em vez de passar por trás delas. */}
          <div className="relative z-10 lg:col-span-7 lg:col-start-1 lg:row-start-1 lg:self-end">
            <Revelar>
              <Rotulo cor="ciano">Continuidade operacional</Rotulo>
            </Revelar>

            <Revelar atraso={80}>
              <h1 className="mt-7 font-display text-[clamp(2.5rem,6.4vw,4.75rem)] font-bold leading-[0.96] tracking-[-0.042em]">
                Grandes empresas não podem{" "}
                <Destaque>depender da sorte.</Destaque>
              </h1>
            </Revelar>

            <Revelar atraso={160}>
              <p className="mt-7 max-w-[46ch] text-[1.0625rem] leading-[1.62] text-branco/62 sm:text-[1.125rem]">
                A CORZ mantém no ar a operação de empresas com múltiplas
                unidades. Conectividade e redes, cloud e datacenter, modern
                workplace e cibersegurança, monitorados 24 horas por dia, para
                que a falha seja resolvida antes de virar prejuízo.
              </p>
            </Revelar>

          </div>

          {/* O símbolo.
              No celular ele entra aqui, entre o parágrafo e os botões, e
              menor: metade da largura da tela em vez da largura toda. É
              a posição em que ele respira sem empurrar a chamada para
              fora da primeira dobra — antes ficava depois de tudo, e
              quem rolava até ele já tinha passado pelos botões.
              No desktop volta a ser a coluna da direita, em tamanho
              cheio, ocupando as duas linhas. */}
          <Revelar
            atraso={200}
            modo="surgir"
            /* Margens do celular: 15px a menos de cada lado. Em cima
               sai do próprio `margin-top` (48px → 33px); embaixo, a
               folga vem do `mt-9` dos botões, que pertence ao bloco
               seguinte — por isso a margem negativa, que puxa a chamada
               15px para cima sem mexer no desktop. */
            className="relative z-0 mx-auto mt-[33px] mb-[-15px] w-[56%] max-w-[15rem] sm:w-[40%] lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:mx-0 lg:mt-0 lg:mb-0 lg:w-full lg:max-w-none lg:self-center"
          >
            <SimboloVivo />
          </Revelar>

          {/* Botões e a linha de setores */}
          <div className="relative z-10 lg:col-span-7 lg:col-start-1 lg:row-start-2 lg:self-start">
            <Revelar atraso={240}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/contato"
                  data-cursor="acao"
                  className="group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-[10px] bg-[#1D4FD8] px-7 py-4 text-[0.9375rem] font-semibold text-branco transition-colors duration-300 hover:bg-[#153bab]"
                >
                  Receber diagnóstico de continuidade
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
                  </svg>
                </Link>
                <Link
                  href="/solucoes"
                  data-cursor="acao"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-[10px] border border-branco/22 px-7 py-4 text-[0.9375rem] font-semibold text-branco transition-colors duration-300 hover:border-branco hover:bg-branco hover:text-tinta-900"
                >
                  Ver como operamos
                </Link>
              </div>
            </Revelar>

            <Revelar atraso={320}>
              <p className="mt-8 text-[0.8125rem] leading-relaxed text-branco/40">
                Atendemos empresas de atacado, supermercados, indústria, serviços e
                ensino desde 2012.
              </p>
            </Revelar>
          </div>
        </div>
      </Envelope>

      {/* Faixa de provas */}
      <div className="relative border-t border-branco/10">
        <Envelope>
          <dl className="grid grid-cols-2 divide-branco/10 lg:grid-cols-4 lg:divide-x">
            {provasDeAgora().map((prova, i) => (
              <Revelar
                key={prova.rotulo}
                atraso={i * 70}
                className="border-b border-branco/10 px-1 py-7 lg:border-b-0 lg:px-8 lg:first:pl-0"
              >
                <dt className="sr-only">{prova.rotulo}</dt>
                <dd>
                  <span className="font-wide text-[2.5rem] font-bold leading-none tracking-[-0.03em] text-branco tabular-nums">
                    {"prefixo" in prova ? prova.prefixo : ""}
                    <NumeroQueSobe valor={prova.valor} />
                    <span className="text-ciano">{prova.sufixo}</span>
                  </span>
                  <span className="mt-2.5 block text-[0.8125rem] leading-snug text-branco/55">
                    {prova.rotulo}
                  </span>
                  <span className="mt-1 block text-[0.75rem] leading-snug text-branco/35">
                    {prova.detalhe}
                  </span>
                </dd>
              </Revelar>
            ))}
          </dl>
        </Envelope>
      </div>
    </section>
  );
}
