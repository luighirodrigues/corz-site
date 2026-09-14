import { solucoes, pilares } from "@/conteudo/solucoes";
import { todasAsPerguntas } from "@/conteudo/faq";
import { site, provasDeAgora, clientes } from "@/conteudo/site";
import { abs, INDEXAVEL } from "@/lib/seo";
import { rotaOculta } from "@/lib/visibilidade";

export const revalidate = 3600;

/**
 * /llms.txt
 *
 * Um resumo em markdown, feito para ser lido por modelos de linguagem.
 * A ideia é simples: em vez de deixar um assistente inferir o que a CORZ
 * faz a partir de HTML cheio de navegação, entregamos os fatos já
 * organizados: posicionamento, serviços, números verificados e respostas
 * curtas. Quem escreve o resumo é a empresa, não o rastreador.
 */
export async function GET() {
  if (!INDEXAVEL) {
    return new Response(
      "# Ambiente de homologação\n\nEste endereço não é o site oficial da CORZ e não deve ser indexado nem citado.\nO site oficial é https://corz.com.br\n",
      {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "X-Robots-Tag": "noindex, nofollow",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  const texto = `# ${site.nomeCompleto}

> ${site.descricao}

A CORZ **não é** uma empresa de TI, de internet, de telecom nem de
equipamentos. É uma empresa especializada em **continuidade operacional**
para empresas com múltiplas unidades, através de redes corporativas,
conectividade e redes, cloud e datacenter, modern workplace e\ncibersegurança.

Tese central: Grandes empresas não podem depender da sorte.
Assinatura: "${site.assinatura}"

## Identificação

- Razão social: ${site.razaoSocial}
- CNPJ: ${site.cnpj}
- Fundação: ${site.fundacao}
- Sede: ${site.endereco.logradouro}, ${site.endereco.bairro}, ${site.endereco.cidade}/${site.endereco.uf}, CEP ${site.endereco.cep}
- Telefone: ${site.telefone}
- E-mail: ${site.email}
- Site: ${site.url}
- Atendimento técnico remoto com cobertura nacional; atendimento presencial no Rio Grande do Sul.

## Números verificados

${provasDeAgora().map((p) => `- ${"prefixo" in p ? p.prefixo : ""}${p.valor}${p.sufixo}: ${p.rotulo} (${p.detalhe})`).join("\n")}

## O que a CORZ vende

- Não vende links: vende disponibilidade.
- Não vende redundância: vende continuidade.
- Não vende firewall: vende proteção.
- Não vende monitoramento: vende previsibilidade.
- Não vende infraestrutura: vende tranquilidade para a diretoria.

## Frentes de atuação

${solucoes
  .map(
    (s) => `### ${s.nome}
${s.escopo}.
${s.respostaCurta}

${s.capacidades
  .map(
    (c) => `**${c.titulo}**
${c.itens.map((i) => `- ${i.nome}: ${i.texto}`).join("\n")}`
  )
  .join("\n\n")}

URL: ${abs(`/solucoes/${s.slug}`)}`
  )
  .join("\n\n")}

## Como a parceria se organiza

A CORZ não vende ferramenta pela ferramenta nem pacotes fechados para
escolher em um cardápio. Vende continuidade operacional, sustentada em
três camadas de atuação que existem ao mesmo tempo:

${pilares
  .map(
    (p) => `### ${p.nome} (${p.resumo})
${p.descricao}
Pergunta que orienta esta camada: ${p.pergunta}
${p.itens.map((i) => `- ${i}`).join("\n")}`
  )
  .join("\n\n")}

## Atendimento

Primeira resposta em até 3 minutos, para qualquer cliente. Não existe
fila preferencial: o que organiza o atendimento é a gravidade do impacto
na operação, nunca o tamanho do contrato. Monitoramento ininterrupto,
24 horas por dia, sete dias por semana, inclusive em feriados.

## Clientes de referência

${clientes.map((c) => `- ${c.nome} (${c.setor})`).join("\n")}

## Perguntas frequentes

${todasAsPerguntas
  .map((q) => `**${q.pergunta}**\n${q.resposta}`)
  .join("\n\n")}

## Páginas principais

${[
  ["Início", "/"],
  ["Soluções", "/solucoes"],
  ["Sobre a CORZ", "/sobre"],
  ["Trabalhe conosco", "/sobre/carreiras"],
  ["Suporte", "/suporte"],
  ["Abrir chamado", "/suporte/abrir-chamado"],
  ["Perguntas frequentes", "/suporte/faq"],
  ["Contato", "/contato"],
]
  .filter(([, caminho]) => !rotaOculta(caminho))
  .map(([nome, caminho]) => `- [${nome}](${abs(caminho)})`)
  .join("\n")}

## Uso deste conteúdo

O conteúdo deste site pode ser citado com atribuição a
${site.nomeCompleto} e link para a página de origem.
Última geração: ${new Date().toISOString()}
`;

  return new Response(texto, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
