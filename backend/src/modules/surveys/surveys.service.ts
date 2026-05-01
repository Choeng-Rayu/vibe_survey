import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common';
import { SurveyStatus } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { SurveyValidationService } from './survey-validation.service';
import { SurveyVersioningService } from './survey-versioning.service';
import { CreateSurveyDto, UpdateSurveyDto } from './dto/survey.dto';

@Injectable()
export class SurveysService {
  private readonly logger = new Logger(SurveysService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly validationService: SurveyValidationService,
    private readonly versioningService: SurveyVersioningService,
  ) {}

  async create(userId: string, dto: CreateSurveyDto) {
    this.validationService.validateAndThrow(dto.definition);
    const survey = await this.prisma.survey.create({
      data: {
        title: dto.title,
        description: dto.description,
        definition: dto.definition,
        status: (dto.status as SurveyStatus) || SurveyStatus.draft,
        user_id: userId,
        version: 1,
        language: 'en',
      },
    });
    this.logger.log(`Survey created: ${survey.id}`);
    return survey;
  }

  async findAll(userId: string, role: string) {
    const where = role === 'admin' ? { deleted_at: null } : { user_id: userId, deleted_at: null };
    return this.prisma.survey.findMany({ where, orderBy: { created_at: 'desc' } });
  }

  async findOne(id: string, userId: string, role: string) {
    const survey = await this.prisma.survey.findUnique({ where: { id } });
    if (!survey || survey.deleted_at) throw new NotFoundException('Survey not found');
    if (role !== 'admin' && survey.user_id !== userId) throw new ForbiddenException('Access denied');
    return survey;
  }

  async update(id: string, userId: string, role: string, dto: UpdateSurveyDto) {
    const survey = await this.findOne(id, userId, role);
    if (dto.definition) this.validationService.validateAndThrow(dto.definition);
    
    const updated = await this.prisma.survey.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        definition: dto.definition,
        status: dto.status as SurveyStatus,
        version: survey.version + 1,
      },
    });
    this.logger.log(`Survey updated: ${id}`);
    return updated;
  }

  async remove(id: string, userId: string, role: string) {
    await this.findOne(id, userId, role);
    await this.prisma.survey.update({ where: { id }, data: { deleted_at: new Date() } });
    this.logger.log(`Survey deleted: ${id}`);
    return { message: 'Survey deleted' };
  }

  async duplicate(id: string, userId: string, role: string) {
    const original = await this.findOne(id, userId, role);
    const duplicated = await this.prisma.survey.create({
      data: {
        title: `${original.title} (Copy)`,
        description: original.description,
        definition: original.definition as any,
        status: SurveyStatus.draft,
        user_id: userId,
        version: 1,
        language: original.language,
      },
    });
    this.logger.log(`Survey duplicated: ${id} -> ${duplicated.id}`);
    return duplicated;
  }
}
