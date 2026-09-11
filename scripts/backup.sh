#!/bin/sh
# ============================================================
# Backup do banco do site CORZ
#
#   ./scripts/backup.sh
#
# Gera um dump comprimido em ./backups e mantém os últimos 14 dias.
# Para rodar sozinho todo dia às 3h, adicione ao crontab do servidor:
#
#   0 3 * * * cd /opt/corz && ./scripts/backup.sh >> backups/backup.log 2>&1
#
# Um backup que nunca foi restaurado não é backup. A última seção deste
# arquivo mostra como testar a restauração — faça isso pelo menos uma vez
# por trimestre.
# ============================================================

set -eu

cd "$(dirname "$0")/.."

if [ -f .env ]; then
  # shellcheck disable=SC1091
  . ./.env
fi

USUARIO="${POSTGRES_USER:-corz}"
BASE="${POSTGRES_DB:-corz}"
DESTINO="./backups"
CARIMBO="$(date +%Y-%m-%d_%H%M)"
ARQUIVO="$DESTINO/corz_${CARIMBO}.sql.gz"

mkdir -p "$DESTINO"

echo "[$(date '+%Y-%m-%d %H:%M:%S')] iniciando backup"

docker compose exec -T banco \
  pg_dump -U "$USUARIO" -d "$BASE" --clean --if-exists \
  | gzip -9 > "$ARQUIVO"

TAMANHO=$(du -h "$ARQUIVO" | cut -f1)

# Um dump saudável nunca é minúsculo. Menos de 1 KB significa que algo
# falhou silenciosamente e é melhor descobrir agora do que na emergência.
if [ "$(stat -c%s "$ARQUIVO")" -lt 1024 ]; then
  echo "ERRO: o backup saiu com $TAMANHO — provavelmente vazio. Verifique."
  rm -f "$ARQUIVO"
  exit 1
fi

echo "[$(date '+%Y-%m-%d %H:%M:%S')] pronto: $ARQUIVO ($TAMANHO)"

# Descarta o que passou de 14 dias.
find "$DESTINO" -name 'corz_*.sql.gz' -mtime +14 -delete
echo "backups guardados: $(find "$DESTINO" -name 'corz_*.sql.gz' | wc -l)"

# ------------------------------------------------------------
# Como restaurar
#
#   gunzip -c backups/corz_2026-08-17_0300.sql.gz \
#     | docker compose exec -T banco psql -U corz -d corz
#
# Como TESTAR a restauração sem tocar na produção:
#
#   docker compose exec banco createdb -U corz teste_restauracao
#   gunzip -c backups/ARQUIVO.sql.gz \
#     | docker compose exec -T banco psql -U corz -d teste_restauracao
#   docker compose exec banco psql -U corz -d teste_restauracao \
#     -c "select count(*) from artigos;"
#   docker compose exec banco dropdb -U corz teste_restauracao
# ------------------------------------------------------------
