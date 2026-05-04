import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/notification-template.dto.js';

// Req 16: Notification templates with localization
@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTemplateDto) {
    return this.prisma.notificationTemplate.create({
      data: {
        name: dto.name,
        channel: dto.type as any,
        subject: dto.subject,
        body_en: dto.body,
        body_km: dto.language === 'km' ? dto.body : null,
        variables: dto.variables || [],
        is_active: dto.is_active ?? true,
      },
    });
  }

  async findAll() {
    return this.prisma.notificationTemplate.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string) {
    const template = await this.prisma.notificationTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  async update(id: string, dto: UpdateTemplateDto) {
    await this.findOne(id);

    return this.prisma.notificationTemplate.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.subject && { subject: dto.subject }),
        ...(dto.body && { body_en: dto.body }),
        ...(dto.variables && { variables: dto.variables }),
        ...(dto.is_active !== undefined && { is_active: dto.is_active }),
      },
    });
  }

  async delete(id: string) {
    await this.findOne(id);

    return this.prisma.notificationTemplate.update({
      where: { id },
      data: { is_active: false },
    });
  }

  async render(templateId: string, variables: Record<string, any>, language = 'en') {
    const template = await this.findOne(templateId);

    let subject = template.subject || '';
    let body = language === 'km' && template.body_km ? template.body_km : template.body_en;

    // Simple variable substitution
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), String(value));
      body = body.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return { subject, body };
  }

  async renderByName(name: string, language: string, variables: Record<string, any>) {
    const template = await this.prisma.notificationTemplate.findFirst({
      where: { name, is_active: true },
    });

    if (!template) {
      throw new NotFoundException(`Template ${name} not found`);
    }

    return this.render(template.id, variables, language);
  }
}
