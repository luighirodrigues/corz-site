import type { Metadata } from "next";
import Heroi from "@/components/inicio/Heroi";
import Cadeia from "@/components/inicio/Cadeia";
import CustoParada from "@/components/inicio/CustoParada";
import QuatroPerguntas from "@/components/inicio/QuatroPerguntas";
import CamadasTI from "@/components/inicio/CamadasTI";
import GradeSolucoes from "@/components/inicio/GradeSolucoes";
import Confianca from "@/components/inicio/Confianca";
import Perguntas from "@/components/blocos/Perguntas";
import ChamadaFinal from "@/components/blocos/ChamadaFinal";
import {
  metadados,
  DadosEstruturados,
  grafo,
  pagina,
  perguntas,
  NOME_DO_SITE,
} from "@/lib/seo";

/**
 * Reconstrói uma vez por dia.
 *
 * A página mostra os anos de operação, que viram sozinhos em março.
 * Estática para sempre, o número ficaria preso na data da compilação e
 * só mudaria numa nova publicação.
 */
export const revalidate = 86400;

export const metadata: Metadata = metadados({
  /* O título da home é o nome do site inteiro: é este texto que vira o
     link azul no resultado de busca da marca, e é dele que o Google
     costuma tirar o nome exibido acima do resultado. */
  titulo: NOME_DO_SITE,
  absoluto: true,
  descricao:
    "A CORZ mantém no ar a operação de empresas com múltiplas unidades: conectividade e redes, cloud e datacenter, modern workplace e cibersegurança, monitorados 24 horas por dia. Desde 2012, em Pelotas/RS.",
  caminho: "/",
});

const FAQ = [
  {
    pergunta: "O que exatamente a CORZ faz?",
    resposta:
      "A CORZ responde pela continuidade operacional de empresas com múltiplas unidades, em quatro frentes: Conectividade e Redes, que liga cada ponto e mantém o link no ar; Cloud e Datacenter, que hospeda os ambientes e garante a volta quando algo falha; Modern Workplace, que sustenta o dia a dia de quem usa a tecnologia; e Cibersegurança, que protege as três. Não vendemos internet nem equipamento: respondemos pelo fato de a operação continuar funcionando.",
  },
  {
    pergunta: "A CORZ atende empresas fora do Rio Grande do Sul?",
    resposta:
      "Sim. O centro de operações fica em Pelotas/RS, mas o monitoramento, a gestão de chamados e a operação da infraestrutura são remotos. Atendemos redes com unidades distribuídas por vários estados.",
  },
  {
    pergunta: "Preciso substituir minha equipe de TI para contratar a CORZ?",
    resposta:
      "Não. Na maioria dos casos a CORZ trabalha junto com o time interno, assumindo a camada de infraestrutura e a relação com operadoras e fornecedores. Isso libera a equipe interna para o que é específico do negócio, em vez de passar o dia apagando incêndio.",
  },
  {
    pergunta: "Qual o porte de empresa que a CORZ atende?",
    resposta:
      "Empresas cuja operação para quando a tecnologia para: negócios com múltiplas unidades, centros de distribuição, indústrias, prestadores de serviço e instituições de ensino. O critério não é faturamento, é dependência: se uma hora parada gera prejuízo relevante, o modelo faz sentido.",
  },
  {
    pergunta: "Como começa o trabalho com a CORZ?",
    resposta:
      "Pelo diagnóstico. Levantamos os circuitos, contratos e custos de cada unidade, medimos a disponibilidade real do último período e mapeamos onde a operação está exposta. O resultado é entregue mesmo que não haja contratação.",
  },
  {
    pergunta: "Em quanto tempo a CORZ responde a um chamado?",
    resposta:
      "A primeira resposta acontece em até 3 minutos, para qualquer cliente. Não existe fila preferencial na CORZ: o que define a ordem é a gravidade do impacto na operação, nunca o tamanho do contrato.",
  },
];

export default function PaginaInicial() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "CORZ Tecnologia, continuidade operacional",
            descricao:
              "Conectividade e Redes, Cloud e Datacenter, Modern Workplace e Cibersegurança para empresas com múltiplas unidades.",
            caminho: "/",
          }),
          perguntas(FAQ)
        )}
      />

      <Heroi />
      <GradeSolucoes />
      <Confianca />
      <Cadeia />
      <CustoParada />
      <QuatroPerguntas />
      <CamadasTI />
      <Perguntas itens={FAQ} />
      <ChamadaFinal
        titulo="Você sabe quantas horas sua operação parou"
        destaque="no último mês?"
        texto="Se a resposta demora, a resposta é não. O diagnóstico da CORZ devolve a disponibilidade real de cada unidade, os custos de telecom que estão fora do contrato e o mapa do que hoje está exposto."
      />
    </>
  );
}
