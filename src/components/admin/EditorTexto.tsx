"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { clsx } from "clsx";

/**
 * Editor de texto do painel.
 *
 * Escolha deliberada de um contentEditable enxuto em vez de uma
 * biblioteca de edição: quem vai usar isto escreve artigo, não monta
 * layout. O conjunto de formatos é curto de propósito — título 2 e 3,
 * negrito, itálico, listas, citação, link, imagem e linha. Menos botão
 * significa artigo mais consistente e menos HTML estranho para limpar.
 *
 * Toda saída passa por sanitização no servidor antes de ser gravada;
 * nada aqui é fonte de verdade de segurança.
 */

type Comando =
  | { tipo: "formato"; valor: string }
  | { tipo: "estilo"; valor: string }
  | { tipo: "lista"; valor: "insertUnorderedList" | "insertOrderedList" }
  | { tipo: "link" }
  | { tipo: "imagem" }
  | { tipo: "linha" }
  | { tipo: "limpar" };

const BOTOES: {
  rotulo: string;
  titulo: string;
  comando: Comando;
  atalho?: string;
}[] = [
  { rotulo: "H2", titulo: "Título de seção", comando: { tipo: "formato", valor: "h2" } },
  { rotulo: "H3", titulo: "Subtítulo", comando: { tipo: "formato", valor: "h3" } },
  { rotulo: "¶", titulo: "Parágrafo", comando: { tipo: "formato", valor: "p" } },
  { rotulo: "B", titulo: "Negrito", comando: { tipo: "estilo", valor: "bold" }, atalho: "⌘B" },
  { rotulo: "I", titulo: "Itálico", comando: { tipo: "estilo", valor: "italic" }, atalho: "⌘I" },
  { rotulo: "•", titulo: "Lista", comando: { tipo: "lista", valor: "insertUnorderedList" } },
  { rotulo: "1.", titulo: "Lista numerada", comando: { tipo: "lista", valor: "insertOrderedList" } },
  { rotulo: "❝", titulo: "Citação", comando: { tipo: "formato", valor: "blockquote" } },
  { rotulo: "🔗", titulo: "Link", comando: { tipo: "link" }, atalho: "⌘K" },
  { rotulo: "▭", titulo: "Imagem", comando: { tipo: "imagem" } },
  { rotulo: "—", titulo: "Linha divisória", comando: { tipo: "linha" } },
  { rotulo: "⌫", titulo: "Limpar formatação", comando: { tipo: "limpar" } },
];

export default function EditorTexto({
  valorInicial,
  aoMudar,
}: {
  valorInicial: string;
  aoMudar: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [contagem, setContagem] = useState({ palavras: 0, minutos: 1 });

  const recalcular = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const texto = el.innerText.replace(/\s+/g, " ").trim();
    const palavras = texto ? texto.split(" ").length : 0;
    setContagem({ palavras, minutos: Math.max(1, Math.round(palavras / 200)) });
    aoMudar(el.innerHTML);
  }, [aoMudar]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.innerHTML = valorInicial || "<p><br></p>";
    recalcular();
    // Executa só na montagem: reescrever o innerHTML a cada tecla
    // destruiria a posição do cursor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function executar(comando: Comando) {
    const el = ref.current;
    if (!el) return;
    el.focus();

    switch (comando.tipo) {
      case "formato":
        document.execCommand("formatBlock", false, comando.valor);
        break;
      case "estilo":
        document.execCommand(comando.valor);
        break;
      case "lista":
        document.execCommand(comando.valor);
        break;
      case "link": {
        const selecao = window.getSelection()?.toString();
        const url = window.prompt(
          "Endereço do link (comece com https://)",
          "https://"
        );
        if (!url) break;
        if (!/^(https:\/\/|mailto:|tel:|\/)/i.test(url)) {
          window.alert("Use um endereço https://, mailto:, tel: ou interno (/).");
          break;
        }
        if (!selecao) {
          document.execCommand(
            "insertHTML",
            false,
            `<a href="${escapar(url)}">${escapar(url)}</a>`
          );
        } else {
          document.execCommand("createLink", false, url);
        }
        break;
      }
      case "imagem": {
        const url = window.prompt("Endereço da imagem (https://)", "https://");
        if (!url || !/^https:\/\//i.test(url)) break;
        const alt = window.prompt("Descrição da imagem (texto alternativo)", "") ?? "";
        document.execCommand(
          "insertHTML",
          false,
          `<figure><img src="${escapar(url)}" alt="${escapar(alt)}"><figcaption>${escapar(alt)}</figcaption></figure><p><br></p>`
        );
        break;
      }
      case "linha":
        document.execCommand("insertHTML", false, "<hr><p><br></p>");
        break;
      case "limpar":
        document.execCommand("removeFormat");
        document.execCommand("formatBlock", false, "p");
        break;
    }
    recalcular();
  }

  /** Colar sempre como texto puro: mata o HTML sujo vindo de Word e Docs. */
  function aoColar(evento: React.ClipboardEvent) {
    evento.preventDefault();
    const texto = evento.clipboardData.getData("text/plain");
    const linhas = texto.split(/\n{2,}/).filter(Boolean);
    const html = linhas.map((l) => `<p>${escapar(l.trim())}</p>`).join("");
    document.execCommand("insertHTML", false, html || escapar(texto));
    recalcular();
  }

  function aoTeclar(evento: React.KeyboardEvent) {
    if (!(evento.metaKey || evento.ctrlKey)) return;
    if (evento.key.toLowerCase() === "k") {
      evento.preventDefault();
      executar({ tipo: "link" });
    }
  }

  return (
    <div className="overflow-hidden rounded-[10px] border border-petroleo/16 bg-branco">
      <div className="flex flex-wrap items-center gap-1 border-b border-petroleo/14 bg-papel-050 px-2 py-2">
        {BOTOES.map((botao) => (
          <button
            key={botao.rotulo}
            type="button"
            title={botao.atalho ? `${botao.titulo} (${botao.atalho})` : botao.titulo}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => executar(botao.comando)}
            className={clsx(
              "min-w-8 rounded-[6px] px-2.5 py-1.5 text-[0.8125rem] font-semibold",
              "text-tinta-900/70 transition-colors duration-150",
              "hover:bg-petroleo/10 hover:text-tinta-900"
            )}
          >
            {botao.rotulo}
          </button>
        ))}

        <span className="ml-auto pr-2 font-mono text-[0.625rem] tracking-[0.06em] text-tinta-900/40">
          {contagem.palavras} PALAVRAS · {contagem.minutos} MIN
        </span>
      </div>

      <div
        ref={ref}
        contentEditable
        role="textbox"
        aria-multiline="true"
        aria-label="Conteúdo do artigo"
        suppressContentEditableWarning
        spellCheck
        onInput={recalcular}
        onPaste={aoColar}
        onKeyDown={aoTeclar}
        className="prosa-editor min-h-[26rem] px-6 py-6 outline-none"
      />
    </div>
  );
}

function escapar(texto: string) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
