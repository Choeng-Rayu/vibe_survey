#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL is required}"
BACKUP_FILE="${1:-}"

if [[ -z "$BACKUP_FILE" ]]; then
  echo "Usage: scripts/restore.sh <backup.sql.gz>"
  exit 1
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

gunzip -c "$BACKUP_FILE" | psql "$DATABASE_URL"
psql "$DATABASE_URL" -c 'select count(*) as users_count from users;'
echo "Restore completed from: $BACKUP_FILE"
