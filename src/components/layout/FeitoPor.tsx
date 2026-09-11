import Image from "next/image";
import mancheBranco from "../../../public/marca/manche-branco.png";

/**
 * Assinatura de quem fez.
 *
 * Fica numa faixa própria abaixo do rodapé, separada por um fio: é
 * crédito de autoria, não item de navegação da CORZ, e misturar as duas
 * coisas confunde as duas.
 *
 * A palavra "Manche" é a própria marca, então o texto acessível vem do
 * `alt` da imagem. Para quem usa leitor de tela, o link inteiro é lido
 * como "Feito por Manche", que é exatamente o que está escrito.
 *
 * `rel="noopener"` porque abre em nova aba, e sem `nofollow` de
 * propósito: é um crédito legítimo entre duas empresas reais.
 */
export default function FeitoPor() {
  return (
    /* Acima da bruma inferior (z-80). Esta é a única faixa do site que
       fica permanentemente dentro dela, e desfocar justamente o crédito
       de autoria seria o contrário do que ele existe para fazer. */
    <div className="sup-escura relative z-[81] border-t border-branco/10 bg-tinta-950">
      <div className="mx-auto flex w-full max-w-[84rem] items-center justify-center px-5 py-7 sm:px-8">
        <a
          href="https://manche.ac"
          target="_blank"
          rel="noopener"
          data-cursor="externo"
          className="group inline-flex items-center gap-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-branco/55 transition-colors duration-300 hover:text-branco/85"
        >
          <span>Feito por</span>
          <Image
            src={mancheBranco}
            alt="Manche"
            className="h-[1.125rem] w-auto opacity-75 transition-opacity duration-300 group-hover:opacity-100"
            sizes="140px"
          />
        </a>
      </div>
    </div>
  );
}
