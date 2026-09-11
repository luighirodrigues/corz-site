import type { Metadata } from "next";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import FormularioContato from "@/components/blocos/FormularioContato";
import Revelar from "@/components/sistema/Revelar";
import { Envelope, Rotulo, Destaque } from "@/components/sistema/primitivos";
import { metadados, DadosEstruturados, grafo, pagina, trilha } from "@/lib/seo";

export const metadata: Metadata = metadados({
  titulo: "Trabalhe conosco",
  descricao:
    "Vagas e carreira na CORZ Tecnologia em Pelotas/RS. Como é trabalhar em uma empresa que responde pela continuidade de operações críticas.",
  caminho: "/sobre/carreiras",
});

const PRINCIPIOS = [
  {
    titulo: "Problema real, não ticket",
    texto:
      "Aqui ninguém fecha chamado empurrando para a próxima fila. Quem pega o problema acompanha até a operação do cliente voltar a rodar.",
  },
  {
    titulo: "Documentar faz parte do trabalho",
    texto:
      "Conhecimento que mora na cabeça de uma pessoa é risco operacional. Escrever o que se aprendeu é entrega, não burocracia.",
  },
  {
    titulo: "Aprendizado com hora marcada",
    texto:
      "Certificação, laboratório e tempo de estudo entram na agenda. Infraestrutura crítica não aceita quem parou de aprender em 2019.",
  },
  {
    titulo: "Erro é analisado, não punido",
    texto:
      "Todo incidente relevante vira análise de causa. O que se busca é o que permitiu o erro, não quem apertou a tecla.",
  },
];

const AREAS = [
  "Analista de redes e infraestrutura",
  "Analista de segurança da informação",
  "Analista de suporte (NOC)",
  "Desenvolvimento e integrações",
  "Consultoria em telecom",
  "Comercial técnico",
];

export default function PaginaCarreiras() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Trabalhe conosco: CORZ",
            descricao: "Carreira e oportunidades na CORZ Tecnologia.",
            caminho: "/sobre/carreiras",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Sobre", caminho: "/sobre" },
            { nome: "Trabalhe conosco", caminho: "/sobre/carreiras" },
          ])
        )}
      />

      <CabecalhoPagina
        rotulo="Carreiras"
        titulo="Trabalhar na CORZ é"
        destaque="crescer com propósito."
        texto="Um time que resolve, ensina e evolui junto. Se você gosta de entender o problema antes de propor a ferramenta, provavelmente vai se dar bem aqui."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Sobre", caminho: "/sobre" },
          { nome: "Trabalhe conosco", caminho: "/sobre/carreiras" },
        ]}
      />

      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Revelar>
                <Rotulo cor="petroleo">Como trabalhamos</Rotulo>
                <p className="mt-6 max-w-[38ch] font-display text-[1.5rem] font-bold leading-[1.14] tracking-[-0.032em] text-tinta-900">
                  Quatro coisas que a gente leva{" "}
                  <Destaque>a sério de verdade.</Destaque>
                </p>
              </Revelar>
            </div>

            <div className="lg:col-span-8">
              <ul className="border-t border-petroleo/14">
                {PRINCIPIOS.map((p, i) => (
                  <Revelar
                    key={p.titulo}
                    atraso={i * 60}
                    como="li"
                    className="grid gap-3 border-b border-petroleo/14 py-6 sm:grid-cols-12 sm:gap-8"
                  >
                    <span className="font-mono text-[0.6875rem] tabular-nums text-petroleo/35 sm:col-span-1">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-display text-[1.0625rem] font-semibold leading-snug tracking-[-0.024em] text-tinta-900 sm:col-span-4">
                      {p.titulo}
                    </h2>
                    <p className="text-[0.9375rem] leading-[1.66] text-tinta-900/65 sm:col-span-7">
                      {p.texto}
                    </p>
                  </Revelar>
                ))}
              </ul>
            </div>
          </div>
        </Envelope>
      </section>

      <section className="sup-escura relative overflow-hidden bg-tinta-950 py-20 text-branco sm:py-24">
                <Envelope className="relative">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Revelar>
                <Rotulo cor="ciano">Áreas que costumam abrir vaga</Rotulo>
                <ul className="mt-8 border-t border-branco/12">
                  {AREAS.map((area, i) => (
                    <li
                      key={area}
                      className="flex items-center gap-4 border-b border-branco/12 py-4"
                    >
                      <span className="font-mono text-[0.6875rem] tabular-nums text-branco/30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[0.9375rem] text-branco/75">
                        {area}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 max-w-[46ch] text-[0.875rem] leading-relaxed text-branco/45">
                  Não vemos vaga aberta como pré-requisito. Currículo bom fica
                  no radar. Quando a posição abre, chamamos quem já está na
                  lista.
                </p>
              </Revelar>
            </div>

            <div className="lg:col-span-7">
              <Revelar atraso={120}>
                <div className="rounded-[12px] border border-branco/12 bg-branco p-7 sm:p-10">
                  <FormularioContato
                    origem="MATERIAL"
                    titulo="Envie sua candidatura"
                    descricao="Conte em qual área você atua e o que você já resolveu. Se tiver portfólio, GitHub ou LinkedIn, coloque o link na mensagem."
                  />
                </div>
              </Revelar>
            </div>
          </div>
        </Envelope>
      </section>
    </>
  );
}
