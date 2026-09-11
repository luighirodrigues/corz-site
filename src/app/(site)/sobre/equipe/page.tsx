import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import CabecalhoPagina from "@/components/blocos/CabecalhoPagina";
import ChamadaFinal from "@/components/blocos/ChamadaFinal";
import Revelar from "@/components/sistema/Revelar";
import { Envelope, Rotulo } from "@/components/sistema/primitivos";
import {
  socios,
  gerencia,
  fotoDoTime,
  iniciais,
  type Pessoa,
} from "@/conteudo/lideranca";
import { metadados, DadosEstruturados, grafo, pagina, trilha } from "@/lib/seo";
import { rotaOculta } from "@/lib/visibilidade";

export const metadata: Metadata = metadados({
  titulo: "Nosso time",
  descricao:
    "As pessoas à frente da CORZ Tecnologia: os três sócios-administradores, a gerência comercial e a gerência operacional que respondem quando a operação de um cliente para.",
  caminho: "/sobre/equipe",
});

/**
 * Cartão de pessoa.
 *
 * Sem retrato, entra o monograma em cor da marca. É uma ausência
 * desenhada: não finge ser foto nem deixa um bloco cinza no lugar.
 */
function Cartao({ pessoa, atraso }: { pessoa: Pessoa; atraso: number }) {
  return (
    <Revelar
      atraso={atraso}
      como="li"
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-bloco)] border border-petroleo/12 bg-papel-000 transition-all duration-400 ease-[var(--ease-corz)] hover:-translate-y-1 hover:border-petroleo/25"
    >
      <div
        className="relative flex aspect-[4/3] items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(150deg, ${pessoa.cor}30 0%, ${pessoa.cor}12 55%, ${pessoa.cor}05 100%)`,
        }}
      >
        {pessoa.foto ? (
          <Image
            src={pessoa.foto}
            alt={pessoa.nome}
            fill
            sizes="(min-width: 1024px) 360px, 100vw"
            className="object-cover"
          />
        ) : (
          <>
            <span
              aria-hidden
              className="font-display text-[clamp(3rem,7vw,4.5rem)] font-bold leading-none tracking-[-0.05em] transition-transform duration-500 ease-[var(--ease-corz)] group-hover:scale-105"
              style={{ color: pessoa.cor, opacity: 0.9 }}
            >
              {iniciais(pessoa.nome)}
            </span>
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-[0.25] transition-transform duration-500 ease-[var(--ease-corz)] group-hover:scale-x-100"
              style={{ background: pessoa.cor }}
            />
          </>
        )}
      </div>

      <div className="flex flex-1 flex-col p-7">
        <span className="rotulo" style={{ color: pessoa.cor }}>
          {pessoa.cargo}
        </span>
        <h3 className="mt-3 font-display text-[1.25rem] font-bold leading-tight tracking-[-0.028em] text-tinta-900">
          {pessoa.nome}
        </h3>
        <p className="mt-3 flex-1 text-[0.9375rem] leading-[1.66] text-tinta-900/62">
          {pessoa.atuacao}
        </p>
      </div>
    </Revelar>
  );
}

export default function PaginaEquipe() {
  if (rotaOculta("/sobre/equipe")) notFound();

  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Nosso time: CORZ",
            descricao:
              "As pessoas em posição de liderança na CORZ Tecnologia.",
            caminho: "/sobre/equipe",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Sobre", caminho: "/sobre" },
            { nome: "Nosso time", caminho: "/sobre/equipe" },
          ])
        )}
      />

      <CabecalhoPagina
        rotulo="Nosso time"
        titulo="Quando a operação para, tem"
        destaque="gente do outro lado."
        texto="Não é uma central de atendimento genérica lendo roteiro. É um time pequeno o suficiente para conhecer a sua rede pelo nome e grande o suficiente para responder a qualquer hora."
        migalhas={[
          { nome: "Início", caminho: "/" },
          { nome: "Sobre", caminho: "/sobre" },
          { nome: "Nosso time", caminho: "/sobre/equipe" },
        ]}
      />

      {/* Sócios */}
      <section className="border-t border-petroleo/12 bg-papel-000 py-20 sm:py-24">
        <Envelope>
          <Revelar>
            <Rotulo cor="petroleo">Sociedade</Rotulo>
            <h2 className="mt-5 max-w-[24ch] font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.06] tracking-[-0.036em] text-tinta-900">
              Os sócios continuam na operação.
            </h2>
            <p className="mt-5 max-w-[56ch] text-[1.0625rem] leading-[1.66] text-tinta-900/65">
              Em uma empresa que vende continuidade, decisão técnica não pode
              ficar a três camadas de distância de quem responde por ela. Os
              três sócios participam das reuniões de arquitetura dos clientes.
            </p>
          </Revelar>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {socios.map((pessoa, i) => (
              <Cartao key={pessoa.nome} pessoa={pessoa} atraso={i * 70} />
            ))}
          </ul>
        </Envelope>
      </section>

      {/* Gerência */}
      <section className="border-t border-petroleo/12 bg-papel-050 py-20 sm:py-24">
        <Envelope>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Revelar>
                <Rotulo cor="petroleo">Gerência</Rotulo>
                <h2 className="mt-5 font-display text-[clamp(1.5rem,3vw,2.125rem)] font-bold leading-[1.08] tracking-[-0.034em] text-tinta-900">
                  Quem você encontra no dia a dia.
                </h2>
                <p className="mt-5 max-w-[38ch] text-[1rem] leading-[1.68] text-tinta-900/62">
                  Duas frentes, duas pessoas com nome. Uma conduz a conversa
                  antes do contrato, a outra responde depois dele.
                </p>
              </Revelar>
            </div>

            <div className="lg:col-span-8">
              <ul className="grid gap-4 sm:grid-cols-2">
                {gerencia.map((pessoa, i) => (
                  <Cartao key={pessoa.nome} pessoa={pessoa} atraso={i * 70} />
                ))}
              </ul>
            </div>
          </div>
        </Envelope>
      </section>

      {/* Foto geral */}
      <section className="sup-escura relative overflow-hidden bg-tinta-950 py-20 text-branco sm:py-24">
                <Envelope className="relative">
          <Revelar>
            <h2 className="max-w-[22ch] font-display text-[clamp(1.75rem,3.6vw,2.75rem)] font-bold leading-[1.04] tracking-[-0.038em]">
              O time inteiro, pronto para resolver.
            </h2>
            <p className="mt-5 max-w-[54ch] text-[1.0625rem] leading-[1.62] text-branco/58">
              Centro de operações, engenharia de redes, cibersegurança, voz,
              laboratório e relacionamento. Todo mundo em Pelotas, na mesma
              sala, olhando para as mesmas telas.
            </p>
          </Revelar>

          <Revelar atraso={120}>
            <figure className="mt-12">
              {fotoDoTime.arquivo ? (
                <Image
                  src={fotoDoTime.arquivo}
                  alt={fotoDoTime.alt}
                  width={2400}
                  height={1350}
                  sizes="(min-width: 1440px) 1344px, 100vw"
                  className="h-auto w-full rounded-[var(--radius-bloco)] border border-branco/10 object-cover"
                  priority={false}
                />
              ) : (
                /* Espaço reservado. Some assim que `fotoDoTime.arquivo`
                   receber o caminho de uma imagem em /public/time. */
                <div className="flex aspect-[21/9] w-full flex-col items-center justify-center gap-4 rounded-[var(--radius-bloco)] border border-dashed border-branco/18 bg-branco/[0.025] px-8 text-center">
                  <svg
                    viewBox="0 0 48 48"
                    aria-hidden
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.2}
                    className="h-12 w-12 text-branco/30"
                  >
                    <rect x="4" y="10" width="40" height="28" rx="3" />
                    <circle cx="24" cy="22" r="6" />
                    <path d="M4 33l11-9 8 6 6-5 15 12" />
                  </svg>
                  <p className="max-w-[44ch] text-[0.9375rem] leading-relaxed text-branco/45">
                    Espaço reservado para a foto da equipe. Envie o arquivo e
                    ele entra aqui em largura total.
                  </p>
                </div>
              )}
              <figcaption className="mt-4 text-[0.875rem] text-branco/40">
                {fotoDoTime.legenda}
              </figcaption>
            </figure>
          </Revelar>
        </Envelope>
      </section>

      <ChamadaFinal
        rotulo="Trabalhe conosco"
        titulo="Quer fazer parte"
        destaque="deste time?"
        texto="Estamos sempre atentos a gente que gosta de resolver problema difícil e explicar o que fez. Veja como é trabalhar na CORZ."
        botao="Ver oportunidades"
        href="/sobre/carreiras"
      />
    </>
  );
}
