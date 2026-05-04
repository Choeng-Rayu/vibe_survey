import { Injectable } from '@nestjs/common';
import { AuditAction } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';

export interface CreateAuditLogDto {
  action: AuditAction | string;
  actor_id?: string;
  target_type?: string;
  target_id?: string;
  old_value?: unknown;
  new_value?: unknown;
  ip?: string;
  user_agent?: string;
}

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(entry: CreateAuditLogDto): Promise<void> {
    await this.prisma.auditLog.create({
      data: {
        user_id: entry.actor_id,
        action: this.normalizeAction(entry.action),
        entity_type: entry.target_type ?? 'request',
        entity_id: entry.target_id ?? 'unknown',
        old_value: entry.old_value as any,
        new_value: entry.new_value as any,
        ip_address: entry.ip,
        user_agent: entry.user_agent,
      },
    });
  }

  async search(params: {
    skip?: number;
    take?: number;
    action?: string;
    entity_type?: string;
    entity_id?: string;
    user_id?: string;
  }) {
    return this.prisma.auditLog.findMany({
      where: {
        ...(params.action ? { action: this.normalizeAction(params.action) } : {}),
        ...(params.entity_type ? { entity_type: params.entity_type } : {}),
        ...(params.entity_id ? { entity_id: params.entity_id } : {}),
        ...(params.user_id ? { user_id: params.user_id } : {}),
      },
      orderBy: { created_at: 'desc' },
      skip: params.skip ?? 0,
      take: params.take ?? 50,
    });
  }

  async export(params: { action?: string; entity_type?: string }) {
    const logs = await this.search({ ...params, take: 1000 });
    const header = 'id,action,entity_type,entity_id,user_id,ip_address,created_at';
    const rows = logs.map((log) =>
      [
        log.id,
        log.action,
        log.entity_type,
        log.entity_id,
        log.user_id ?? '',
        log.ip_address ?? '',
        log.created_at.toISOString(),
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(','),
    );
    return { filename: `audit-logs-${Date.now()}.csv`, content: [header, ...rows].join('\n') };
  }

  private normalizeAction(action: AuditAction | string): AuditAction {
    if (Object.values(AuditAction).includes(action as AuditAction)) {
      return action as AuditAction;
    }
    if (String(action).startsWith('POST')) return AuditAction.create;
    if (String(action).startsWith('DELETE')) return AuditAction.delete;
    return AuditAction.update;
  }
}
