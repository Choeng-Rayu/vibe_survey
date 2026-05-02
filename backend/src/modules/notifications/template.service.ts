// Req 16.2, 16.9: Notification templates with multi-language support
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/notification-template.dto.js';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private templateCache = new Map<string, any>(); // Req 16: Template caching

  constructor(private readonly prisma: PrismaService) {}

  // Req 16.2: Template CRUD
  async create(dto: CreateTemplateDto) {
    const template = await this.prisma.notificationTemplate.create({
      data: {
        name: dto.name,
        channel: dto.channel,
        subject: dto.subject,
        body_en: dto.body_en,
        body_km: dto.body_km,
        variables: dto.variables ?? [],
        is_active: dto.is_active ?? true,
      },
    });
    this.templateCache.set(template.id, template);
    return template;
  }

  async findAll() {
    return this.prisma.notificationTemplate.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    // Check cache first
    if (this.templateCache.has(id)) {
      return this.templateCache.get(id);
    }
    const template = await this.prisma.notificationTemplate.findUnique({ where: { id } });
    if (!template) throw new NotFoundException('Template not found');
    this.templateCache.set(id, template);
    return template;
  }

  async update(id: string, dto: UpdateTemplateDto) {
    const template = await this.prisma.notificationTemplate.update({
      where: { id },
      data: dto,
    });
    this.templateCache.set(id, template);
    return template;
  }

  async delete(id: string) {
    this.templateCache.delete(id);
    return this.prisma.notificationTemplate.delete({ where: { id } });
  }

  // Req 16.2: Variable substitution for personalization
  render(template: string, variables: Record<string, any>): string {
    let rendered = template;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      rendered = rendered.replace(regex, String(value));
    }
    return rendered;
  }

  // Req 16.9: Multi-language support
  async renderTemplate(templateId: string, language: 'en' | 'km', variables: Record<string, any>) {
    const template = await this.findOne(templateId);
    const body = language === 'km' && template.body_km ? template.body_km : template.body_en;
    const subject = template.subject ? this.render(template.subject, variables) : '';
    const renderedBody = this.render(body, variables);
    
    return { subject, body: renderedBody };
  }

  // Req 16: Template preview
  async preview(templateId: string, variables: Record<string, any>) {
    const template = await this.findOne(templateId);
    return {
      en: this.render(template.body_en, variables),
      km: template.body_km ? this.render(template.body_km, variables) : null,
    };
  }

  // Req 16: Template validation
  validateTemplate(template: string, requiredVars: string[]): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    for (const varName of requiredVars) {
      if (!template.includes(`{{${varName}}}`)) {
        missing.push(varName);
      }
    }
    return { valid: missing.length === 0, missing };
  }
}
