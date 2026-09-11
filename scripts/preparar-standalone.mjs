/**
 * Termina o build do modo `standalone`.
 *
 * O `next build` com `output: "standalone"` gera um servidor enxuto em
 * `.next/standalone`, mas não copia para dentro dele nem a pasta
 * `public` nem `.next/static`. Quem sobe só o standalone acaba com um
 * servidor que responde 200 no HTML e 404 em todo CSS, JavaScript e
 * imagem — a página chega ao navegador inteira e sem estilo nenhum,
 * com os SVGs em tamanho natural e os links em azul de 1995. É o
 * defeito mais fácil de diagnosticar errado, porque não existe erro:
 * o servidor está no ar e o HTML está correto.
 *
 * Estava documentado como passo manual. Passo manual em publicação é
 * passo esquecido, então virou `postbuild`: o npm roda este arquivo
 * sozinho depois de todo `npm run build`, sem ninguém precisar lembrar.
 *
 * O `next build` regenera `.next/standalone` do zero a cada compilação,
 * então a cópia precisa acontecer depois — e de novo a cada vez.
 */
import { cp, access, mkdir } from "node:fs/promises";
import { join } from "node:path";

const raiz = process.cwd();
const destino = join(raiz, ".next", "standalone");

const existe = async (caminho) =>
  access(caminho).then(
    () => true,
    () => false
  );

if (!(await existe(destino))) {
  console.log(
    "\n  · Sem .next/standalone: nada a preparar (o projeto não está em modo standalone).\n"
  );
  process.exit(0);
}

const pares = [
  ["public", join(destino, "public")],
  [join(".next", "static"), join(destino, ".next", "static")],
];

for (const [origem, alvo] of pares) {
  const de = join(raiz, origem);
  if (!(await existe(de))) continue;
  await mkdir(join(alvo, ".."), { recursive: true });
  await cp(de, alvo, { recursive: true, force: true });
  console.log(`  ✓ ${origem} → .next/standalone`);
}

console.log(
  "\n  Pronto para publicar. Inicie com:  node .next/standalone/server.js\n"
);
