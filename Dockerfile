# ============================================================
# Imagem de produção do site CORZ
#
# Três estágios para que a imagem final não carregue compilador,
# dependências de desenvolvimento nem código-fonte. O que sobe para o
# servidor é só o necessário para servir.
# ============================================================

# ---------- 1. Dependências ---------------------------------
FROM node:22-alpine AS dependencias
WORKDIR /app

# libc6-compat: o binário nativo do Argon2 espera glibc, e o Alpine usa musl.
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./
RUN npm ci


# ---------- 2. Build ----------------------------------------
FROM node:22-alpine AS construcao
WORKDIR /app
RUN apk add --no-cache libc6-compat

COPY --from=dependencias /app/node_modules ./node_modules
COPY . .

# Variáveis NEXT_PUBLIC_* são embutidas no bundle durante o build, então
# precisam existir aqui — não basta defini-las só na hora de rodar.
ARG NEXT_PUBLIC_SITE_URL=https://corz.com.br
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build


# ---------- 3. Execução -------------------------------------
FROM node:22-alpine AS producao
WORKDIR /app

RUN apk add --no-cache libc6-compat curl

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Usuário sem privilégios. Se alguém escapar do processo Node, cai num
# usuário que não pode escrever em lugar nenhum de interesse.
RUN addgroup -g 1001 -S nodejs && adduser -S corz -u 1001

COPY --from=construcao /app/public ./public
COPY --from=construcao --chown=corz:nodejs /app/.next/standalone ./
COPY --from=construcao --chown=corz:nodejs /app/.next/static ./.next/static

# Migrações e scripts administrativos rodam dentro do contêiner
# (docker compose exec), então precisam estar presentes.
COPY --from=construcao --chown=corz:nodejs /app/drizzle ./drizzle
COPY --from=construcao --chown=corz:nodejs /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=construcao --chown=corz:nodejs /app/scripts ./scripts
COPY --from=construcao --chown=corz:nodejs /app/src/db ./src/db
COPY --from=construcao --chown=corz:nodejs /app/src/lib ./src/lib
COPY --from=construcao --chown=corz:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=dependencias --chown=corz:nodejs /app/node_modules/drizzle-kit ./node_modules/drizzle-kit
COPY --from=dependencias --chown=corz:nodejs /app/node_modules/tsx ./node_modules/tsx
COPY --from=dependencias --chown=corz:nodejs /app/node_modules/esbuild ./node_modules/esbuild
COPY --from=dependencias --chown=corz:nodejs /app/node_modules/dotenv ./node_modules/dotenv

USER corz

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:${PORT:-3000}/api/saude || exit 1

CMD ["node", "server.js"]
