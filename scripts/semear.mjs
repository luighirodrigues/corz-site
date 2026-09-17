import { randomUUID } from "node:crypto";
import { hash } from "@node-rs/argon2";
import sanitizeHtml from "sanitize-html";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("ERRO: DATABASE_URL não está definida no ambiente.");
  process.exit(1);
}

const client = postgres(url, { max: 1 });

const CATEGORIAS = [
  {
    slug: "continuidade-operacional",
    nome: "Continuidade operacional",
    descricao:
      "Disponibilidade, redundância, contingência e o custo real de uma operação parada.",
    cor: "#00ADE7",
    ordem: 1,
  },
  {
    slug: "redes-corporativas",
    nome: "Redes corporativas",
    descricao:
      "Infraestrutura de rede para empresas com múltiplas unidades: projeto, padronização e expansão.",
    cor: "#3F39BD",
    ordem: 2,
  },
  {
    slug: "seguranca",
    nome: "Segurança",
    descricao:
      "Risco, exposição e resposta a incidentes sob a ótica do impacto no negócio.",
    cor: "#E20D50",
    ordem: 3,
  },
  {
    slug: "gestao-de-ti",
    nome: "Gestão de TI",
    descricao:
      "Custos, contratos, fornecedores e a relação entre telecom e tecnologia da informação.",
    cor: "#EBAD28",
    ordem: 4,
  },
];

const ARTIGOS = [
  {
    slug: "quanto-custa-uma-hora-de-operacao-parada",
    categoria: "continuidade-operacional",
    titulo: "Quanto custa uma hora de operação parada",
    subtitulo:
      "A conta que quase ninguém faz — e que muda toda decisão de infraestrutura quando aparece no papel.",
    resumo:
      "A maioria das empresas nunca calculou o próprio custo de parada. Sem esse número, todo investimento em redundância parece caro. Com ele, a conversa muda de lugar.",
    respostaCurta:
      "O custo de uma hora parada é o faturamento mensal dividido pelas horas de operação no mês. Para uma rede que fatura R$ 4 milhões operando 12 horas por dia em 26 dias, cada hora parada custa cerca de R$ 12.800 em receita não realizada — sem contar folha ociosa, retrabalho e cliente perdido.",
    destaque: true,
    faq: [
      {
        pergunta: "Como calcular o custo de uma hora parada?",
        resposta:
          "Divida o faturamento do mês pelo número de horas efetivamente operadas no período. Uma operação que fatura R$ 4 milhões em 26 dias de 12 horas trabalha 312 horas por mês, o que dá aproximadamente R$ 12.800 por hora. Esse é o piso: a conta ignora folha parada, retrabalho, multa contratual e cliente que não volta.",
      },
      {
        pergunta: "Redundância vale a pena para uma empresa média?",
        resposta:
          "A resposta depende da comparação entre o custo mensal da redundância e o custo de uma única parada por mês. Quando uma hora parada custa mais do que o link secundário custa no mês inteiro, a decisão deixa de ser financeira e passa a ser de gestão de risco.",
      },
    ],
    conteudo: `
<p>Existe uma pergunta que quase nenhuma diretoria consegue responder de imediato: quanto a empresa perde em uma hora de operação parada. Não é uma pergunta retórica. É o número que define se um investimento em redundância é caro ou barato.</p>

<h2>A conta mínima</h2>
<p>Comece pelo mais simples. Pegue o faturamento do último mês e divida pelo número de horas em que a operação efetivamente funcionou. Uma rede que fatura R$ 4 milhões, opera 26 dias por mês e 12 horas por dia trabalha 312 horas. Cada hora vale cerca de R$ 12.800.</p>
<p>Esse valor é o piso, não o teto. A conta ignora deliberadamente três coisas que também acontecem quando a operação para:</p>
<ul>
  <li>A folha continua correndo. Quinze pessoas paradas por quatro horas são sessenta horas pagas sem contrapartida.</li>
  <li>O retrabalho depois. Conferência de estoque, refaturamento, reprocessamento de pedidos.</li>
  <li>O cliente que foi embora. Esse não aparece em nenhuma linha do balanço — aparece no mês seguinte.</li>
</ul>

<h2>Por que o número muda a conversa</h2>
<p>Sem o custo de parada na mesa, toda discussão de infraestrutura vira comparação de preço entre fornecedores. Com o número, a pergunta muda: qual é o custo mensal de garantir que isso não aconteça, e ele é menor ou maior que o prejuízo de uma única ocorrência?</p>
<blockquote>Quando uma hora parada custa mais do que o link secundário custa no mês inteiro, a decisão deixa de ser financeira.</blockquote>
<p>É comum descobrir, nessa hora, que a empresa já pagou várias vezes o valor da solução — em prejuízos que ninguém somou porque estavam espalhados por meses diferentes.</p>

<h2>O que fazer com o número</h2>
<p>Três movimentos, nesta ordem:</p>
<ol>
  <li><strong>Medir a disponibilidade real.</strong> Quantas horas cada unidade ficou fora nos últimos doze meses? Se a resposta for uma estimativa, ela não serve. Sem monitoramento ativo, a empresa está adivinhando.</li>
  <li><strong>Classificar por criticidade.</strong> Nem toda unidade tem o mesmo peso. O centro de distribuição parado é diferente da loja de menor movimento parada.</li>
  <li><strong>Dimensionar a contingência.</strong> Redundância não é tudo ou nada. Existe uma escala entre não ter plano B e ter failover automático em todas as pontas.</li>
</ol>

<h2>O erro mais caro</h2>
<p>É tratar parada como acidente. Falha de link, equipamento queimado e erro de operadora não são eventos excepcionais — são estatística. Vão acontecer. A diferença entre uma empresa madura e uma empresa exposta não é a ausência de falhas: é quanto tempo a falha leva para virar prejuízo.</p>
<p>Quatro horas paradas e quatro minutos parados começam do mesmo jeito. O que muda é o que já estava preparado antes.</p>
`,
  },
  {
    slug: "rede-de-lojas-por-que-a-matriz-blindada-nao-basta",
    categoria: "seguranca",
    titulo: "Sua matriz está blindada. E as outras 39 unidades?",
    subtitulo:
      "O atacante não entra por onde é difícil. Entra por onde ninguém está olhando.",
    resumo:
      "É comum encontrar o firewall mais caro do contrato instalado na matriz, enquanto cada loja acessa a internet por um roteador de operadora com senha padrão. Essa assimetria é o problema.",
    respostaCurta:
      "Em redes com múltiplas unidades, a segurança costuma se concentrar na matriz enquanto as filiais ficam com equipamentos de operadora sem gestão. Como todas as unidades acessam os mesmos sistemas, a filial menos protegida define o nível de segurança do conjunto — não a matriz.",
    faq: [
      {
        pergunta: "Por que proteger cada unidade e não só a matriz?",
        resposta:
          "Porque todas as unidades acessam os mesmos sistemas centrais. Um dispositivo comprometido em uma loja tem, na prática, o mesmo caminho até o ERP que um dispositivo na matriz. O nível de segurança do conjunto é definido pela unidade menos protegida, não pela mais protegida.",
      },
      {
        pergunta: "O que é segmentação de rede em uma loja?",
        resposta:
          "É separar em redes independentes equipamentos que não deveriam se enxergar: PDV, câmeras, administrativo e Wi-Fi de visitante. Assim, um celular de cliente ou uma câmera com firmware desatualizado deixa de ser um caminho até o sistema que fatura.",
      },
    ],
    conteudo: `
<p>Em quase toda rede de lojas que auditamos, o desenho de segurança é o mesmo: a matriz tem firewall gerenciado, política de acesso e monitoramento. As unidades têm o roteador que a operadora deixou na instalação.</p>
<p>O problema não é a matriz estar bem protegida. É que a proteção parou nela.</p>

<h2>Todo mundo chega no mesmo lugar</h2>
<p>Cada unidade acessa o ERP, o sistema de faturamento e a base de clientes. São os mesmos sistemas centrais. Isso significa que um dispositivo comprometido na loja 23 tem essencialmente o mesmo caminho até o coração da operação que um dispositivo na matriz.</p>
<p>A conclusão é desconfortável: o nível de segurança da rede é definido pela unidade menos protegida. Não pela mais protegida.</p>

<h2>Onde o ataque entra de verdade</h2>
<p>Nos incidentes que acompanhamos, o ponto de entrada raramente é sofisticado:</p>
<ul>
  <li>Wi-Fi de visitante na mesma rede do PDV.</li>
  <li>Câmera de segurança com firmware de 2019 e senha de fábrica.</li>
  <li>Computador de escritório da loja com acesso administrativo e sem atualização.</li>
  <li>Credencial compartilhada por três pessoas, sendo que uma saiu da empresa no ano passado.</li>
</ul>
<p>Nenhum desses casos exige um atacante habilidoso. Exige apenas que ninguém esteja olhando.</p>

<h2>O que muda com proteção na borda de cada unidade</h2>
<h3>Segmentação</h3>
<p>PDV, câmeras, administrativo e Wi-Fi de cliente em redes isoladas. O cliente conectado nunca compartilha rede com o caixa. É a medida de maior impacto e a mais frequentemente ausente.</p>
<h3>Política padronizada</h3>
<p>A mesma regra vale para todas as unidades, com registro de quem alterou o quê. Sem isso, cada loja vira uma configuração única que ninguém consegue auditar.</p>
<h3>Gestão de credenciais</h3>
<p>Acesso nominal, cofre de senhas e revogação imediata no desligamento. Login compartilhado torna impossível responder à pergunta mais básica de um incidente: quem fez.</p>
<h3>Backup que já foi restaurado</h3>
<p>Backup que nunca foi testado não é backup — é esperança com custo mensal. O teste de restauração precisa ter data, responsável e tempo medido.</p>

<h2>A pergunta que orienta a decisão</h2>
<p>Não é "estamos seguros?". Nunca há resposta honesta para essa. A pergunta útil é: <strong>sua empresa sobreviveria a 48 horas sem acesso aos sistemas?</strong></p>
<p>Se a resposta demora, a resposta é não. E 48 horas é o tempo médio de retorno quando não havia plano — tempo em que a folha continua correndo e o faturamento não.</p>
`,
  },
  {
    slug: "crescer-sem-estrutura-o-gargalo-que-aparece-depois",
    categoria: "redes-corporativas",
    titulo: "Crescer sem estrutura: o gargalo que só aparece depois",
    subtitulo:
      "O problema nunca é abrir unidades. É abrir unidades mais rápido do que se consegue padronizar.",
    resumo:
      "Mais lojas, mais usuários, mais sistemas — e a mesma infraestrutura de cinco anos atrás segurando tudo. A consequência não aparece na inauguração; aparece no primeiro sábado de pico.",
    respostaCurta:
      "Empresas em expansão costumam replicar unidades sem replicar o padrão de infraestrutura, criando redes diferentes em cada ponto. O custo aparece depois, na forma de suporte que não escala, diagnóstico lento e paradas que ninguém consegue explicar. Padronizar antes de crescer é mais barato que corrigir depois.",
    faq: [
      {
        pergunta: "Qual o erro mais comum na expansão de uma rede de lojas?",
        resposta:
          "Tratar cada abertura como um projeto isolado, contratando fornecedor local e improvisando a rede na semana da inauguração. O resultado é um parque em que nenhuma unidade se parece com a outra, o que torna qualquer diagnóstico lento e qualquer padronização posterior cara.",
      },
      {
        pergunta: "Como padronizar a rede de várias unidades já existentes?",
        resposta:
          "Começando pelo levantamento do que existe hoje em cada ponto e definindo um padrão de referência. A migração é feita por onda, priorizando as unidades mais críticas ou mais problemáticas, sem parar a operação. O ganho aparece já na segunda ou terceira unidade convertida.",
      },
    ],
    conteudo: `
<p>Toda empresa em expansão vive a mesma cena. O plano de crescimento é aprovado, as unidades são abertas, o faturamento sobe. E, seis meses depois, o time de tecnologia está mais lento do que quando havia metade das lojas.</p>
<p>Ninguém errou. Só que crescimento de operação e crescimento de infraestrutura não acontecem no mesmo ritmo por acidente — acontecem juntos por projeto.</p>

<h2>Como o problema se instala</h2>
<p>A primeira unidade nova é montada às pressas, com um fornecedor local, porque a inauguração tem data. Funciona. A segunda repete o processo com outro fornecedor. A terceira é feita por alguém do time interno, do jeito que dava naquela semana.</p>
<p>Ao final de dez aberturas, existem dez redes diferentes. Nenhuma documentada. Cada problema vira investigação do zero.</p>

<h2>O sintoma que aparece primeiro</h2>
<p>O suporte deixa de escalar. Antes, quem resolvia um problema em uma loja resolvia em qualquer loja. Agora, cada chamado começa com uma pergunta: como essa unidade foi montada mesmo?</p>
<p>O tempo de diagnóstico cresce enquanto o tempo de solução permanece o mesmo. É por isso que a sensação é de que o time ficou mais lento — ele está gastando o tempo em descobrir, não em resolver.</p>

<h2>O que padronização significa na prática</h2>
<ul>
  <li><strong>Um desenho de referência.</strong> Mesma topologia, mesma segmentação, mesma nomenclatura em todas as unidades.</li>
  <li><strong>Configuração versionada.</strong> Trocar um equipamento é restaurar uma configuração conhecida, em minutos, e não reconstruir do zero.</li>
  <li><strong>Documentação viva.</strong> Topologia, IPs, VLANs e contratos registrados fora da cabeça de uma pessoa só.</li>
  <li><strong>Processo de abertura.</strong> Um roteiro com prazo, para que a unidade nova não dependa de improviso na véspera.</li>
</ul>

<h2>Não é preciso parar para arrumar</h2>
<p>A objeção mais comum é que padronizar exigiria parar a operação. Não exige. A conversão é feita por onda, começando pelas unidades mais críticas ou mais problemáticas, uma de cada vez, em janela combinada.</p>
<p>O ganho aparece cedo: já na segunda ou terceira unidade convertida, o tempo de diagnóstico cai visivelmente, porque o time volta a reconhecer o que está vendo.</p>

<h2>A pergunta para a próxima reunião de expansão</h2>
<p>Quando o plano de abrir mais unidades for apresentado, vale colocar uma pergunta ao lado da meta de faturamento: <strong>a infraestrutura suporta isso?</strong></p>
<p>É uma pergunta barata de responder antes e cara de responder depois.</p>
`,
  },
];

async function principal() {
  console.log("\n  Semeando conteúdo inicial…\n");

  let [autor] = await client`
    SELECT id FROM "usuarios" WHERE email = 'redacao@corz.com.br' LIMIT 1;
  `;

  if (!autor) {
    const senha = "trocar-esta-senha-" + Date.now().toString(36);
    const senhaHash = await hash(senha, {
      memoryCost: 19_456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
    const autorId = randomUUID();
    [autor] = await client`
      INSERT INTO "usuarios" (id, nome, email, senha_hash, papel, cargo, bio, ativo)
      VALUES (${autorId}, 'Redação CORZ', 'redacao@corz.com.br', ${senhaHash}, 'EDITOR', 'Equipe editorial', 'Conteúdo produzido pelo time técnico da CORZ a partir de casos reais de operação.', false)
      RETURNING id;
    `;
    console.log("  · conta editorial criada (inativa para login)");
  }

  const mapaCategorias = new Map();

  for (const cat of CATEGORIAS) {
    let [existente] = await client`
      SELECT id FROM "categorias" WHERE slug = ${cat.slug} LIMIT 1;
    `;

    if (existente) {
      mapaCategorias.set(cat.slug, existente.id);
      continue;
    }

    const catId = randomUUID();
    const [nova] = await client`
      INSERT INTO "categorias" (id, slug, nome, descricao, cor, ordem)
      VALUES (${catId}, ${cat.slug}, ${cat.nome}, ${cat.descricao}, ${cat.cor}, ${cat.ordem})
      RETURNING id;
    `;
    mapaCategorias.set(cat.slug, nova.id);
    console.log(`  · categoria "${cat.nome}"`);
  }

  for (const artigo of ARTIGOS) {
    const [existente] = await client`
      SELECT id FROM "artigos" WHERE slug = ${artigo.slug} LIMIT 1;
    `;

    if (existente) {
      console.log(`  · artigo "${artigo.titulo}" já existe`);
      continue;
    }

    const conteudo = artigo.conteudo.trim();
    const textoPuro = sanitizeHtml(conteudo, {
      allowedTags: [],
      allowedAttributes: {},
    })
      .replace(/\s+/g, " ")
      .trim();

    const artigoId = randomUUID();
    const tempoLeitura = Math.max(1, Math.round(textoPuro.split(/\s+/).length / 200));
    const categoriaId = mapaCategorias.get(artigo.categoria) ?? null;
    const faqJson = JSON.stringify(artigo.faq);

    await client`
      INSERT INTO "artigos" (
        id, slug, titulo, subtitulo, resumo, conteudo, texto_puro,
        resposta_curta, status, publicado_em, destaque, tempo_leitura,
        categoria_id, autor_id, faq
      ) VALUES (
        ${artigoId}, ${artigo.slug}, ${artigo.titulo}, ${artigo.subtitulo},
        ${artigo.resumo}, ${conteudo}, ${textoPuro}, ${artigo.respostaCurta},
        'PUBLICADO', now(), ${artigo.destaque ?? false}, ${tempoLeitura},
        ${categoriaId}, ${autor.id}, ${faqJson}::jsonb
      );
    `;

    console.log(`  · artigo "${artigo.titulo}"`);
  }

  console.log("\n  Pronto! Banco semeado com sucesso.\n");
}

principal()
  .then(async () => {
    await client.end();
    process.exit(0);
  })
  .catch(async (erro) => {
    console.error("Erro na semeadura:", erro);
    await client.end();
    process.exit(1);
  });
