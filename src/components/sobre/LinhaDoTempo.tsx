import Revelar from "@/components/sistema/Revelar";

/**
 * Linha do tempo da CORZ.
 *
 * A versão anterior era uma tabela de três colunas com uma borda entre
 * as linhas: cronologia sem nenhuma sensação de percurso. Aqui existe um
 * fio de verdade, contínuo, que atravessa todos os marcos e muda de cor
 * ao longo do caminho, do petróleo do começo ao verde do momento atual.
 *
 * A progressão também aparece na tipografia: o ano vai ganhando presença
 * conforme se aproxima de hoje, e o marco atual é o único com o nó
 * preenchido. Nada disso depende de JavaScript.
 *
 * No celular o fio corre pela esquerda. A partir de `lg` ele vai para o
 * centro e os marcos se alternam dos dois lados, que é o que impede a
 * coluna única de ficar comprida demais.
 */

type Marco = {
  ano: string;
  titulo: string;
  texto: string;
  cor: string;
  /** Peso visual do ano: cresce ao longo do percurso. */
  presenca: string;
};

const MARCOS: Marco[] = [
  {
    ano: "2012",
    titulo: "A CORZ nasce em Pelotas",
    texto:
      "Começamos atendendo empresas da região com um princípio que não mudou: quem responde pela infraestrutura responde pelo funcionamento do negócio.",
    cor: "#00304D",
    presenca: "0.38",
  },
  {
    ano: "2014",
    titulo: "As primeiras grandes redes",
    texto:
      "Consolidação com operações de atacado e varejo do Sul do Brasil. Empresas com dezenas de unidades, onde uma hora parada tem preço conhecido.",
    cor: "#2C3191",
    presenca: "0.5",
  },
  {
    ano: "2018",
    titulo: "Nasce o time de desenvolvimento",
    texto:
      "Criamos a equipe interna de software. O que o mercado não resolvia com produto de prateleira passou a ser construído sob medida.",
    cor: "#3F39BD",
    presenca: "0.64",
  },
  {
    ano: "2021",
    titulo: "Pioneirismo em voz com IA",
    texto:
      "Colocamos no ar uma das primeiras centrais PABX com inteligência artificial do Brasil, capaz de analisar o atendimento sem alguém ouvir ligação por ligação.",
    cor: "#00ADE7",
    presenca: "0.78",
  },
  {
    ano: "2024",
    titulo: "Monitoramento próprio, 24 horas",
    texto:
      "A operação de todas as unidades de um cliente passa a ser acompanhada em tempo real pelo nosso centro de operações, com alerta no segundo da queda e histórico por ponto.",
    cor: "#00ADE7",
    presenca: "0.9",
  },
  {
    ano: "2026",
    titulo: "Especialistas em continuidade",
    texto:
      "O posicionamento se afirma. A CORZ não é uma empresa de TI: é a empresa que responde pela continuidade operacional de quem não pode parar.",
    cor: "#89E20D",
    presenca: "1",
  },
];

export default function LinhaDoTempo() {
  return (
    <div className="relative mt-14">
      {/* O fio. Corre à esquerda no celular, ao centro a partir de lg. */}
      <div
        aria-hidden
        className="absolute bottom-6 top-6 left-[0.4375rem] w-px lg:left-1/2 lg:-translate-x-1/2"
        style={{
          background:
            "linear-gradient(180deg, #00304D 0%, #2C3191 22%, #3F39BD 44%, #00ADE7 70%, #89E20D 100%)",
          opacity: 0.7,
        }}
      />

      <ol className="space-y-10 sm:space-y-12">
        {MARCOS.map((marco, i) => {
          const atual = i === MARCOS.length - 1;
          const direita = i % 2 === 1;

          return (
            <Revelar key={marco.ano} atraso={i * 70} como="li">
              <div className="relative pl-10 lg:grid lg:grid-cols-2 lg:gap-16 lg:pl-0">
                {/* Nó sobre o fio */}
                <span
                  aria-hidden
                  className="absolute left-0 top-1.5 flex h-[0.9375rem] w-[0.9375rem] items-center justify-center rounded-full border-2 bg-tinta-950 lg:left-1/2 lg:-translate-x-1/2"
                  style={{ borderColor: marco.cor }}
                >
                  {atual && (
                    <span
                      className="h-[0.375rem] w-[0.375rem] rounded-full"
                      style={{ background: marco.cor }}
                    />
                  )}
                </span>

                {/* Marca d'água do ano do lado oposto, no desktop */}
                <div
                  aria-hidden
                  className={`hidden lg:flex lg:items-start ${
                    direita
                      ? "lg:order-1 lg:justify-end lg:pr-4"
                      : "lg:order-2 lg:justify-start lg:pl-4"
                  }`}
                >
                  <span
                    className="font-wide text-[3.25rem] font-bold leading-none tabular-nums tracking-[-0.04em]"
                    style={{ color: marco.cor, opacity: Number(marco.presenca) * 0.4 }}
                  >
                    {marco.ano}
                  </span>
                </div>

                <div
                  className={
                    direita
                      ? "lg:order-2 lg:pl-4 lg:text-left"
                      : "lg:order-1 lg:pr-4 lg:text-right"
                  }
                >
                  <span
                    className="font-wide text-[1.5rem] font-bold leading-none tabular-nums tracking-[-0.03em] lg:hidden"
                    style={{ color: marco.cor, opacity: Number(marco.presenca) }}
                  >
                    {marco.ano}
                  </span>

                  <h3 className="mt-2.5 font-display text-[1.25rem] font-semibold leading-snug tracking-[-0.026em] lg:mt-0">
                    {marco.titulo}
                  </h3>
                  <p
                    className={`mt-3 text-[0.9375rem] leading-[1.68] text-branco/58 ${
                      direita ? "lg:max-w-[46ch]" : "lg:ml-auto lg:max-w-[46ch]"
                    }`}
                  >
                    {marco.texto}
                  </p>

                  {atual && (
                    <span
                      className="mt-4 inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.75rem] font-semibold"
                      style={{ background: `${marco.cor}1F`, color: marco.cor }}
                    >
                      <span
                        aria-hidden
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: marco.cor }}
                      />
                      Onde estamos agora
                    </span>
                  )}
                </div>
              </div>
            </Revelar>
          );
        })}
      </ol>
    </div>
  );
}
