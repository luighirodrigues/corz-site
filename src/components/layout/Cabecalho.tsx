"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { clsx } from "clsx";
import Logo from "@/components/marca/Logo";
import { navegacao, site } from "@/conteudo/site";
import { visiveis } from "@/lib/visibilidade";

export default function Cabecalho() {
  const caminho = usePathname();
  const [rolado, setRolado] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [submenu, setSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const aoRolar = () => setRolado(window.scrollY > 24);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  /**
   * Fecha o menu quando a rota muda. Ajustar estado durante a
   * renderização é o padrão recomendado pelo React para reagir a uma
   * mudança de entrada — um efeito aqui provocaria uma renderização
   * extra e um piscar do painel aberto na página nova.
   */
  const [caminhoAnterior, setCaminhoAnterior] = useState(caminho);
  if (caminho !== caminhoAnterior) {
    setCaminhoAnterior(caminho);
    setAberto(false);
    setSubmenu(null);
  }

  useEffect(() => {
    document.body.style.overflow = aberto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [aberto]);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-[10px] focus:bg-tinta-950 focus:px-4 focus:py-2 focus:text-branco"
      >
        Ir para o conteúdo
      </a>

      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-[100] transition-colors duration-500 ease-[var(--ease-corz)]",
          rolado || aberto
            ? "border-b border-branco/10 bg-tinta-950/92 backdrop-blur-xl"
            : "border-b border-transparent"
        )}
      >
        <div className="mx-auto flex h-[var(--altura-cabecalho)] w-full max-w-[84rem] items-center gap-8 px-5 sm:px-8">
          <Link
            href="/"
            aria-label="CORZ, página inicial"
            className="shrink-0"
            data-cursor="acao"
          >
            <Logo className="h-7" />
          </Link>

          <nav
            aria-label="Principal"
            className="ml-auto hidden items-center gap-1 lg:flex"
            onMouseLeave={() => setSubmenu(null)}
          >
            {visiveis(navegacao).map((item) => {
              const ativo =
                caminho === item.href || caminho.startsWith(item.href + "/");
              // `visiveis` precisa correr também nos filhos: filtrar só o
              // item de topo deixaria a rota oculta aparecendo dentro do
              // menu suspenso e do menu do celular.
              const filhos = item.filhos ? visiveis(item.filhos) : [];
              const temFilhos = filhos.length > 0;

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => setSubmenu(temFilhos ? item.href : null)}
                >
                  <Link
                    href={item.href}
                    className={clsx(
                      "relative flex items-center gap-1.5 px-3.5 py-2 text-[0.875rem] font-medium tracking-[-0.01em] transition-colors duration-200",
                      ativo ? "text-branco" : "text-branco/62 hover:text-branco"
                    )}
                    aria-expanded={temFilhos ? submenu === item.href : undefined}
                  >
                    {item.rotulo}
                    {temFilhos && (
                      <svg
                        aria-hidden
                        viewBox="0 0 10 10"
                        className={clsx(
                          "h-2 w-2 transition-transform duration-300",
                          submenu === item.href && "rotate-180"
                        )}
                      >
                        <path
                          d="M2 4l3 3 3-3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                        />
                      </svg>
                    )}
                    <span
                      aria-hidden
                      className={clsx(
                        "absolute inset-x-3.5 -bottom-px h-px origin-left bg-ciano transition-transform duration-400 ease-[var(--ease-corz)]",
                        ativo ? "scale-x-100" : "scale-x-0"
                      )}
                    />
                  </Link>

                  {temFilhos && (
                    <div
                      className={clsx(
                        "absolute left-0 top-full w-[19rem] origin-top-left pt-3 transition-all duration-300 ease-[var(--ease-corz)]",
                        submenu === item.href
                          ? "pointer-events-auto opacity-100 translate-y-0"
                          : "pointer-events-none opacity-0 -translate-y-1"
                      )}
                    >
                      <div className="overflow-hidden border border-branco/12 bg-tinta-900">
                        {filhos.map((filho, i) => (
                          <Link
                            key={filho.href}
                            href={filho.href}
                            className={clsx(
                              "flex items-center gap-3 px-4 py-3 text-[0.875rem] text-branco/70 transition-colors duration-200 hover:bg-branco/[0.04] hover:text-branco",
                              i > 0 && "border-t border-branco/8"
                            )}
                          >
                            <span className="text-[0.6875rem] font-semibold opacity-35 tabular-nums">
                              {String(i + 1).padStart(2, "0")}
                            </span>
                            {filho.rotulo}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3 lg:ml-4">
            <Link
              href="/contato"
              className="hidden rounded-[10px] bg-[#1D4FD8] px-5 py-2.5 text-[0.875rem] font-semibold text-branco transition-colors duration-300 hover:bg-[#153bab] sm:inline-flex"
              data-cursor="acao"
            >
              Diagnóstico gratuito
            </Link>

            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-label={aberto ? "Fechar menu" : "Abrir menu"}
              aria-expanded={aberto}
              className="flex h-10 w-10 items-center justify-center lg:hidden"
              data-cursor="acao"
            >
              <span className="relative block h-3.5 w-5">
                <span
                  className={clsx(
                    "absolute left-0 h-px w-full bg-branco transition-all duration-400 ease-[var(--ease-corz)]",
                    aberto ? "top-1.5 rotate-45" : "top-0"
                  )}
                />
                <span
                  className={clsx(
                    "absolute left-0 top-1.5 h-px w-full bg-branco transition-opacity duration-200",
                    aberto && "opacity-0"
                  )}
                />
                <span
                  className={clsx(
                    "absolute left-0 h-px w-full bg-branco transition-all duration-400 ease-[var(--ease-corz)]",
                    aberto ? "top-1.5 -rotate-45" : "top-3"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Painel móvel */}
      <div
        className={clsx(
          "fixed inset-0 z-[99] bg-tinta-950 lg:hidden",
          "transition-[opacity,visibility] duration-400 ease-[var(--ease-corz)]",
          aberto ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <div className="h-full overflow-y-auto px-5 pb-16 pt-[calc(var(--altura-cabecalho)+1.5rem)]">
          <nav aria-label="Menu móvel" className="flex flex-col">
            {visiveis(navegacao).map((item, i) => {
              // `visiveis` precisa correr também nos filhos: filtrar só o
              // item de topo deixaria a rota oculta aparecendo dentro do
              // menu suspenso e do menu do celular.
              const filhos = item.filhos ? visiveis(item.filhos) : [];
              const temFilhos = filhos.length > 0;
              return (
                <div key={item.href} className="border-b border-branco/10">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className="flex-1 py-4 font-display text-[1.5rem] font-semibold tracking-[-0.03em] text-branco"
                    >
                      <span className="mr-3 text-[0.6875rem] font-semibold opacity-30">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.rotulo}
                    </Link>
                    {temFilhos && (
                      <button
                        type="button"
                        onClick={() =>
                          setSubmenu(submenu === item.href ? null : item.href)
                        }
                        aria-label={`Abrir subitens de ${item.rotulo}`}
                        className="p-3"
                      >
                        <svg
                          viewBox="0 0 12 12"
                          className={clsx(
                            "h-3 w-3 text-branco/60 transition-transform duration-300",
                            submenu === item.href && "rotate-45"
                          )}
                        >
                          <path
                            d="M6 1v10M1 6h10"
                            stroke="currentColor"
                            strokeWidth="1.2"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                  {temFilhos && (
                    <div
                      className={clsx(
                        "grid transition-[grid-template-rows] duration-400 ease-[var(--ease-corz)]",
                        submenu === item.href
                          ? "grid-rows-[1fr]"
                          : "grid-rows-[0fr]"
                      )}
                    >
                      <div className="overflow-hidden">
                        <div className="pb-4 pl-8">
                          {filhos.map((filho) => (
                            <Link
                              key={filho.href}
                              href={filho.href}
                              className="block py-2 text-[0.9375rem] text-branco/60"
                            >
                              {filho.rotulo}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-10 space-y-3">
            <Link
              href="/contato"
              className="flex items-center justify-center rounded-[10px] bg-[#1D4FD8] px-5 py-4 font-semibold text-branco"
            >
              Diagnóstico gratuito
            </Link>
            <a
              href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-[10px] border border-branco/25 px-5 py-4 font-semibold text-branco"
            >
              Falar no WhatsApp
            </a>
          </div>

          <p className="mt-10 text-[0.8125rem] leading-relaxed text-branco/45">
            {site.endereco.logradouro} · {site.endereco.bairro}
            <br />
            {site.endereco.cidade}/{site.endereco.uf} · {site.telefone}
          </p>
        </div>
      </div>
    </>
  );
}
