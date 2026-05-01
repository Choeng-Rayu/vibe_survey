import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ResponseStatus } from '@prisma/client';

// Requirement 10: Survey Taking Engine - Response data access
@Injectable()
export class ResponseRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    survey_id: string;
    campaign_id?: string;
    user_id: string;
    answers?: any;
    behavioral_data?: any;
  }) {
    return this.prisma.response.create({ data });
  }

  async findById(id: string) {
    return this.prisma.response.findUnique({ where: { id } });
  }

  async findInProgress(userId: string, surveyId: string) {
    return this.prisma.response.findFirst({
      where: {
        user_id: userId,
        survey_id: surveyId,
        status: ResponseStatus.in_progress,
        deleted_at: null,
      },
    });
  }

  async update(id: string, data: {
    answers?: any;
    behavioral_data?: any;
    time_spent?: number;
    status?: ResponseStatus;
    completed_at?: Date;
    fraud_score?: number;
    fraud_signals?: any;
    quality_label?: string;
  }) {
    return this.prisma.response.update({ where: { id }, data });
  }

  async findUserResponses(userId: string, status?: ResponseStatus) {
    return this.prisma.response.findMany({
      where: {
        user_id: userId,
        ...(status && { status }),
        deleted_at: null,
      },
      include: {
        survey: { select: { id: true, title: true, estimated_time: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }
}
