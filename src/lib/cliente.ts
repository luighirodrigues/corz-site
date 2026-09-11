/**
 * Utilidades de cliente para o painel.
 * Nada aqui toca o banco — apenas leitura de cookie e chamadas fetch.
 */

/** Lê o token CSRF gravado junto com a sessão. */
export function csrf() {
  if (typeof document === "undefined") return "";
  const encontrado = document.cookie
    .split("; ")
    .find((c) => c.startsWith("corz_csrf="));
  return encontrado ? decodeURIComponent(encontrado.split("=")[1]!) : "";
}

/** POST/PUT/DELETE autenticado do painel, já com o cabeçalho CSRF. */
export async function apiAdmin(
  url: string,
  opcoes: { metodo?: string; corpo?: unknown } = {}
) {
  const resposta = await fetch(url, {
    method: opcoes.metodo ?? "POST",
    headers: {
      "Content-Type": "application/json",
      "x-corz-csrf": csrf(),
    },
    body: opcoes.corpo ? JSON.stringify(opcoes.corpo) : undefined,
  });

  let dados: Record<string, unknown> = {};
  try {
    dados = await resposta.json();
  } catch {
    /* resposta sem corpo */
  }

  return { ok: resposta.ok && dados.ok !== false, status: resposta.status, dados };
}

export function formatarData(valor: string | Date | null | undefined) {
  if (!valor) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(valor));
}

export function formatarDataHora(valor: string | Date | null | undefined) {
  if (!valor) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(valor));
}

/**
 * Converte Date para o formato que <input type="datetime-local"> aceita,
 * respeitando o fuso do navegador. O input não entende ISO com Z.
 */
export function paraCampoDataHora(valor: Date | string | null | undefined) {
  if (!valor) return "";
  const d = new Date(valor);
  const deslocamento = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - deslocamento).toISOString().slice(0, 16);
}

/** Caminho inverso: valor do input local para ISO com fuso. */
export function deCampoDataHora(valor: string) {
  if (!valor) return "";
  return new Date(valor).toISOString();
}
