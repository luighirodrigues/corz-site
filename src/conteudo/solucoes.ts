/**
 * As quatro frentes da CORZ.
 *
 * A empresa organiza tudo o que entrega em quatro domínios, e o site
 * segue exatamente esse recorte: Conectividade e Redes, Cloud e
 * Datacenter, Modern Workplace e Cibersegurança.
 *
 * Três regras de escrita valem em todo este arquivo:
 *
 * 1. Sem travessão. Vírgula, ponto ou dois-pontos resolvem.
 * 2. Sem exemplo exclusivo de varejo no argumento central. A estratégia
 *    comercial mira redes com muitas unidades, mas a entrega serve
 *    indústria, saúde, ensino e serviços. Copy que só fala de loja
 *    afasta os outros.
 * 3. `respostaCurta` tem de 40 a 60 palavras e responde a pergunta
 *    sozinha, fora da página. É o trecho que buscador e assistente
 *    citam, e é o que sustenta o bloco de destaque no topo.
 *
 * O campo `capacidades` é o inventário do que a frente cobre, agrupado
 * por tema. Serve a duas coisas ao mesmo tempo: dá ao leitor uma lista
 * que se varre com os olhos em segundos, e dá ao buscador os termos
 * técnicos que as pessoas efetivamente pesquisam.
 */

/**
 * Um produto dentro de uma frente.
 *
 * `nome` é como o mercado chama a coisa, e é por ele que a pessoa
 * pesquisa. `texto` explica em uma ou duas frases o que aquilo resolve,
 * porque lista de siglas sem explicação não vende nem informa: quem
 * conhece já sabia, e quem não conhece continua sem saber.
 */
export type Produto = {
  nome: string;
  texto: string;
};

export type Capacidade = {
  titulo: string;
  itens: Produto[];
};

export type Solucao = {
  slug: string;
  indice: string;
  nome: string;
  menu: string;
  /** Linha de apoio do título, direto do recorte da empresa. */
  escopo: string;
  icone: "conectividade" | "cloud" | "workplace" | "seguranca";
  cor: string;
  titulo: { antes: string; destaque: string; depois?: string };
  promessa: string;
  /** Frase do card na home e na listagem. */
  chamada: string;
  respostaCurta: string;
  dor: { titulo: string; texto: string };
  riscos: string[];
  consequencia: string;
  capacidades: Capacidade[];
  solucao: { titulo: string; itens: { titulo: string; texto: string }[] };
  entregaveis: string[];
  cta: { titulo: string; texto: string; botao: string };
  faq: { pergunta: string; resposta: string }[];
  seo: { titulo: string; descricao: string; termos: string[] };
};

export const solucoes: Solucao[] = [
  // ---------------------------------------------------------------- 01
  {
    slug: "conectividade-redes",
    indice: "01",
    nome: "Conectividade & Redes",
    menu: "Conectividade & Redes",
    escopo: "Conectividade, WAN e rede interna das unidades",
    icone: "conectividade",
    cor: "#00ADE7",
    titulo: {
      antes: "A unidade ficou sem internet.",
      destaque: "Quem chama a operadora?",
    },
    promessa:
      "A internet é da operadora. A responsabilidade de manter a unidade no ar é nossa.",
    chamada:
      "Do link da operadora até a última porta de switch. Um responsável no lugar de quatro fornecedores apontando um para o outro.",
    respostaCurta:
      "A CORZ assume a conectividade de ponta a ponta: contrata e gerencia links de internet dedicada, monta a WAN que interliga as unidades com SD-WAN, projeta a rede interna com switching, VLANs e Wi-Fi corporativo, e monitora tudo 24 horas por dia. Também audita contratos de telecom e cobra as operadoras em nome do cliente.",
    dor: {
      titulo: "O link caiu e ninguém sabe há quanto tempo",
      texto:
        "Na maioria das operações, a queda é descoberta pelo caminho mais lento possível. Alguém da unidade liga para o escritório. O escritório liga para a operadora. A operadora abre um protocolo. E a operação segue parada enquanto todo mundo procura de quem é a culpa.",
    },
    riscos: [
      "Descoberta reativa: a operação já parou quando alguém percebe",
      "Chamados abertos pelo cliente, sem escalonamento e sem cobrança de prazo",
      "Contratos sem redundância real, apenas a promessa de uma",
      "Rede plana, em que qualquer aparelho enxerga o sistema que fatura",
      "Faturas de telecom com cobranças que não batem com o contrato assinado",
      "Cada unidade montada de um jeito, sem topologia documentada",
    ],
    consequencia:
      "Uma unidade parada não perde só o faturamento daquelas horas. Perde o cliente que desistiu de esperar, o pedido que o concorrente entregou e a confiança de quem passou a considerar outro fornecedor.",
    capacidades: [
      {
        titulo: "Conectividade",
        itens: [
          {
            nome: "Acesso à internet dedicado",
            texto:
              "Link com banda garantida e simétrica, com prazo de reparo em contrato. Diferente da banda larga comum, a velocidade contratada é a que você tem no horário de pico.",
          },
          {
            nome: "Banda larga empresarial",
            texto:
              "Alternativa de menor custo para pontos de baixa criticidade, ou como segundo caminho ao lado de um link dedicado.",
          },
          {
            nome: "Transporte de dados e redes privadas",
            texto:
              "Circuito fechado entre as unidades, sem passar pela internet pública. O tráfego entre matriz, filiais e datacenter anda isolado.",
          },
          {
            nome: "Interligação de unidades",
            texto:
              "Todas as unidades enxergando os mesmos sistemas como se estivessem na mesma rede, com endereçamento e rotas padronizados.",
          },
          {
            nome: "Fibra apagada",
            texto:
              "A fibra é sua e o equipamento das pontas também. Faz sentido em campus, hospitais e indústrias, onde o volume justifica não pagar banda por megabit.",
          },
        ],
      },
      {
        titulo: "WAN inteligente",
        itens: [
          {
            nome: "SD-WAN",
            texto:
              "Uma camada de software decide por qual link cada tipo de tráfego passa e troca de rota sozinha quando um deles degrada, antes de alguém reclamar.",
          },
          {
            nome: "Gestão centralizada da WAN",
            texto:
              "Uma tela só com todas as unidades, e mudança de política aplicada em todas ao mesmo tempo, em vez de configuração ponto a ponto.",
          },
          {
            nome: "Redundância e balanceamento",
            texto:
              "Dois ou mais caminhos por unidade, dimensionados pela criticidade dela, com o tráfego distribuído em vez de um link ocioso esperando o dia da falha.",
          },
          {
            nome: "Contingência de links",
            texto:
              "Saída de reserva, inclusive por rede móvel, para o ponto continuar operando enquanto a operadora resolve o problema dela.",
          },
        ],
      },
      {
        titulo: "Rede interna",
        itens: [
          {
            nome: "Switching e cabeamento",
            texto:
              "Projeto, instalação e operação da rede de dentro da unidade, com topologia documentada e configuração versionada. Trocar um equipamento leva minutos.",
          },
          {
            nome: "VLANs e segmentação",
            texto:
              "Sistemas críticos, câmeras, administrativo e visitantes em redes que não se enxergam. Um aparelho comprometido não alcança o que fatura.",
          },
          {
            nome: "Padronização das unidades",
            texto:
              "A rede da unidade mais nova é igual à da primeira. Quem resolve um problema em uma resolve em qualquer outra.",
          },
          {
            nome: "Wi-Fi corporativo",
            texto:
              "Cobertura calculada para o horário de maior movimento, com autenticação por usuário e roaming entre pontos de acesso.",
          },
          {
            nome: "Rede de visitantes",
            texto:
              "Internet para visitante e para dispositivo pessoal, isolada da rede da empresa e com banda limitada, sem abrir porta nenhuma.",
          },
        ],
      },
      {
        titulo: "Gestão e governança",
        itens: [
          {
            nome: "Monitoramento de links e desempenho",
            texto:
              "Cada circuito acompanhado 24 horas por dia, com alerta no segundo da queda e histórico de latência, perda e disponibilidade por unidade.",
          },
          {
            nome: "Gestão de operadoras",
            texto:
              "Abrimos, acompanhamos e cobramos o chamado junto à operadora no seu lugar, com o histórico técnico na mão para escalar quando o prazo estoura.",
          },
          {
            nome: "Auditoria de telecom",
            texto:
              "Cruzamos fatura, contrato e uso real. Circuito de endereço desativado, serviço nunca pedido e reajuste fora do índice são contestados formalmente.",
          },
        ],
      },
    ],
    solucao: {
      titulo: "Uma rede só, do link da operadora à última tomada",
      itens: [
        {
          titulo: "Monitoramento contínuo de cada circuito",
          texto:
            "Cada link de cada unidade é acompanhado 24 horas por dia. No segundo da queda, o alerta chega ao nosso time e à liderança do cliente, antes de a operação sentir.",
        },
        {
          titulo: "Nós abrimos o chamado por você",
          texto:
            "Abrimos, acompanhamos e cobramos a solução junto à operadora no seu lugar. Sua equipe não perde a manhã em espera telefônica.",
        },
        {
          titulo: "SD-WAN com troca automática",
          texto:
            "Quando o link principal degrada, o tráfego crítico migra sozinho para o secundário. A operação continua enquanto a operadora resolve o problema dela.",
        },
        {
          titulo: "Separação real de tráfego",
          texto:
            "Sistemas críticos, câmeras, administrativo e Wi-Fi de visitante em VLANs isoladas. O visitante conectado nunca divide rede com o que fatura.",
        },
        {
          titulo: "Mesmo padrão em todas as unidades",
          texto:
            "A rede da unidade mais nova é igual à da primeira, com configuração versionada. Trocar um equipamento leva minutos, não um dia de obra.",
        },
        {
          titulo: "Auditoria de contratos e faturas",
          texto:
            "Cruzamos fatura, contrato e uso real. Cobrança indevida é contestada formalmente, com acompanhamento até o crédito aparecer.",
        },
      ],
    },
    entregaveis: [
      "Inventário de circuitos, contratos e custos por unidade",
      "Diagrama e topologia documentada de cada ponto",
      "Projeto de redundância dimensionado por criticidade",
      "Padrão de rede replicável para abertura de novas unidades",
      "Contestações de telecom protocoladas e acompanhadas",
      "Relatório executivo mensal de disponibilidade e custo",
    ],
    cta: {
      titulo:
        "Você sabe quantas horas suas unidades ficaram fora no último mês?",
      texto:
        "Se a resposta demora, a resposta é não. Levantamos a disponibilidade real e o custo de telecom da sua operação, sem compromisso.",
      botao: "Diagnóstico de conectividade",
    },
    faq: [
      {
        pergunta: "A CORZ é uma operadora de internet?",
        resposta:
          "Não. A CORZ não é operadora. Gerenciamos os circuitos que a sua empresa contrata, de qualquer operadora, e respondemos pela disponibilidade da unidade. Quando é preciso contratar um novo link, negociamos em seu nome, mas o contrato continua sendo seu.",
      },
      {
        pergunta: "O que é SD-WAN e quando ela compensa?",
        resposta:
          "SD-WAN é uma camada de software que gerencia todos os links de todas as unidades de forma centralizada, decidindo por qual caminho cada tipo de tráfego passa e trocando de rota sozinha quando um link degrada. Compensa a partir do momento em que existem várias unidades e mais de um link por ponto, porque é o que transforma redundância contratada em redundância que funciona sem alguém apertar um botão.",
      },
      {
        pergunta: "Preciso trocar de operadora para trabalhar com a CORZ?",
        resposta:
          "Não. Começamos com o que você já tem. Na maioria dos casos o ganho vem de ajustar o contrato atual ao consumo real, remover circuitos inativos e contestar cobranças. Troca de fornecedor só é recomendada quando o número justifica.",
      },
      {
        pergunta: "Em quanto tempo vocês percebem que um link caiu?",
        resposta:
          "No segundo da queda. O monitoramento é ativo e o alerta é disparado automaticamente, sem depender de alguém da unidade avisar.",
      },
      {
        pergunta: "Vocês atendem a abertura de novas unidades?",
        resposta:
          "Sim. Entregamos um padrão replicável de rede para abertura, com prazo definido, e cuidamos da contratação do circuito assim que o endereço é confirmado. É o item do projeto cujo prazo não depende da empresa, e por isso precisa começar cedo.",
      },
    ],
    seo: {
      titulo: "Conectividade e redes corporativas para múltiplas unidades",
      descricao:
        "Internet dedicada, SD-WAN, interligação de unidades, Wi-Fi corporativo, monitoramento de links 24 horas e auditoria de telecom, com um único responsável pela disponibilidade.",
      termos: [
        "conectividade empresarial",
        "SD-WAN",
        "gestão de links de internet",
        "rede corporativa multiunidades",
        "wi-fi corporativo",
        "auditoria de telecom",
        "interligação de filiais",
      ],
    },
  },

  // ---------------------------------------------------------------- 02
  {
    slug: "cloud-datacenter",
    indice: "02",
    nome: "Cloud & Datacenter",
    menu: "Cloud & Datacenter",
    escopo: "Hospedar, processar, armazenar e recuperar ambientes",
    icone: "cloud",
    cor: "#3F39BD",
    titulo: {
      antes: "Se o servidor cair agora,",
      destaque: "em quanto tempo volta?",
    },
    promessa:
      "Ambientes gerenciados no provedor que você escolher, com tempo de retomada medido e não estimado.",
    chamada:
      "Nuvem pública, privada, híbrida ou servidor dedicado. Com backup testado e plano de recuperação que já foi ensaiado.",
    respostaCurta:
      "A CORZ hospeda e opera ambientes em nuvem pública, privada, híbrida, colocation e servidores dedicados. Faz a migração, dimensiona por uso medido, monitora disponibilidade e capacidade, mantém backup de servidores, endpoints, bancos e SaaS, e sustenta um plano de Disaster Recovery com RPO e RTO definidos por escrito.",
    dor: {
      titulo: "O backup existe no contrato e nunca foi restaurado",
      texto:
        "Quase toda empresa tem uma rotina de backup rodando. Poucas sabem quanto tempo levaria para voltar de verdade, e quase nenhuma testou. A descoberta costuma acontecer no pior dia possível, quando já não há plano B nem tempo para inventar um.",
    },
    riscos: [
      "Ambiente compartilhado disputando recurso com cargas de terceiros",
      "Dimensionamento por estimativa, não por medição de uso real",
      "Sem redundância, uma falha de host derruba o sistema inteiro",
      "Backup que nunca foi restaurado, e que portanto não é backup",
      "Nenhum RPO e RTO acordados, então ninguém sabe o que esperar",
      "Fatura de nuvem crescendo sem que alguém saiba explicar por quê",
    ],
    consequencia:
      "Servidor mal dimensionado não avisa antes. Avisa no fechamento, no pico de demanda ou na integração fiscal, exatamente quando a empresa menos pode perder tempo. E ambiente sem plano de recuperação transforma uma falha de horas em uma parada de dias.",
    capacidades: [
      {
        titulo: "Ambientes",
        itens: [
          {
            nome: "Nuvem pública",
            texto:
              "Ambientes nos grandes provedores, com o consumo dimensionado e acompanhado. Você paga pelo que usa, e alguém garante que o que você usa faz sentido.",
          },
          {
            nome: "Nuvem privada",
            texto:
              "Recurso reservado só para a sua operação, sem dividir processamento com carga de terceiro. É o caminho quando o sistema precisa responder igual no fechamento e no dia calmo.",
          },
          {
            nome: "Nuvem híbrida",
            texto:
              "Parte no provedor público, parte em ambiente dedicado, conforme o que cada sistema exige de desempenho, custo e conformidade.",
          },
          {
            nome: "Máquinas virtuais e IaaS",
            texto:
              "Servidores provisionados sob demanda, com porte ajustável. Crescer deixa de exigir compra de equipamento e semanas de espera.",
          },
          {
            nome: "Colocation",
            texto:
              "Seu equipamento em datacenter com energia redundante, refrigeração e link de operadora. A máquina é sua, a infraestrutura em volta é nossa.",
          },
          {
            nome: "Servidores dedicados",
            texto:
              "Máquina física inteira reservada para você, quando a carga não cabe bem em ambiente virtualizado ou o licenciamento exige.",
          },
        ],
      },
      {
        titulo: "Migração e operação",
        itens: [
          {
            nome: "Migração para nuvem",
            texto:
              "Feita por onda, começando pelo que tem menor risco, com janela combinada e plano de retorno definido antes de qualquer mudança.",
          },
          {
            nome: "Gestão de ambientes",
            texto:
              "Atualização, ajuste de porte, controle de acesso e rotina de manutenção. O ambiente não fica parado no estado do dia da migração.",
          },
          {
            nome: "Monitoramento e disponibilidade",
            texto:
              "Processamento, memória, disco e resposta acompanhados o tempo todo, com alerta antes de a lentidão virar reclamação de usuário.",
          },
          {
            nome: "Gestão de capacidade",
            texto:
              "Projeção de quanto o ambiente aguenta e de quando vai apertar, para a decisão de crescer vir antes do gargalo e não depois.",
          },
        ],
      },
      {
        titulo: "Continuidade",
        itens: [
          {
            nome: "Backup de servidores",
            texto:
              "Cópia periódica dos ambientes inteiros, com retenção acordada e restauração testada. Backup que nunca voltou não é backup.",
          },
          {
            nome: "Backup de endpoints",
            texto:
              "Os arquivos das estações e notebooks também entram na rotina. É o que salva a proposta que só existia na máquina de quem viaja.",
          },
          {
            nome: "Backup de bancos de dados",
            texto:
              "Cópia consistente do banco, com ponto de recuperação frequente, para voltar sem transação pela metade nem base corrompida.",
          },
          {
            nome: "Backup de SaaS",
            texto:
              "E-mail e suíte de produtividade em cópia separada. O provedor garante o serviço dele, não o seu dado apagado por engano ou por um ataque.",
          },
          {
            nome: "Disaster Recovery",
            texto:
              "Ambiente de retomada pronto e ensaiado, com RPO e RTO acordados: quanto dado a operação aceita perder e em quanto tempo precisa voltar.",
          },
        ],
      },
      {
        titulo: "Custo",
        itens: [
          {
            nome: "FinOps",
            texto:
              "Consumo acompanhado por ambiente, recurso ocioso identificado e porte ajustado ao uso medido. A economia mais comum não afeta desempenho nenhum.",
          },
        ],
      },
    ],
    solucao: {
      titulo: "Ambiente dimensionado, monitorado e com volta ensaiada",
      itens: [
        {
          titulo: "Multiplataforma de verdade",
          texto:
            "Nuvem pública, privada, híbrida, colocation ou dedicado. Você escolhe onde e nós respondemos pela disponibilidade do que roda lá.",
        },
        {
          titulo: "Dimensionamento por uso medido",
          texto:
            "Medimos consumo antes de recomendar. Recurso a mais é desperdício e recurso a menos é parada anunciada, e os dois aparecem na fatura.",
        },
        {
          titulo: "Migração por onda, com plano de retorno",
          texto:
            "Começamos pelo que tem menor risco operacional, com janela combinada e caminho de volta definido antes de qualquer mudança.",
        },
        {
          titulo: "Backup com restauração testada",
          texto:
            "Backup só conta quando volta. Testamos a restauração periodicamente e registramos o tempo real de recuperação de cada sistema.",
        },
        {
          titulo: "Disaster Recovery com número acordado",
          texto:
            "RPO diz quanto dado a operação aceita perder e RTO diz em quanto tempo precisa voltar. Os dois entram no contrato e são ensaiados.",
        },
        {
          titulo: "FinOps: a conta sob controle",
          texto:
            "Acompanhamos consumo por ambiente, identificamos recurso ocioso e ajustamos reserva e porte. A economia aparece na fatura seguinte.",
        },
      ],
    },
    entregaveis: [
      "Levantamento de carga e capacidade dos ambientes atuais",
      "Projeto de migração com janela e plano de retorno",
      "Ambiente provisionado, monitorado e documentado",
      "Rotina de backup com teste de restauração registrado",
      "Plano de Disaster Recovery com RPO e RTO acordados",
      "Relatório mensal de consumo, disponibilidade e custo",
    ],
    cta: {
      titulo:
        "Quanto tempo sua empresa leva para voltar se o ambiente principal cair agora?",
      texto:
        "Se a resposta é uma estimativa, ela não é um plano. Medimos e apresentamos o tempo real de recuperação da sua operação.",
      botao: "Avaliar ambiente e backup",
    },
    faq: [
      {
        pergunta: "O que são RPO e RTO?",
        resposta:
          "RPO é quanto dado a operação aceita perder, medido em tempo: um RPO de uma hora significa que, no pior caso, se perde o trabalho da última hora. RTO é em quanto tempo o ambiente precisa estar de volta. Sem os dois definidos por escrito, plano de recuperação é intenção, não compromisso.",
      },
      {
        pergunta: "Preciso migrar tudo de uma vez?",
        resposta:
          "Não. A migração é feita por onda, começando pelo que tem menor risco operacional, sempre com plano de retorno definido antes da janela.",
      },
      {
        pergunta: "A CORZ é revenda de algum provedor de nuvem?",
        resposta:
          "Trabalhamos de forma multiplataforma. A recomendação parte do que a sua carga exige e do que o seu time já sabe operar, não de um provedor único.",
      },
      {
        pergunta: "Backup de SaaS é mesmo necessário?",
        resposta:
          "Sim. O provedor de e-mail ou de suíte de produtividade garante a disponibilidade do serviço dele, não a recuperação do seu dado apagado por engano, por política de retenção vencida ou por um ataque. A responsabilidade pelo conteúdo é do cliente, e é por isso que o backup de SaaS é um item à parte.",
      },
      {
        pergunta: "Como a CORZ reduz custo de nuvem sem perder desempenho?",
        resposta:
          "Medindo antes de cortar. As economias mais comuns vêm de recurso provisionado e nunca usado, ambiente de teste ligado fora do horário, armazenamento em camada cara para dado frio e porte de máquina definido por chute na migração inicial. Nenhuma delas afeta desempenho.",
      },
    ],
    seo: {
      titulo: "Cloud, datacenter e backup gerenciado para operações críticas",
      descricao:
        "Nuvem pública, privada e híbrida, colocation, servidores dedicados, backup de servidores e SaaS, Disaster Recovery com RPO e RTO definidos e otimização de custo com FinOps.",
      termos: [
        "cloud gerenciada",
        "colocation e servidor dedicado",
        "backup em nuvem empresarial",
        "disaster recovery RPO RTO",
        "migração para nuvem corporativa",
        "FinOps",
      ],
    },
  },

  // ---------------------------------------------------------------- 03
  {
    slug: "modern-workplace",
    indice: "03",
    nome: "Modern Workplace",
    menu: "Modern Workplace",
    escopo: "Sustentar usuários, dispositivos, colaboração e produtividade",
    icone: "workplace",
    cor: "#2C3191",
    titulo: {
      antes: "Seu time perde horas por semana",
      destaque: "esperando o suporte.",
    },
    promessa:
      "Suporte com gente do outro lado, parque sob controle e usuário produtivo desde o primeiro dia.",
    chamada:
      "Service desk, gestão de dispositivos, e-mail, licenças, identidade e telefonia em nuvem. Tudo o que o usuário toca, cuidado por um time só.",
    respostaCurta:
      "Modern Workplace é a frente da CORZ que sustenta o dia a dia de quem usa a tecnologia: service desk com primeira resposta em até 3 minutos, gestão de endpoints e ativos, manutenção preventiva, e-mail e ferramentas de colaboração, identidade e acesso como serviço, controle de licenças SaaS, PABX em nuvem com contact center e recursos de IA, e a rotina de entrada e saída de pessoas.",
    dor: {
      titulo: "A TI vira uma fila de chamados que nunca anda",
      texto:
        "Notebook que não liga na véspera da viagem. Usuário novo que passa a primeira semana sem acesso. Licença paga de quem saiu há seis meses. Nada disso é grave sozinho, e é justamente por isso que se acumula até consumir o time inteiro em manutenção do óbvio.",
    },
    riscos: [
      "Chamado sem prazo e sem quem responda por ele",
      "Parque sem inventário: ninguém sabe quantas máquinas existem nem onde",
      "Máquina que só recebe manutenção depois que já parou",
      "Usuário desligado que continua com acesso e com licença ativa",
      "Licenças de SaaS pagas em duplicidade ou sem uso nenhum",
      "Entrada de pessoa nova dependendo da boa vontade de quem lembrar",
    ],
    consequencia:
      "Cada hora que um profissional passa esperando a TI é hora paga que não virou trabalho. Multiplicado pelo time inteiro, ao longo do ano, o custo de um suporte lento supera com folga o custo de um suporte bom.",
    capacidades: [
      {
        titulo: "Suporte ao usuário",
        itens: [
          {
            nome: "Service desk",
            texto:
              "Canal único para o usuário pedir ajuda, com primeira resposta em até 3 minutos e chamado acompanhado até o fim. Sem robô de triagem.",
          },
          {
            nome: "Suporte técnico remoto e em campo",
            texto:
              "A maior parte resolve remoto, no mesmo atendimento. O que é físico vira visita agendada, com cobertura em campo no Rio Grande do Sul.",
          },
          {
            nome: "Onboarding de usuários",
            texto:
              "Pessoa nova começa com máquina, e-mail, acessos e ramal prontos no primeiro dia, seguindo o perfil da função e não a memória de quem lembrar.",
          },
          {
            nome: "Desligamento de usuários",
            texto:
              "Acesso revogado, licença liberada e dado preservado no mesmo dia, com registro de tudo. É o furo mais comum e o mais barato de fechar.",
          },
        ],
      },
      {
        titulo: "Parque e dispositivos",
        itens: [
          {
            nome: "Gestão de endpoints",
            texto:
              "Configuração, política e atualização aplicadas de forma central em todas as máquinas, sem depender de alguém sentar em cada uma.",
          },
          {
            nome: "Inventário de parque e ativos",
            texto:
              "Cada equipamento com dono, garantia, configuração e ciclo de vida conhecidos. Planejar troca deixa de ser chute e vira orçamento.",
          },
          {
            nome: "Monitoramento de estações",
            texto:
              "Disco começando a falhar, memória saturada e atualização pendente aparecem antes de virarem chamado urgente na véspera de uma entrega.",
          },
          {
            nome: "Manutenção preventiva",
            texto:
              "Rotina de limpeza, atualização e verificação com data marcada. Manutenção que acontece antes da falha custa uma fração da que acontece depois.",
          },
        ],
      },
      {
        titulo: "Colaboração e produtividade",
        itens: [
          {
            nome: "E-mail corporativo",
            texto:
              "Implantação e operação do e-mail da empresa, com domínio configurado corretamente para não cair em caixa de spam nem ser usado para falsificar o seu remetente.",
          },
          {
            nome: "Ferramentas de colaboração",
            texto:
              "Arquivos, reuniões e comunicação da equipe em um conjunto só, configurado com regra de compartilhamento em vez de link aberto para qualquer pessoa.",
          },
          {
            nome: "Gestão de licenças SaaS",
            texto:
              "Comparação mensal entre o que é pago e o que é usado. As descobertas de sempre são licença de quem saiu e ferramenta duplicada entre áreas.",
          },
        ],
      },
      {
        titulo: "Identidade e acesso",
        itens: [
          {
            nome: "IDaaS, identidade como serviço",
            texto:
              "Um cadastro central de quem é quem, que autentica a pessoa uma vez e libera o acesso conforme a política. Menos senha anotada e menos chamado de acesso.",
          },
          {
            nome: "Login único e múltiplo fator",
            texto:
              "Uma credencial para os sistemas da empresa, com segundo fator obrigatório. Revogar tudo em um desligamento passa a ser um clique.",
          },
        ],
      },
      {
        titulo: "Voz e atendimento",
        itens: [
          {
            nome: "PABX em nuvem",
            texto:
              "Central telefônica sem equipamento obsoleto, com filas, menu de atendimento, gravação e mobilidade. Seus números atuais são portados.",
          },
          {
            nome: "Contact center",
            texto:
              "Distribuição de chamadas, painel de fila e métrica por operador, para gerir atendimento com número em vez de impressão.",
          },
          {
            nome: "Recursos de IA na voz",
            texto:
              "A inteligência artificial lê os atendimentos e aponta reclamação recorrente, espera excessiva e chamada problemática, sem ninguém ouvir gravação por gravação.",
          },
        ],
      },
    ],
    solucao: {
      titulo: "O usuário no centro, com processo por trás",
      itens: [
        {
          titulo: "Service desk que responde em minutos",
          texto:
            "Primeira resposta em até 3 minutos, com gente que conhece a sua operação. Sem robô de triagem e sem repetir o problema para três atendentes.",
        },
        {
          titulo: "Parque inventariado e gerenciado",
          texto:
            "Cada equipamento com dono, garantia, ciclo de vida e configuração conhecida. Trocar uma máquina deixa de ser um projeto.",
        },
        {
          titulo: "Manutenção antes da falha",
          texto:
            "Disco que começa a falhar, memória saturada e atualização pendente aparecem no monitoramento antes de virarem chamado urgente.",
        },
        {
          titulo: "Entrada e saída com roteiro",
          texto:
            "Pessoa nova começa com acesso, e-mail e máquina prontos no primeiro dia. Pessoa que sai tem tudo revogado no mesmo dia, com registro.",
        },
        {
          titulo: "Identidade como serviço",
          texto:
            "Um login para tudo, com múltiplo fator e política central. Menos senha anotada, menos porta aberta e menos chamado de acesso.",
        },
        {
          titulo: "Telefonia que vira informação",
          texto:
            "Central em nuvem com filas, gravação e mobilidade, e IA que lê os atendimentos para apontar reclamação recorrente e espera excessiva.",
        },
      ],
    },
    entregaveis: [
      "Service desk com prazo de primeira resposta acordado",
      "Inventário completo do parque, com ciclo de vida por equipamento",
      "Rotina de manutenção preventiva e atualização",
      "Procedimento de entrada e desligamento com trilha de auditoria",
      "Gestão de identidade com múltiplo fator ativado",
      "Relatório de licenças SaaS contratadas contra licenças em uso",
    ],
    cta: {
      titulo: "Quantas horas o seu time perdeu esperando a TI neste mês?",
      texto:
        "Levantamos o volume de chamados, o tempo real de resposta e quanto do parque está fora de padrão. O retrato sai mesmo sem contratação.",
      botao: "Avaliar o meu suporte",
    },
    faq: [
      {
        pergunta: "A CORZ substitui meu time interno de TI?",
        resposta:
          "Não. Na maioria dos casos a CORZ assume a operação repetitiva, o suporte ao usuário e a relação com fornecedores, liberando o time interno para o que é específico do negócio. Boa parte dos nossos clientes tem equipe própria de TI.",
      },
      {
        pergunta: "O que é IDaaS?",
        resposta:
          "IDaaS é gestão de identidade como serviço: um cadastro central de quem é quem na empresa, que autentica a pessoa uma vez e libera o acesso aos sistemas conforme a política definida. É o que permite ativar múltiplo fator para todo mundo, revogar tudo de uma vez em um desligamento e saber quem entrou onde.",
      },
      {
        pergunta: "Vocês atendem usuário em outras cidades?",
        resposta:
          "Sim. O service desk é remoto e cobre a operação inteira, independentemente de onde a unidade fica. Atendimento presencial é acionado quando o problema é físico e existe cobertura em campo no Rio Grande do Sul.",
      },
      {
        pergunta: "Como funciona a gestão de licenças SaaS?",
        resposta:
          "Comparamos o que é pago com o que é efetivamente usado, mês a mês. As duas descobertas mais comuns são licença de pessoa desligada que segue ativa e ferramenta contratada por uma área que já existe em outro contrato da empresa.",
      },
      {
        pergunta: "O PABX em nuvem mantém os meus números atuais?",
        resposta:
          "Sim. Os números são portados para a central em nuvem e o cliente continua ligando para o mesmo telefone de sempre. A central passa a ter filas, gravação, mobilidade e análise de atendimento por IA.",
      },
    ],
    seo: {
      titulo: "Modern Workplace: service desk, endpoints e produtividade",
      descricao:
        "Service desk com resposta em minutos, gestão de endpoints e ativos, manutenção preventiva, e-mail e colaboração, IDaaS, licenças SaaS e PABX em nuvem com IA.",
      termos: [
        "modern workplace",
        "service desk terceirizado",
        "gestão de endpoints",
        "outsourcing de TI",
        "IDaaS gestão de identidade",
        "PABX em nuvem",
        "gestão de licenças SaaS",
      ],
    },
  },

  // ---------------------------------------------------------------- 04
  {
    slug: "ciberseguranca",
    indice: "04",
    nome: "Cibersegurança",
    menu: "Cibersegurança",
    escopo: "Proteger identidades, dispositivos, aplicações, dados e redes",
    icone: "seguranca",
    cor: "#E20D50",
    titulo: {
      antes: "Cada unidade é",
      destaque: "uma porta de entrada.",
      depois: "Não só a matriz.",
    },
    promessa:
      "Proteção aplicada onde o ataque realmente começa: na borda de cada unidade e no login de cada pessoa.",
    chamada:
      "Firewall gerenciado, EDR com vigilância 24×7, múltiplo fator, gestão de vulnerabilidades e um plano de resposta escrito antes do incidente.",
    respostaCurta:
      "A CORZ protege os cinco pontos por onde um ataque entra: rede, com NGFW gerenciado, SASE e Anti-DDoS; dispositivos, com EDR, XDR e monitoramento MDR 24×7; identidade, com MFA e ZTNA; pessoas, com proteção de e-mail e simulação de phishing; e o processo, com gestão de vulnerabilidades, pentest, adequação à LGPD e resposta a incidentes.",
    dor: {
      titulo: "A matriz está blindada. E as outras unidades?",
      texto:
        "É comum encontrar o firewall mais caro do contrato instalado na matriz enquanto cada unidade acessa a internet por um roteador de operadora com a senha de fábrica. O atacante não entra por onde é difícil. Entra por onde ninguém está olhando.",
    },
    riscos: [
      "Unidades conectadas à rede corporativa sem proteção de borda",
      "Antivírus comum onde já se exige detecção de comportamento",
      "Credenciais compartilhadas, sem múltiplo fator e sem expiração",
      "Ninguém olhando os alertas fora do horário comercial",
      "Vulnerabilidade conhecida e sem correção há meses",
      "Nenhum plano de resposta, então a primeira decisão é tomada no susto",
    ],
    consequencia:
      "Sua empresa sobreviveria a 48 horas sem acesso aos sistemas? Não é uma pergunta retórica: é o tempo médio que uma operação leva para voltar quando não havia plano. Nesse intervalo, a folha continua correndo e o faturamento não.",
    capacidades: [
      {
        titulo: "Proteção de rede",
        itens: [
          {
            nome: "NGFW gerenciado",
            texto:
              "Firewall de nova geração na borda de cada unidade, com a mesma política em todas e alguém responsável por mantê-la. Inspeciona o conteúdo do tráfego, não só a porta.",
          },
          {
            nome: "SASE",
            texto:
              "A proteção acompanha a pessoa em vez de morar no escritório. Quem trabalha de casa ou de outra unidade sai pela mesma política de segurança.",
          },
          {
            nome: "Anti-DDoS",
            texto:
              "Filtragem do ataque de volume antes de ele chegar ao seu link. Sem isso, derrubar a operação exige apenas tráfego suficiente.",
          },
        ],
      },
      {
        titulo: "Proteção de endpoints",
        itens: [
          {
            nome: "EDR",
            texto:
              "Observa o comportamento dentro da máquina e bloqueia o que foge do normal, inclusive ameaça que nenhum antivírus conhecia ainda.",
          },
          {
            nome: "XDR",
            texto:
              "Cruza o sinal do dispositivo com o da rede, do e-mail e da nuvem, e mostra o ataque inteiro em vez de um pedaço isolado dele.",
          },
          {
            nome: "MDR com monitoramento 24×7",
            texto:
              "Um time acompanhando esses alertas dia e noite. Ferramenta que ninguém olha fora do horário comercial só produz alerta, e o ataque costuma vir de madrugada.",
          },
        ],
      },
      {
        titulo: "Identidade e acesso",
        itens: [
          {
            nome: "MFA, múltiplo fator",
            texto:
              "Segundo fator obrigatório no login. É a única medida isolada que corta a maior parte dos ataques por credencial vazada.",
          },
          {
            nome: "Políticas de acesso",
            texto:
              "Cada pessoa enxerga o que a função exige, nem mais nem menos, com regra escrita e revisão periódica de quem tem acesso a quê.",
          },
          {
            nome: "ZTNA",
            texto:
              "Libera uma aplicação específica depois de verificar a pessoa e o estado do dispositivo. A VPN tradicional entrega a rede inteira; isto entrega uma sala.",
          },
          {
            nome: "Gestão de identidades",
            texto:
              "Um cadastro central de quem existe na empresa, ligado à entrada e à saída de pessoas, para não sobrar acesso órfão depois de um desligamento.",
          },
        ],
      },
      {
        titulo: "Segurança de e-mail e usuários",
        itens: [
          {
            nome: "Proteção de e-mail",
            texto:
              "Filtro contra phishing, anexo malicioso e fraude do boleto, com verificação de domínio para ninguém enviar mensagem se passando pela sua empresa.",
          },
          {
            nome: "Conscientização de usuários",
            texto:
              "Treinamento curto e periódico, no lugar de uma palestra anual que ninguém lembra. O usuário é a última barreira e a mais barata de reforçar.",
          },
          {
            nome: "Simulação de phishing",
            texto:
              "Campanhas controladas que medem quem clica, por área, e mostram se o treinamento está funcionando com número em vez de percepção.",
          },
        ],
      },
      {
        titulo: "Gestão de riscos",
        itens: [
          {
            nome: "Gestão de vulnerabilidades",
            texto:
              "Varredura contínua do parque, com as falhas priorizadas por impacto no negócio e janela de correção acordada, não uma lista de mil itens sem ordem.",
          },
          {
            nome: "Diagnóstico de exposição",
            texto:
              "O retrato do que está aberto hoje: unidade sem proteção de borda, credencial compartilhada, sistema sem backup testado e por onde um ataque caminharia.",
          },
          {
            nome: "Pentest",
            texto:
              "Teste de invasão conduzido para provar, na prática, o que é explorável. Serve para embasar decisão e atender exigência de cliente ou auditoria.",
          },
          {
            nome: "Adequação técnica à LGPD",
            texto:
              "Mapeamento de onde o dado pessoal trafega e fica, controles de acesso, registro de tratamento e evidência para responder a titular ou a auditoria.",
          },
        ],
      },
      {
        titulo: "Resposta a incidentes",
        itens: [
          {
            nome: "Resposta a incidentes",
            texto:
              "Contenção, preservação de evidência e comunicação seguindo um procedimento escrito antes. A decisão difícil não é inventada sob pressão.",
          },
          {
            nome: "Recuperação de ambientes",
            texto:
              "Retomada a partir do backup testado, com validação do que voltou e relatório do que permitiu o incidente, para não repetir pelo mesmo caminho.",
          },
        ],
      },
    ],
    solucao: {
      titulo: "Segurança medida em continuidade, não em especificação",
      itens: [
        {
          titulo: "Borda protegida em cada unidade",
          texto:
            "Firewall de nova geração gerenciado no ponto onde um ataque para tudo, que é a entrada de cada unidade, e não apenas a da matriz.",
        },
        {
          titulo: "EDR com quem olha 24 horas",
          texto:
            "Detecção por comportamento no dispositivo e um time acompanhando os alertas fora do horário comercial, que é quando o ataque costuma vir.",
        },
        {
          titulo: "Acesso por identidade, não por rede",
          texto:
            "Múltiplo fator para todo mundo e ZTNA no lugar da VPN aberta: quem entra vê apenas o que precisa, esteja onde estiver.",
        },
        {
          titulo: "O usuário treinado é a última barreira",
          texto:
            "Proteção de e-mail somada a simulações periódicas de phishing, com o resultado medido por área em vez de um treinamento anual esquecido.",
        },
        {
          titulo: "Vulnerabilidade com prazo de correção",
          texto:
            "Varredura contínua, priorização por impacto no negócio e janela de correção acordada. Pentest quando é preciso provar, não para assustar.",
        },
        {
          titulo: "Resposta escrita antes do incidente",
          texto:
            "Contenção, preservação de evidência, recuperação e comunicação já definidas. A decisão difícil não é tomada sob pressão.",
        },
      ],
    },
    entregaveis: [
      "Diagnóstico de exposição por unidade, priorizado por impacto",
      "Firewall e EDR implantados e gerenciados, com política padronizada",
      "Múltiplo fator ativado e acessos revisados",
      "Programa de conscientização com simulação de phishing medida",
      "Relatório de vulnerabilidades com prazo de correção acordado",
      "Plano de resposta a incidentes e trilha de auditoria",
    ],
    cta: {
      titulo: "Quanto custaria perder acesso aos seus dados por um dia?",
      texto:
        "Fazemos o diagnóstico de exposição da sua rede e entregamos a lista do que precisa ser resolvido, em ordem de impacto.",
      botao: "Diagnóstico de segurança",
    },
    faq: [
      {
        pergunta: "Antivírus e firewall não bastam?",
        resposta:
          "Não. Antivírus e firewall são controles, não uma estratégia. Sem segmentação de rede, múltiplo fator, detecção por comportamento no dispositivo, backup testado e um plano de resposta, um único clique em uma unidade ainda derruba a operação inteira.",
      },
      {
        pergunta: "Qual a diferença entre EDR, XDR e MDR?",
        resposta:
          "EDR observa o comportamento dentro do dispositivo e bloqueia o que foge do normal. XDR cruza esse sinal com o que acontece na rede, no e-mail e na nuvem, para enxergar o ataque inteiro em vez de um pedaço. MDR é o serviço: um time acompanhando esses alertas 24 horas por dia, porque ferramenta que ninguém olha só produz alerta.",
      },
      {
        pergunta: "O que é ZTNA e por que ele substitui a VPN?",
        resposta:
          "ZTNA libera acesso a uma aplicação específica depois de verificar quem é a pessoa e em que condição está o dispositivo. A VPN tradicional coloca a pessoa dentro da rede inteira: uma credencial vazada passa a enxergar tudo. É a diferença entre entregar a chave de uma sala e a chave do prédio.",
      },
      {
        pergunta: "A CORZ ajuda na adequação à LGPD?",
        resposta:
          "Sim, na camada técnica: mapeamento de onde os dados pessoais trafegam e ficam armazenados, controles de acesso, registro de tratamento e evidências para responder a um pedido de titular ou a uma auditoria. A parte jurídica permanece com o encarregado ou o escritório de dados da empresa.",
      },
      {
        pergunta: "Vocês atuam durante um incidente em andamento?",
        resposta:
          "Sim, para clientes com contrato de gestão. A resposta segue o procedimento definido previamente: contenção, preservação de evidências, recuperação a partir do backup testado e relatório do que permitiu o incidente.",
      },
    ],
    seo: {
      titulo: "Cibersegurança gerenciada para empresas com múltiplas unidades",
      descricao:
        "NGFW gerenciado, SASE, Anti-DDoS, EDR e XDR com MDR 24×7, MFA e ZTNA, proteção de e-mail, simulação de phishing, gestão de vulnerabilidades, pentest e resposta a incidentes.",
      termos: [
        "cibersegurança gerenciada",
        "firewall gerenciado NGFW",
        "EDR XDR MDR",
        "MFA e ZTNA",
        "gestão de vulnerabilidades",
        "pentest empresarial",
        "proteção contra ransomware",
        "LGPD infraestrutura",
      ],
    },
  },
];

export const porSlug = (slug: string) => solucoes.find((s) => s.slug === slug);

/**
 * As três camadas em que a CORZ atua.
 *
 * Não são pacotes fechados para escolher em um cardápio. São camadas de
 * profundidade da parceria, e é assim que a empresa se apresenta: a CORZ
 * não vende ferramenta pela ferramenta, vende continuidade operacional
 * através destes três planos de atuação.
 */
export type Pilar = {
  chave: string;
  nome: string;
  resumo: string;
  descricao: string;
  pergunta: string;
  itens: string[];
  cor: string;
};

export const pilares: Pilar[] = [
  {
    chave: "estrategica",
    nome: "TI Estratégica",
    resumo: "Para onde o negócio vai",
    descricao:
      "Entendemos para onde a empresa quer chegar e qual infraestrutura aguenta o peso desse crescimento. A conversa acontece antes da compra, não depois do gargalo.",
    pergunta:
      "Sua infraestrutura suporta o plano de expansão que já foi aprovado?",
    itens: [
      "Arquitetura dimensionada para o plano de crescimento",
      "Padrão replicável para abertura de novas unidades",
      "Revisão periódica de arquitetura com a liderança",
      "Orçamento de infraestrutura projetado, sem surpresa no meio do ano",
    ],
    cor: "#00ADE7",
  },
  {
    chave: "tatica",
    nome: "TI Tática",
    resumo: "Como as coisas são feitas",
    descricao:
      "Definimos as regras de governança. Quais procedimentos existem, quem tem acesso ao quê, o que acontece quando algo falha e quem responde por cada decisão.",
    pergunta:
      "Quem tem acesso aos seus sistemas hoje, e quem revogou o acesso do último desligamento?",
    itens: [
      "Políticas de acesso e governança documentadas",
      "Procedimentos de contingência definidos antes do incidente",
      "Padronização de configuração entre todas as unidades",
      "Trilha de auditoria de quem alterou o quê e quando",
    ],
    cor: "#3F39BD",
  },
  {
    chave: "operacional",
    nome: "TI Operacional",
    resumo: "O que acontece todo dia",
    descricao:
      "Monitoramento ativo, chamado aberto por nós junto ao fornecedor e disponibilidade acompanhada com número. É a camada que faz a operação simplesmente funcionar.",
    pergunta: "Quantas horas sua operação ficou fora no último mês?",
    itens: [
      "Monitoramento ativo com alerta no segundo da queda",
      "Abertura e cobrança de chamados junto a fornecedores",
      "Primeira resposta em até 3 minutos",
      "Relatório executivo de disponibilidade por unidade",
    ],
    cor: "#89E20D",
  },
];
