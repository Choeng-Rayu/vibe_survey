#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL is required}"

BACKUP_DIR="${BACKUP_DIR:-./backups}"
BACKUP_BUCKET="${BACKUP_BUCKET:-}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="vibe_survey_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"
pg_dump "$DATABASE_URL" | gzip > "${BACKUP_DIR}/${BACKUP_FILE}"

if [[ -n "$BACKUP_BUCKET" ]] && command -v aws >/dev/null 2>&1; then
  aws s3 cp "${BACKUP_DIR}/${BACKUP_FILE}" "s3://${BACKUP_BUCKET}/${BACKUP_FILE}"
fi

find "$BACKUP_DIR" -type f -name 'vibe_survey_*.sql.gz' -mtime +"$RETENTION_DAYS" -delete
echo "Backup completed: ${BACKUP_DIR}/${BACKUP_FILE}"
