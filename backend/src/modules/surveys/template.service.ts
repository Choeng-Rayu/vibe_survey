import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateTemplateDto } from './dto/template.dto';

// Requirement 5.3: Survey templates for efficient survey creation
@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createTemplate(userId: string, surveyId: string, dto: CreateTemplateDto) {
    const survey = await this.prisma.survey.findUnique({ where: { id: surveyId } });
    if (!survey) throw new NotFoundException('Survey not found');

    const template = await this.prisma.survey.update({
      where: { id: surveyId },
      data: {
        is_template: true,
        template_category: dto.category,
        tags: dto.tags || [],
      },
    });
    this.logger.log(`Template created from survey: ${surveyId}`);
    return template;
  }

  async getTemplates(category?: string) {
    const where = category
      ? { is_template: true, template_category: category }
      : { is_template: true };
    return this.prisma.survey.findMany({ where, orderBy: { created_at: 'desc' } });
  }

  async instantiateTemplate(templateId: string, userId: string, title: string) {
    const template = await this.prisma.survey.findUnique({ where: { id: templateId } });
    if (!template || !template.is_template) throw new NotFoundException('Template not found');

    const newSurvey = await this.prisma.survey.create({
      data: {
        title,
        description: template.description,
        definition: template.definition as any,
        status: 'draft',
        user_id: userId,
        version: 1,
        language: template.language,
      },
    });
    this.logger.log(`Survey created from template: ${templateId}`);
    return newSurvey;
  }

  async deleteTemplate(templateId: string) {
    await this.prisma.survey.update({
      where: { id: templateId },
      data: { is_template: false, deleted_at: new Date() },
    });
    this.logger.log(`Template deleted: ${templateId}`);
    return { message: 'Template deleted' };
  }
}
