import type { Metadata } from "next";
import DocumentoLegal from "@/components/blocos/DocumentoLegal";
import { metadados, DadosEstruturados, grafo, pagina, trilha } from "@/lib/seo";

export const metadata: Metadata = metadados({
  titulo: "Política de Cookies",
  descricao:
    "Quais cookies o site da CORZ utiliza, para que servem e como você pode controlá-los no navegador.",
  caminho: "/legal/cookies",
});

const ATUALIZADO = "17 de agosto de 2026";

const SECOES = [
  {
    id: "o-que-sao",
    titulo: "O que são cookies",
    paragrafos: [
      "Cookies são pequenos arquivos de texto gravados pelo navegador quando você visita um site. Servem para lembrar preferências, manter uma sessão autenticada e, em alguns casos, medir o uso das páginas.",
      "Este site foi construído para funcionar com o mínimo possível deles. Não usamos cookies de publicidade, não fazemos rastreamento entre sites e não vendemos dados de navegação.",
    ],
  },
  {
    id: "quais-usamos",
    titulo: "Quais cookies utilizamos",
    paragrafos: [
      "Estritamente necessários, sempre ativos, pois sem eles o site não funciona:",
      [
        "corz_sessao: mantém a sessão autenticada na área administrativa. Cookie de sessão, marcado como HttpOnly, Secure e SameSite=Lax. Expira em 8 horas de inatividade ou no logout.",
        "corz_csrf: token que impede requisições forjadas a partir de outros sites em formulários administrativos. Expira junto com a sessão.",
      ],
      "Preferência: só são gravados se você interagir com o recurso correspondente:",
      [
        "corz_cookies: registra a sua escolha nesta política, para não perguntarmos novamente. Validade de 12 meses.",
      ],
      "Medição: opcionais, ativados apenas mediante consentimento:",
      [
        "Cookies de ferramenta de análise de audiência, utilizados de forma agregada para entender quais conteúdos são mais úteis. Nunca associados a nome, e-mail ou telefone.",
      ],
    ],
  },
  {
    id: "sem-consentimento",
    titulo: "O que fazemos sem cookie nenhum",
    paragrafos: [
      "Navegar pelas páginas institucionais, ler o blog, usar a calculadora de custo de parada e enviar um formulário não exigem cookie de medição. As fontes tipográficas são servidas pelo nosso próprio domínio, sem requisição a servidores de terceiros.",
      "Registramos o endereço IP no momento do envio de um formulário por motivo de segurança e prevenção a abuso. Isso não é feito por cookie e está descrito na Política de Privacidade.",
    ],
  },
  {
    id: "como-controlar",
    titulo: "Como controlar cookies",
    paragrafos: [
      "Você pode revisar sua escolha a qualquer momento pelo aviso de cookies no rodapé do site, ou configurar diretamente o navegador:",
      [
        "Google Chrome: Configurações → Privacidade e segurança → Cookies e outros dados do site.",
        "Mozilla Firefox: Configurações → Privacidade e Segurança → Cookies e dados de sites.",
        "Safari: Preferências → Privacidade → Gerenciar dados de sites.",
        "Microsoft Edge: Configurações → Cookies e permissões do site.",
      ],
      "Bloquear cookies estritamente necessários impede o funcionamento da área administrativa, mas não afeta a navegação pelas páginas públicas.",
    ],
  },
  {
    id: "atualizacoes",
    titulo: "Atualizações",
    paragrafos: [
      `Sempre que incluirmos ou removermos um cookie, esta página é atualizada. Versão vigente desde ${ATUALIZADO}. A lista acima é a relação completa e atual. Se você identificar um cookie não descrito aqui, avise-nos.`,
    ],
  },
];

export default function PaginaCookies() {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          pagina({
            nome: "Política de Cookies: CORZ",
            descricao: "Cookies utilizados pelo site da CORZ Tecnologia.",
            caminho: "/legal/cookies",
          }),
          trilha([
            { nome: "Início", caminho: "/" },
            { nome: "Políticas", caminho: "/legal" },
            { nome: "Política de Cookies", caminho: "/legal/cookies" },
          ])
        )}
      />
      <DocumentoLegal
        rotulo="Política de Cookies"
        titulo="Poucos cookies,"
        destaque="todos explicados."
        resumo="Este site usa o mínimo necessário para funcionar e nada para publicidade. Abaixo está a lista completa, com nome, finalidade e prazo de cada um."
        atualizadoEm={ATUALIZADO}
        caminho="/legal/cookies"
        secoes={SECOES}
      />
    </>
  );
}
