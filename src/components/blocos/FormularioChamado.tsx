"use client";

import { useState, type FormEvent } from "react";
import { clsx } from "clsx";
import { Rotulo } from "@/components/sistema/primitivos";
import { marcarConversao } from "@/components/sistema/Medicao";
import { site } from "@/conteudo/site";

const CRITICIDADES = [
  {
    valor: "parada-total",
    rotulo: "Parada total",
    ajuda: "A unidade não opera",
    cor: "#E20D50",
  },
  {
    valor: "degradado",
    rotulo: "Degradado",
    ajuda: "Opera com falha ou lentidão",
    cor: "#EBAD28",
  },
  {
    valor: "duvida",
    rotulo: "Dúvida ou solicitação",
    ajuda: "Sem impacto na operação",
    cor: "#00ADE7",
  },
];

const CATEGORIAS = [
  { valor: "conectividade", rotulo: "Link de internet ou WAN" },
  { valor: "rede-interna", rotulo: "Rede interna, Wi-Fi ou switch" },
  { valor: "cloud", rotulo: "Cloud, servidor ou backup" },
  { valor: "estacao", rotulo: "Computador, e-mail ou acesso" },
  { valor: "telefonia", rotulo: "Telefonia e PABX" },
  { valor: "seguranca", rotulo: "Segurança, firewall ou incidente" },
  { valor: "outro", rotulo: "Outro assunto" },
];

export default function FormularioChamado() {
  const [estado, setEstado] = useState<
    "inicial" | "enviando" | "enviado" | "erro"
  >("inicial");
  const [protocolo, setProtocolo] = useState("");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagemErro, setMensagemErro] = useState("");
  const [criticidade, setCriticidade] = useState("degradado");

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEstado("enviando");
    setErros({});
    setMensagemErro("");

    const dados = Object.fromEntries(new FormData(evento.currentTarget).entries());

    try {
      const resposta = await fetch("/api/chamados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados),
      });
      const json = await resposta.json();

      if (resposta.ok && json.ok) {
        marcarConversao("abrir_chamado", { formulario: "suporte" });
        setProtocolo(json.protocolo);
        setEstado("enviado");
        return;
      }
      if (json.erros) setErros(json.erros);
      setMensagemErro(json.erro ?? "Revise os campos destacados.");
      setEstado("erro");
    } catch {
      setMensagemErro(
        "Falha de conexão. Se a operação estiver parada, ligue para " +
          site.telefone +
          "."
      );
      setEstado("erro");
    }
  }

  if (estado === "enviado") {
    return (
      <div className="rounded-[12px] border border-positivo/40 bg-positivo/[0.06] p-8">
        <Rotulo cor="petroleo">Chamado aberto</Rotulo>
        <p className="mt-5 font-mono text-[1.75rem] font-bold tracking-[0.02em] text-tinta-900">
          {protocolo}
        </p>
        <p className="mt-4 max-w-[48ch] text-[0.9375rem] leading-relaxed text-tinta-900/70">
          Guarde este protocolo. A primeira resposta acontece em até 3 minutos.
          Para parada total, ligue também para{" "}
          <a
            href={`tel:${site.telefoneE164}`}
            className="font-semibold text-[#1D4FD8]"
          >
            {site.telefone}
          </a>{" "}
          . O telefone é o caminho mais rápido para operação parada.
        </p>
      </div>
    );
  }

  const campo =
    "mt-2 w-full rounded-[10px] border border-petroleo/20 bg-branco px-4 py-3 text-[0.9375rem] text-tinta-900 outline-none transition-colors duration-200 placeholder:text-tinta-900/30 focus:border-[#1D4FD8]";

  return (
    <form onSubmit={aoEnviar} noValidate className="space-y-7">
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="site-chamado">Não preencha</label>
        <input id="site-chamado" name="site" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset>
        <legend className="rotulo text-petroleo/60">
          Qual o impacto agora?
        </legend>
        <div className="mt-4 grid gap-px overflow-hidden rounded-[10px] border border-petroleo/16 bg-petroleo/12 sm:grid-cols-3">
          {CRITICIDADES.map((item) => (
            <label
              key={item.valor}
              data-cursor="acao"
              className={clsx(
                "relative flex cursor-pointer flex-col gap-1 bg-branco p-5 transition-colors duration-200",
                criticidade === item.valor ? "bg-papel-050" : "hover:bg-papel-050"
              )}
            >
              <input
                type="radio"
                name="criticidade"
                value={item.valor}
                checked={criticidade === item.valor}
                onChange={() => setCriticidade(item.valor)}
                className="sr-only"
              />
              <span
                aria-hidden
                className={clsx(
                  "absolute left-0 top-0 h-full w-[3px] transition-opacity duration-200",
                  criticidade === item.valor ? "opacity-100" : "opacity-0"
                )}
                style={{ background: item.cor }}
              />
              <span className="font-display text-[1rem] font-semibold tracking-[-0.022em] text-tinta-900">
                {item.rotulo}
              </span>
              <span className="text-[0.8125rem] text-tinta-900/55">
                {item.ajuda}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo id="nome" rotulo="Seu nome" obrigatorio erro={erros.nome} className={campo} autoComplete="name" />
        <Campo id="empresa" rotulo="Empresa" obrigatorio erro={erros.empresa} className={campo} autoComplete="organization" />
        <Campo id="email" rotulo="E-mail" tipo="email" obrigatorio erro={erros.email} className={campo} autoComplete="email" />
        <Campo id="telefone" rotulo="Telefone para retorno" tipo="tel" obrigatorio erro={erros.telefone} className={campo} autoComplete="tel" />
        <Campo id="unidade" rotulo="Unidade afetada" erro={erros.unidade} className={campo} />
        <div>
          <label htmlFor="categoria" className="rotulo text-petroleo/60">
            Categoria<span className="ml-1 text-negativo">*</span>
          </label>
          <select
            id="categoria"
            name="categoria"
            required
            defaultValue="conectividade"
            className={campo}
          >
            {CATEGORIAS.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.rotulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="descricao" className="rotulo text-petroleo/60">
          O que está acontecendo<span className="ml-1 text-negativo">*</span>
        </label>
        <textarea
          id="descricao"
          name="descricao"
          rows={5}
          required
          className={clsx(campo, erros.descricao && "border-negativo")}
          placeholder="Desde quando, quantas unidades afetadas, o que já foi tentado."
        />
        {erros.descricao && (
          <p className="mt-1.5 text-[0.75rem] text-negativo">{erros.descricao}</p>
        )}
      </div>

      {mensagemErro && (
        <p
          role="alert"
          className="rounded-[10px] border border-negativo/40 bg-negativo/[0.06] px-4 py-3 text-[0.875rem] text-negativo"
        >
          {mensagemErro}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={estado === "enviando"}
          data-cursor="acao"
          className="inline-flex items-center justify-center rounded-[10px] bg-[#1D4FD8] px-7 py-4 text-[0.9375rem] font-semibold text-branco transition-colors duration-300 hover:bg-[#153bab] disabled:opacity-50"
        >
          {estado === "enviando" ? "Abrindo chamado…" : "Abrir chamado"}
        </button>
        <a
          href={site.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="externo"
          className="text-[0.875rem] font-semibold text-tinta-900/70 transition-colors hover:text-[#1D4FD8]"
        >
          Operação parada agora? Chame no WhatsApp →
        </a>
      </div>
    </form>
  );
}

function Campo({
  id,
  rotulo,
  tipo = "text",
  obrigatorio,
  erro,
  className,
  autoComplete,
}: {
  id: string;
  rotulo: string;
  tipo?: string;
  obrigatorio?: boolean;
  erro?: string;
  className: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="rotulo text-petroleo/60">
        {rotulo}
        {obrigatorio && <span className="ml-1 text-negativo">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={tipo}
        required={obrigatorio}
        autoComplete={autoComplete}
        aria-invalid={erro ? true : undefined}
        className={clsx(className, erro && "border-negativo")}
      />
      {erro && <p className="mt-1.5 text-[0.75rem] text-negativo">{erro}</p>}
    </div>
  );
}
