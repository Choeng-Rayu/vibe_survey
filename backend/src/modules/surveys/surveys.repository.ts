import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

// Requirement 5: Survey Management - Repository pattern
@Injectable()
export class SurveysRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SurveyCreateInput) {
    return this.prisma.survey.create({ data });
  }

  async findById(id: string) {
    return this.prisma.survey.findUnique({ where: { id } });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.SurveyWhereInput;
    orderBy?: Prisma.SurveyOrderByWithRelationInput;
  }) {
    return this.prisma.survey.findMany(params);
  }

  async update(id: string, data: Prisma.SurveyUpdateInput) {
    return this.prisma.survey.update({ where: { id }, data });
  }

  async softDelete(id: string) {
    return this.prisma.survey.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }

  async count(where?: Prisma.SurveyWhereInput) {
    return this.prisma.survey.count({ where });
  }
}
