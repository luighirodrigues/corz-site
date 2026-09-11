"use client";

import { useState, type FormEvent } from "react";
import { clsx } from "clsx";
import { Rotulo } from "@/components/sistema/primitivos";
import { marcarConversao } from "@/components/sistema/Medicao";

/** Espelha as quatro frentes, para o lead já chegar roteado. */
const INTERESSES = [
  "Conectividade & Redes",
  "Cloud & Datacenter",
  "Modern Workplace",
  "Cibersegurança",
  "Mais de uma frente",
  "Ainda não sei",
];

type Estado = "inicial" | "enviando" | "enviado" | "erro";

export default function FormularioContato({
  origem = "CONTATO",
  titulo = "Solicite seu diagnóstico",
  descricao = "Respondemos em até um dia útil. Se for urgente, o WhatsApp é mais rápido.",
}: {
  origem?: "CONTATO" | "DIAGNOSTICO" | "MATERIAL";
  titulo?: string;
  descricao?: string;
}) {
  const [estado, setEstado] = useState<Estado>("inicial");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagemErro, setMensagemErro] = useState("");

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setEstado("enviando");
    setErros({});
    setMensagemErro("");

    const formulario = new FormData(evento.currentTarget);
    const utm: Record<string, string> = {};
    if (typeof window !== "undefined") {
      const parametros = new URLSearchParams(window.location.search);
      for (const chave of [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ]) {
        const valor = parametros.get(chave);
        if (valor) utm[chave] = valor.slice(0, 200);
      }
    }

    const corpo = {
      ...Object.fromEntries(formulario.entries()),
      origem,
      pagina: typeof window !== "undefined" ? window.location.pathname : undefined,
      utm: Object.keys(utm).length ? utm : undefined,
    };

    try {
      const resposta = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo),
      });
      const dados = await resposta.json();

      if (resposta.ok && dados.ok) {
        /* Conversão só depois do 200. Marcar no clique contaria como
           lead todo formulário que falhou na validação. */
        marcarConversao("gerar_lead", { formulario: "contato" });
        setEstado("enviado");
        return;
      }
      if (dados.erros) setErros(dados.erros);
      setMensagemErro(
        dados.erro ?? "Não foi possível enviar. Revise os campos destacados."
      );
      setEstado("erro");
    } catch {
      setMensagemErro(
        "Falha de conexão. Tente novamente ou fale conosco pelo WhatsApp."
      );
      setEstado("erro");
    }
  }

  if (estado === "enviado") {
    return (
      <div className="rounded-[12px] border border-positivo/40 bg-positivo/[0.06] p-8">
        <Rotulo cor="petroleo">Recebido</Rotulo>
        <p className="mt-5 font-display text-[1.5rem] font-bold leading-snug tracking-[-0.03em] text-tinta-900">
          Sua solicitação chegou até nós.
        </p>
        <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-tinta-900/70">
          Um especialista da CORZ entra em contato em até um dia útil. Se a sua
          operação estiver parada agora, chame no WhatsApp. O atendimento é
          imediato.
        </p>
      </div>
    );
  }

  const campo =
    "mt-2 w-full rounded-[10px] border border-petroleo/20 bg-branco px-4 py-3 text-[0.9375rem] text-tinta-900 outline-none transition-colors duration-200 placeholder:text-tinta-900/30 focus:border-[#1D4FD8]";

  return (
    <form onSubmit={aoEnviar} noValidate className="space-y-6">
      <div>
        <Rotulo cor="petroleo">{titulo}</Rotulo>
        <p className="mt-4 max-w-[46ch] text-[0.9375rem] leading-relaxed text-tinta-900/65">
          {descricao}
        </p>
      </div>

      {/* Armadilha para robôs — invisível e fora da ordem de tabulação. */}
      <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="site">Não preencha este campo</label>
        <input id="site" name="site" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Campo
          id="nome"
          rotulo="Nome"
          obrigatorio
          erro={erros.nome}
          className={campo}
          autoComplete="name"
        />
        <Campo
          id="email"
          rotulo="E-mail corporativo"
          tipo="email"
          obrigatorio
          erro={erros.email}
          className={campo}
          autoComplete="email"
        />
        <Campo
          id="empresa"
          rotulo="Empresa"
          erro={erros.empresa}
          className={campo}
          autoComplete="organization"
        />
        <Campo
          id="telefone"
          rotulo="Telefone ou WhatsApp"
          tipo="tel"
          erro={erros.telefone}
          className={campo}
          autoComplete="tel"
        />
      </div>

      <div>
        <label
          htmlFor="interesse"
          className="rotulo text-petroleo/60"
        >
          O que você precisa resolver
        </label>
        <select id="interesse" name="interesse" className={campo} defaultValue="">
          <option value="" disabled>
            Selecione
          </option>
          {INTERESSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="mensagem" className="rotulo text-petroleo/60">
          Conte o contexto
        </label>
        <textarea
          id="mensagem"
          name="mensagem"
          rows={4}
          className={campo}
          placeholder="Quantas unidades a empresa tem? O que está travando hoje?"
        />
      </div>

      {mensagemErro && (
        <p
          role="alert"
          className="rounded-[10px] border border-negativo/40 bg-negativo/[0.06] px-4 py-3 text-[0.875rem] text-negativo"
        >
          {mensagemErro}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        data-cursor="acao"
        className={clsx(
          "inline-flex w-full items-center justify-center gap-2.5 rounded-[10px] bg-[#1D4FD8] px-6 py-4",
          "text-[0.9375rem] font-semibold text-branco transition-colors duration-300",
          "hover:bg-[#153bab] disabled:opacity-50 sm:w-auto"
        )}
      >
        {estado === "enviando" ? "Enviando…" : "Enviar solicitação"}
      </button>

      <p className="text-[0.75rem] leading-relaxed text-tinta-900/45">
        Ao enviar, você concorda com o tratamento dos seus dados conforme a
        nossa Política de Privacidade. Não compartilhamos suas informações com
        terceiros e não enviamos mala direta.
      </p>
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
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={clsx(className, erro && "border-negativo")}
      />
      {erro && (
        <p id={`${id}-erro`} className="mt-1.5 text-[0.75rem] text-negativo">
          {erro}
        </p>
      )}
    </div>
  );
}
