/**
 * Base de perguntas frequentes.
 *
 * Cada resposta é escrita para ser autossuficiente: quem lê só ela,
 * fora da página, entende. É esse formato que permite ser citado por
 * mecanismos de busca e por modelos de linguagem sem distorção.
 */

export type GrupoFaq = {
  slug: string;
  titulo: string;
  descricao: string;
  itens: { pergunta: string; resposta: string }[];
};

export const grupos: GrupoFaq[] = [
  {
    slug: "sobre-a-corz",
    titulo: "Sobre a CORZ",
    descricao: "Quem somos, o que fazemos e o que não fazemos.",
    itens: [
      {
        pergunta: "O que a CORZ Tecnologia faz?",
        resposta:
          "A CORZ responde pela continuidade operacional de empresas com múltiplas unidades. Isso inclui gestão dos links de internet de cada unidade, projeto e operação da rede interna, segurança na borda de cada ponto, gestão de servidores e nuvem, telefonia em nuvem com IA e auditoria de contratos de telecom. A empresa fica com um único responsável no lugar de vários fornecedores.",
      },
      {
        pergunta: "A CORZ é um provedor de internet?",
        resposta:
          "Não. A CORZ não vende link nem é operadora. Gerencia os circuitos que a empresa já contrata, de qualquer operadora, e responde pela disponibilidade da unidade, incluindo abrir e cobrar chamados junto à operadora em nome do cliente.",
      },
      {
        pergunta: "Onde a CORZ fica e até onde atende?",
        resposta:
          "A sede e o centro de operações ficam em Pelotas, Rio Grande do Sul. O monitoramento e a gestão técnica são remotos, com cobertura nacional. O atendimento presencial cobre a metade sul do Rio Grande do Sul, e projetos maiores são atendidos em campo em todo o estado.",
      },
      {
        pergunta: "Desde quando a CORZ existe?",
        resposta:
          "Desde 2012. São 14 anos de operação contínua, com disponibilidade média medida de 99,7% nas redes que a empresa gerencia.",
      },
      {
        pergunta: "Que tipo de empresa a CORZ atende?",
        resposta:
          "Empresas cuja operação para quando a tecnologia para: negócios com várias unidades, centros de distribuição, indústrias, prestadores de serviço e instituições de ensino. O critério não é o faturamento, é a dependência. Se uma hora parada gera prejuízo relevante, o modelo faz sentido.",
      },
    ],
  },
  {
    slug: "contratos-e-parceria",
    titulo: "Contratos e forma de trabalho",
    descricao: "Como a contratação funciona na prática.",
    itens: [
      {
        pergunta: "A CORZ vende pacotes fechados de serviço?",
        resposta:
          "Não. A CORZ não vende ferramenta pela ferramenta: vende continuidade operacional, sustentada em três camadas que existem ao mesmo tempo. TI Estratégica entende para onde o negócio quer chegar e qual infraestrutura aguenta esse crescimento. TI Tática define governança: quais procedimentos existem, quem tem acesso ao quê e o que acontece quando algo falha. TI Operacional é o dia a dia: monitoramento ativo, chamados abertos junto a fornecedores e disponibilidade acompanhada com número. O escopo é montado a partir de onde a operação está exposta, nunca escolhido em um cardápio.",
      },
      {
        pergunta: "Existe fidelidade ou multa por cancelamento?",
        resposta:
          "As condições de vigência são definidas em contrato e discutidas antes da assinatura, variando conforme o investimento inicial de projeto e equipamento. Não há cláusula surpresa: o que rege o encerramento fica explícito na proposta.",
      },
      {
        pergunta: "Como é feita a cobrança?",
        resposta:
          "Contrato mensal por escopo, dimensionado pelo número de unidades, pela criticidade da operação e pela profundidade da parceria. Projetos de laboratório e auditorias podem ser cobrados à parte. A auditoria de telecom, especificamente, pode ser remunerada pela economia efetivamente gerada.",
      },
      {
        pergunta: "Preciso comprar equipamentos da CORZ?",
        resposta:
          "Não necessariamente. Começamos com o parque que existe. Substituição de equipamento só é recomendada quando ele é o gargalo real, e sempre acompanhada do número que justifica a troca.",
      },
    ],
  },
  {
    slug: "suporte-e-sla",
    titulo: "Suporte e SLA",
    descricao: "Prazos, canais e como acionar a CORZ.",
    itens: [
      {
        pergunta: "Em quanto tempo a CORZ responde a um chamado?",
        resposta:
          "A primeira resposta acontece em até 3 minutos, para qualquer cliente. Não existe fila preferencial na CORZ: o que organiza o atendimento é a gravidade do impacto na operação, nunca o tamanho do contrato. O prazo de solução varia conforme a natureza do problema e é acompanhado com o cliente até o encerramento.",
      },
      {
        pergunta: "O suporte da CORZ é 24 horas?",
        resposta:
          "Sim. O monitoramento é ininterrupto, 24 horas por dia e sete dias por semana, inclusive em feriados, e há equipe de plantão para operação parada em qualquer horário. Resolver rápido é prioridade da empresa, e isso não depende do porte do contrato.",
      },
      {
        pergunta: "Como abrir um chamado na CORZ?",
        resposta:
          "Pelo formulário de abertura de chamado no site, pelo WhatsApp de suporte ou pelo telefone (53) 3027-2698. Chamados abertos pelo formulário já chegam com o contexto do que está acontecendo, o que coloca a pessoa certa na conversa desde o primeiro minuto.",
      },
      {
        pergunta: "A CORZ avisa antes de eu perceber que caiu?",
        resposta:
          "Sim, esse é o modelo de trabalho. O monitoramento é ativo: o alerta é disparado no segundo da queda, sem depender de alguém da unidade ligar. Em muitos casos o chamado já está aberto na operadora quando o gerente percebe o problema.",
      },
    ],
  },
  {
    slug: "seguranca-e-lgpd",
    titulo: "Cibersegurança e LGPD",
    descricao: "Como a CORZ trata proteção e dados.",
    itens: [
      {
        pergunta: "A CORZ ajuda na adequação à LGPD?",
        resposta:
          "Na camada técnica, sim: mapeamento de onde os dados pessoais trafegam e ficam armazenados, controles de acesso, registro das operações de tratamento e geração de evidências para auditoria. A camada jurídica permanece com o encarregado de dados ou o escritório contratado pela empresa.",
      },
      {
        pergunta: "Antivírus e firewall são suficientes?",
        resposta:
          "Não. São controles pontuais, não uma estratégia. Sem segmentação de rede, gestão de credenciais, backup com restauração testada e um plano de resposta definido antes do incidente, um único clique em uma unidade ainda consegue derrubar a operação inteira.",
      },
      {
        pergunta: "O que acontece se minha empresa sofrer um ataque?",
        resposta:
          "Para clientes com contrato de gestão, a resposta segue um playbook definido previamente: contenção, preservação de evidências, recuperação a partir do backup testado e, ao final, um relatório explicando o que permitiu o incidente e o que muda para não repetir.",
      },
    ],
  },
];

export const todasAsPerguntas = grupos.flatMap((g) => g.itens);
