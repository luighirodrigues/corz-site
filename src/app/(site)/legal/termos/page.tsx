import type { Metadata } from "next";
import DocumentoLegal from "@/components/blocos/DocumentoLegal";
import { metadados, DadosEstruturados, grafo, pagina, trilha } from "@/lib/seo";
import { site } from "@/conteudo/site";

export const metadata: Metadata = metadados({
  titulo: "Termos de Uso",
  descricao:
    "Condições de uso do site da CORZ Tecnologia: finalidade do conteúdo, propriedade intelectual, responsabilidades e foro aplicável.",
  caminho: "/legal/termos",
});

const ATUALIZADO = "17 de agosto de 2026";

const SECOES = [
  {
    id: "aceite",
    titulo: "Aceite destas condições",
    paragrafos: [
      `Este site é mantido por ${site.razaoSocial}, CNPJ ${site.cnpj}. Ao navegar por ele, você concorda com as condições descritas neste documento. Se não concordar com algum ponto, recomendamos que interrompa o uso.`,
      "Estes termos regem exclusivamente o uso do site. A prestação de serviços da CORZ é regida pelo contrato específico firmado com cada cliente, que prevalece sobre este documento em caso de divergência.",
    ],
  },
  {
    id: "finalidade",
    titulo: "Finalidade do conteúdo",
    paragrafos: [
      "O conteúdo publicado neste site, incluindo páginas institucionais, artigos do blog, materiais e a calculadora de custo de parada, tem caráter informativo e educacional.",
      "As estimativas apresentadas em ferramentas interativas são cálculos aproximados baseados nos parâmetros que você informa e nas premissas exibidas junto ao resultado. Não constituem laudo, parecer técnico, garantia de resultado nem recomendação de investimento.",
      "Decisões sobre infraestrutura, segurança ou contratos devem considerar a análise específica da sua operação. É exatamente isso que o diagnóstico da CORZ oferece.",
    ],
  },
  {
    id: "propriedade",
    titulo: "Propriedade intelectual",
    paragrafos: [
      "A marca CORZ, seu símbolo, os textos, o design, o código-fonte e os materiais deste site são de titularidade da CORZ ou licenciados a ela, protegidos pela Lei nº 9.610/1998 e pela Lei nº 9.279/1996.",
      "É permitido:",
      [
        "Citar trechos do conteúdo editorial com atribuição clara e link para a página de origem.",
        "Compartilhar links para qualquer página pública deste site.",
        "Usar os arquivos de marca disponibilizados na página de imprensa, respeitando as regras ali descritas.",
      ],
      "É vedado, sem autorização prévia por escrito:",
      [
        "Reproduzir integralmente artigos ou páginas em outro domínio.",
        "Utilizar a marca CORZ de forma que sugira parceria, endosso ou vínculo inexistente.",
        "Extrair conteúdo de forma automatizada em volume que comprometa a disponibilidade do site.",
        "Realizar engenharia reversa, teste de intrusão ou varredura de vulnerabilidade sem autorização formal.",
      ],
    ],
  },
  {
    id: "conta-administrativa",
    titulo: "Área administrativa",
    paragrafos: [
      "O acesso ao painel administrativo é restrito a pessoas autorizadas pela CORZ. As credenciais são pessoais e intransferíveis.",
      "O titular da credencial responde pelas ações praticadas com ela e deve comunicar imediatamente qualquer suspeita de comprometimento. Todas as operações relevantes são registradas em trilha de auditoria, com identificação de autor, data e endereço de origem.",
    ],
  },
  {
    id: "disponibilidade",
    titulo: "Disponibilidade do site",
    paragrafos: [
      "Trabalhamos para manter este site disponível de forma contínua, mas ele pode ficar temporariamente indisponível para manutenção, atualização ou por eventos fora do nosso controle razoável.",
      "A indisponibilidade do site institucional não se confunde com os níveis de serviço contratados por clientes, que são regidos pelo respectivo contrato e medidos nos ambientes sob nossa gestão.",
    ],
  },
  {
    id: "links",
    titulo: "Links para terceiros",
    paragrafos: [
      "Este site pode conter links para sites de terceiros, como redes sociais e plataformas de conteúdo. A CORZ não controla e não responde pelo conteúdo, pelas práticas de privacidade ou pela disponibilidade desses destinos.",
    ],
  },
  {
    id: "alteracoes",
    titulo: "Alterações e foro",
    paragrafos: [
      `Estes termos podem ser atualizados a qualquer momento, passando a valer a partir da publicação. A versão vigente é a exibida nesta página, atualizada em ${ATUALIZADO}.`,
      `Aplica-se a legislação brasileira. Fica eleito o foro da comarca de ${site.endereco.cidade}, ${site.endereco.uf}, para dirimir controvérsias decorrentes deste documento, com renúncia a qualquer outro, por mais privilegiado que seja.`,
    ],
  },
];

export default function PaginaTermos() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Termos de Uso: CORZ",
            descricao: "Condições de uso do site da CORZ Tecnologia.",
            caminho: "/legal/termos",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Políticas", caminho: "/legal" },
            { nome: "Termos de Uso", caminho: "/legal/termos" },
          ])
        )}
      />
      <DocumentoLegal
        rotulo="Termos de Uso"
        titulo="As regras do jogo,"
        destaque="escritas para serem lidas."
        resumo="Sem letra miúda e sem parágrafo de dez linhas. O que você pode fazer com o conteúdo deste site, o que não pode, e por quais coisas cada parte responde."
        atualizadoEm={ATUALIZADO}
        caminho="/legal/termos"
        secoes={SECOES}
      />
    </>
  );
}
