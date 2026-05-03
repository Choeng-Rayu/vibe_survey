# Disaster Recovery

## Backup Schedule

Run `scripts/backup.sh` daily from the production scheduler with:

- `DATABASE_URL`
- `BACKUP_DIR`
- `BACKUP_BUCKET` for S3-compatible offsite copies
- `RETENTION_DAYS`, default `30`

Backups are gzip-compressed PostgreSQL dumps. Local retention removes files older than the configured window.

## Restore Procedure

1. Put the selected backup on the target host.
2. Point `DATABASE_URL` at the restore target.
3. Run `scripts/restore.sh <backup.sql.gz>`.
4. Run `npx prisma migrate deploy`.
5. Verify `/api/v1/health` and key smoke tests before returning traffic.

## Point-In-Time Recovery

For managed PostgreSQL/Supabase, use provider PITR to restore to a temporary database first, validate data integrity, then promote or migrate the recovered data. Do not restore directly over production without an approved maintenance window.

## Monitoring

Alert when a scheduled backup fails, backup size changes by more than 50% day over day, or restore verification fails.
