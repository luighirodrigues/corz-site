import { headers } from "next/headers";

/**
 * IP do cliente.
 *
 * Confiamos apenas no primeiro salto de x-forwarded-for e somente porque
 * a aplicação roda atrás de um proxy conhecido. Se o site for exposto
 * diretamente, o cabeçalho é forjável — nesse caso use a variável do
 * provedor (ex.: x-real-ip da própria borda) e nada mais.
 */
export async function ipDoCliente() {
  const h = await headers();
  // Confiamos em x-real-ip injetado pelo proxy reverso confiável (Caddy).
  const realIp = h.get("x-real-ip");
  if (realIp) return realIp.trim().slice(0, 64);

  // Se houver x-forwarded-for com múltiplos saltos, o último foi adicionado
  // pelo proxy mais próximo da aplicação (não pelo cliente inicial).
  const encaminhado = h.get("x-forwarded-for");
  if (encaminhado) {
    const ips = encaminhado.split(",").map((s) => s.trim()).filter(Boolean);
    const ultimo = ips.pop();
    if (ultimo) return ultimo.slice(0, 64);
  }

  return "desconhecido";
}

export async function agenteDoCliente() {
  const h = await headers();
  return (h.get("user-agent") ?? "").slice(0, 400);
}

/* ------------------------------------------------------------------
   Limitador de taxa em memória.

   Suficiente para uma instância única, que é o cenário de implantação
   previsto (VPS ou contêiner único). Em execução com várias réplicas,
   trocar o Mapa por Redis mantendo esta mesma assinatura — nenhum
   chamador precisa mudar.
   ------------------------------------------------------------------ */

type Janela = { contagem: number; expiraEm: number };
const janelas = new Map<string, Janela>();

export function limitar(
  chave: string,
  { limite, janelaMs }: { limite: number; janelaMs: number }
): { permitido: boolean; restante: number; esperarMs: number } {
  const agora = Date.now();
  const atual = janelas.get(chave);

  if (!atual || atual.expiraEm <= agora) {
    janelas.set(chave, { contagem: 1, expiraEm: agora + janelaMs });
    return { permitido: true, restante: limite - 1, esperarMs: 0 };
  }

  atual.contagem += 1;
  if (atual.contagem > limite) {
    return {
      permitido: false,
      restante: 0,
      esperarMs: atual.expiraEm - agora,
    };
  }

  return {
    permitido: true,
    restante: limite - atual.contagem,
    esperarMs: 0,
  };
}

/** Remove janelas vencidas para o Mapa não crescer sem limite. */
if (typeof setInterval === "function") {
  const limpeza = setInterval(() => {
    const agora = Date.now();
    for (const [chave, janela] of janelas) {
      if (janela.expiraEm <= agora) janelas.delete(chave);
    }
  }, 60_000);
  // Não segura o processo aberto em ambientes de execução curta.
  limpeza.unref?.();
}

export function respostaJson(dados: unknown, status = 200) {
  return Response.json(dados, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * A requisição saiu do próprio site?
 *
 * Os formulários públicos não têm sessão, então não dá para usar o
 * mesmo par de cookies do painel. O que dá para exigir é que `Origin`
 * (ou `Referer`, para quem não manda o primeiro) aponte para o próprio
 * host. Não é barreira contra alguém determinado — quem forja
 * cabeçalho passa —, mas elimina a maior parte do envio automatizado,
 * que descobre o endereço do formulário e passa a chamá-lo direto, sem
 * nunca carregar a página.
 *
 * Requisição sem `Origin` nem `Referer` é aceita: cliente legítimo
 * antigo e algumas configurações de privacidade os removem, e recusar
 * aí custaria formulário de gente real.
 */
export async function mesmaOrigem(req: Request) {
  const h = await headers();
  const origem = req.headers.get("origin") ?? h.get("origin");
  const referencia = req.headers.get("referer") ?? h.get("referer");
  const bruto = origem ?? referencia;

  // Requisições de escrita (POST, PUT, DELETE, PATCH) exigem confirmação de origem.
  // Sem Origin nem Referer em requisições de mutação, rejeitamos para barrar bots
  // que suprimem esses cabeçalhos intencionalmente.
  const metodo = req.method?.toUpperCase();
  const mutacao = metodo && ["POST", "PUT", "DELETE", "PATCH"].includes(metodo);
  if (!bruto) return !mutacao;

  const host = h.get("host");
  if (!host) return false;

  try {
    return new URL(bruto).host === host;
  } catch {
    return false;
  }
}
