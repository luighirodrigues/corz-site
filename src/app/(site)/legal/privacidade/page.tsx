import type { Metadata } from "next";
import DocumentoLegal from "@/components/blocos/DocumentoLegal";
import { metadados, DadosEstruturados, grafo, pagina, trilha } from "@/lib/seo";
import { site } from "@/conteudo/site";

export const metadata: Metadata = metadados({
  titulo: "Política de Privacidade e LGPD",
  descricao:
    "Como a CORZ Tecnologia coleta, usa, armazena e protege dados pessoais, e como exercer seus direitos previstos na Lei Geral de Proteção de Dados.",
  caminho: "/legal/privacidade",
});

const ATUALIZADO = "17 de agosto de 2026";

const SECOES = [
  {
    id: "quem-somos",
    titulo: "Quem é o controlador dos seus dados",
    paragrafos: [
      `${site.razaoSocial}, inscrita no CNPJ sob o nº ${site.cnpj}, com sede na ${site.endereco.logradouro}, ${site.endereco.bairro}, ${site.endereco.cidade}/${site.endereco.uf}, CEP ${site.endereco.cep}, é a controladora dos dados pessoais tratados por meio deste site e dos serviços prestados a seus clientes.`,
      `Esta política explica, em linguagem direta, quais dados coletamos, por que coletamos, com quem eventualmente compartilhamos e como você pode exercer os direitos garantidos pela Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais, a LGPD).`,
    ],
  },
  {
    id: "dados-coletados",
    titulo: "Quais dados coletamos",
    paragrafos: [
      "Coletamos apenas o necessário para responder a você e prestar o serviço contratado. Não compramos listas e não coletamos dados sensíveis por meio deste site.",
      "Dados que você nos fornece voluntariamente:",
      [
        "Nome, e-mail, telefone, empresa e cargo, quando você preenche um formulário de contato, diagnóstico ou candidatura.",
        "Conteúdo da mensagem que você escreve, incluindo a descrição técnica em uma abertura de chamado.",
        "E-mail e nome, quando você assina a nossa lista de conteúdo.",
      ],
      "Dados coletados automaticamente:",
      [
        "Endereço IP e agente de usuário do navegador, registrados junto ao envio de formulários para fins de segurança e prevenção a abuso.",
        "Parâmetros de campanha (utm_source, utm_medium, utm_campaign e similares) presentes na URL de origem, quando existirem.",
        "Dados de navegação agregados, quando ferramentas de medição estiverem ativas, conforme a Política de Cookies.",
      ],
    ],
  },
  {
    id: "finalidades",
    titulo: "Por que tratamos seus dados",
    paragrafos: [
      "Cada dado coletado tem uma finalidade determinada e uma base legal correspondente:",
      [
        "Responder a solicitações de contato, diagnóstico e proposta comercial. Base legal: procedimentos preliminares relacionados a contrato, a pedido do titular (art. 7º, V).",
        "Executar o contrato de prestação de serviços, incluindo abertura de chamados e comunicação operacional. Base legal: execução de contrato (art. 7º, V).",
        "Prevenir fraude e abuso nos formulários e garantir a segurança da aplicação. Base legal: legítimo interesse (art. 7º, IX).",
        "Enviar conteúdo por e-mail quando você assina a lista. Base legal: consentimento (art. 7º, I), revogável a qualquer momento.",
        "Cumprir obrigações legais, fiscais e regulatórias. Base legal: cumprimento de obrigação legal (art. 7º, II).",
      ],
      "Não utilizamos dados pessoais coletados neste site para decisões automatizadas que afetem seus interesses, nem para criar perfis comportamentais com finalidade publicitária.",
    ],
  },
  {
    id: "compartilhamento",
    titulo: "Com quem compartilhamos",
    paragrafos: [
      "Não vendemos, alugamos nem cedemos dados pessoais a terceiros para fins comerciais. O compartilhamento ocorre apenas nas seguintes situações:",
      [
        "Operadores que processam dados em nosso nome e sob nossa instrução, como provedores de hospedagem, envio de e-mail e ferramentas de atendimento, todos submetidos a obrigações contratuais de confidencialidade e segurança.",
        "Operadoras de telecomunicações e fornecedores, quando a abertura de um chamado técnico em seu nome exigir a identificação do contato responsável.",
        "Autoridades públicas, quando houver requisição legal, judicial ou administrativa válida.",
      ],
      "Quando um operador estiver localizado fora do Brasil, a transferência internacional é feita com base em garantias contratuais adequadas, nos termos do art. 33 da LGPD.",
    ],
  },
  {
    id: "retencao",
    titulo: "Por quanto tempo guardamos",
    paragrafos: [
      "Mantemos dados pessoais apenas pelo tempo necessário à finalidade que motivou a coleta:",
      [
        "Contatos comerciais que não evoluíram para contrato: até 24 meses a partir do último contato.",
        "Dados de clientes ativos: durante toda a vigência do contrato e por 5 anos após o encerramento, para cumprimento de obrigações legais e defesa em eventual processo.",
        "Registros de acesso e logs de segurança: 6 meses, conforme o Marco Civil da Internet (Lei nº 12.965/2014).",
        "Candidaturas a vagas: até 12 meses, salvo pedido de exclusão antes desse prazo.",
      ],
      "Após esses períodos, os dados são eliminados ou anonimizados de forma irreversível.",
    ],
  },
  {
    id: "direitos",
    titulo: "Seus direitos como titular",
    paragrafos: [
      "A LGPD garante a você, a qualquer momento e sem custo, os seguintes direitos:",
      [
        "Confirmar se tratamos dados a seu respeito e acessar esses dados.",
        "Corrigir dados incompletos, inexatos ou desatualizados.",
        "Solicitar anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei.",
        "Solicitar a portabilidade dos dados a outro fornecedor.",
        "Revogar o consentimento e solicitar a eliminação dos dados tratados com essa base.",
        "Ser informado sobre as entidades com as quais compartilhamos dados.",
        "Opor-se a tratamento realizado com fundamento em legítimo interesse.",
      ],
      `Para exercer qualquer desses direitos, escreva para ${site.email}. Responderemos em até 15 dias. Podemos solicitar informações adicionais para confirmar sua identidade antes de atender ao pedido. É uma medida de proteção a você.`,
    ],
  },
  {
    id: "seguranca",
    titulo: "Como protegemos",
    paragrafos: [
      "Segurança da informação é o nosso ofício, e aplicamos aos nossos próprios dados o mesmo padrão que entregamos a clientes:",
      [
        "Tráfego cifrado em trânsito (TLS) em todas as páginas e formulários.",
        "Senhas de acesso administrativo armazenadas com algoritmo de derivação de chave resistente a força bruta, jamais em texto claro.",
        "Autenticação em duas etapas disponível para todas as contas administrativas.",
        "Acesso a dados pessoais restrito por função, com registro de auditoria das operações relevantes.",
        "Rotinas de backup com teste periódico de restauração.",
      ],
      "Nenhum sistema é absolutamente inviolável. Em caso de incidente de segurança que possa acarretar risco relevante aos titulares, comunicaremos os afetados e a Autoridade Nacional de Proteção de Dados nos prazos previstos em lei.",
    ],
  },
  {
    id: "alteracoes",
    titulo: "Alterações desta política",
    paragrafos: [
      `Esta política pode ser revisada para refletir mudanças legais, técnicas ou de negócio. A data da última atualização é sempre exibida no início do documento. Versão vigente desde ${ATUALIZADO}.`,
      "Alterações materiais, que afetem direitos ou finalidades de tratamento, serão comunicadas de forma destacada no site e, quando houver base para contato, por e-mail.",
    ],
  },
];

export default function PaginaPrivacidade() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Política de Privacidade e LGPD: CORZ",
            descricao:
              "Como a CORZ trata dados pessoais e como exercer direitos previstos na LGPD.",
            caminho: "/legal/privacidade",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Políticas", caminho: "/legal" },
            { nome: "Privacidade e LGPD", caminho: "/legal/privacidade" },
          ])
        )}
      />
      <DocumentoLegal
        rotulo="Privacidade e LGPD"
        titulo="Seus dados tratados"
        destaque="com o mesmo zelo da sua rede."
        resumo="Coletamos o mínimo necessário, dizemos exatamente para quê e devolvemos o controle a você. Esta política vale para o site e para os serviços prestados pela CORZ."
        atualizadoEm={ATUALIZADO}
        caminho="/legal/privacidade"
        secoes={SECOES}
      />
    </>
  );
}
