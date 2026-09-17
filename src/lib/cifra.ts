import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

/**
 * Cifra simétrica para segredos que precisam voltar ao texto claro —
 * hoje, apenas o segredo TOTP do segundo fator.
 *
 * AES-256-GCM: confidencialidade e autenticidade na mesma operação.
 * O formato gravado é `v1.<iv>.<tag>.<conteúdo>`, todos em base64url.
 * O prefixo de versão existe para permitir rotação de algoritmo sem
 * quebrar o que já está no banco.
 */

const VERSAO = "v1";

function chave() {
  const bruta = process.env.CIFRA_SEGREDO;
  if (!bruta) {
    throw new Error(
      "CIFRA_SEGREDO ausente. Gere com: openssl rand -base64 32"
    );
  }
  // Derivamos 32 bytes por SHA-256 para aceitar qualquer comprimento de
  // entrada sem quebrar quando o operador colar uma frase mais curta.
  return createHash("sha256").update(bruta).digest();
}

export function cifrar(texto: string) {
  const iv = randomBytes(12);
  const cifrador = createCipheriv("aes-256-gcm", chave(), iv);
  const conteudo = Buffer.concat([
    cifrador.update(texto, "utf8"),
    cifrador.final(),
  ]);
  const tag = cifrador.getAuthTag();
  return [
    VERSAO,
    iv.toString("base64url"),
    tag.toString("base64url"),
    conteudo.toString("base64url"),
  ].join(".");
}

export function decifrar(pacote: string) {
  const [versao, iv, tag, conteudo] = pacote.split(".");
  if (versao !== VERSAO || !iv || !tag || !conteudo) {
    throw new Error("Pacote cifrado em formato desconhecido.");
  }
  const decifrador = createDecipheriv(
    "aes-256-gcm",
    chave(),
    Buffer.from(iv, "base64url")
  );
  decifrador.setAuthTag(Buffer.from(tag, "base64url"));
  return Buffer.concat([
    decifrador.update(Buffer.from(conteudo, "base64url")),
    decifrador.final(),
  ]).toString("utf8");
}

/** Hash de tokens de sessão. Rápido de propósito: o token já tem 256 bits. */
export function digerir(valor: string) {
  return createHash("sha256").update(valor).digest("hex");
}

export function tokenAleatorio(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

/** Comparação em tempo constante — evita oráculo por medição de tempo. */
export function iguaisEmTempoConstante(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) {
    // Ainda assim comparamos algo do mesmo tamanho para não vazar o
    // comprimento pela duração da chamada.
    timingSafeEqual(ba, ba);
    return false;
  }
  return timingSafeEqual(ba, bb);
}
