import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { Prisma } from '@prisma/client';
import { PaginationHelper, PaginatedResult } from '../../common/utils/pagination.helper.js';

// Req 18.3: Query optimization with proper includes
@Injectable()
export class SurveysRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.SurveyCreateInput) {
    return this.prisma.survey.create({ data });
  }

  async findById(id: string) {
    // Req 18.3: Optimized query with select to reduce payload
    return this.prisma.survey.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true },
        },
      },
    });
  }

  async findMany(params: {
    limit?: number;
    cursor?: string;
    where?: Prisma.SurveyWhereInput;
    orderBy?: Prisma.SurveyOrderByWithRelationInput;
  }): Promise<PaginatedResult<any>> {
    const limit = PaginationHelper.getLimit(params.limit);

    const data = await this.prisma.survey.findMany({
      take: limit + 1,
      skip: params.cursor ? 1 : 0,
      cursor: params.cursor ? { id: params.cursor } : undefined,
      where: params.where,
      orderBy: params.orderBy || { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        created_at: true,
        updated_at: true,
        user: {
          select: { id: true, email: true },
        },
      },
    });

    const total = await this.prisma.survey.count({ where: params.where });
    return PaginationHelper.buildResult(data, limit, total);
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
