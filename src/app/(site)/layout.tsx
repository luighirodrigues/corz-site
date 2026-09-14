import Cabecalho from "@/components/layout/Cabecalho";
import Rodape from "@/components/layout/Rodape";
import FeitoPor from "@/components/layout/FeitoPor";
import CursorCorz from "@/components/sistema/CursorCorz";
import RolagemSuave from "@/components/sistema/RolagemSuave";
import BarraProgresso from "@/components/sistema/BarraProgresso";
import BotaoWhatsApp from "@/components/sistema/BotaoWhatsApp";
import BrumaInferior from "@/components/sistema/BrumaInferior";
import Medicao from "@/components/sistema/Medicao";
import AvisoCookies from "@/components/sistema/AvisoCookies";
import {
  DadosEstruturados,
  grafo,
  organizacao,
  siteWeb,
  navegacaoPrincipal,
} from "@/lib/seo";
import { solucoes } from "@/conteudo/solucoes";

export default function LayoutSite({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DadosEstruturados
        dados={grafo(
          organizacao(),
          siteWeb(),
          /* Contato primeiro: quem digita "CORZ" no Google quase sempre
             quer falar com a CORZ, não ler sobre ela. Depois as quatro
             frentes, na mesma ordem do menu. */
          navegacaoPrincipal([
            { nome: "Contato", caminho: "/contato" },
            ...solucoes.map((s) => ({
              nome: s.nome,
              caminho: `/solucoes/${s.slug}`,
            })),
            { nome: "Suporte", caminho: "/suporte" },
            { nome: "Sobre a CORZ", caminho: "/sobre" },
          ])
        )}
      />
      <RolagemSuave />
      <CursorCorz />
      <BarraProgresso />
      <Cabecalho />
      <main id="conteudo">{children}</main>
      <Rodape />
      <FeitoPor />
      <BrumaInferior />
      <BotaoWhatsApp />
      <AvisoCookies />
      <Medicao />
    </>
  );
}
