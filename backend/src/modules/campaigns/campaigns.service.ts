import { Injectable, NotFoundException, ForbiddenException, BadRequestException, Logger } from '@nestjs/common';
import { CampaignsRepository } from './campaigns.repository';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CampaignStatus } from '@prisma/client';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);

  private readonly validTransitions: Record<CampaignStatus, CampaignStatus[]> = {
    draft: [CampaignStatus.pending_review],
    pending_review: [CampaignStatus.approved, CampaignStatus.rejected, CampaignStatus.draft],
    approved: [CampaignStatus.active, CampaignStatus.draft],
    active: [CampaignStatus.paused, CampaignStatus.completed],
    paused: [CampaignStatus.active, CampaignStatus.archived],
    completed: [CampaignStatus.archived],
    rejected: [CampaignStatus.draft],
    archived: [],
  };

  constructor(private readonly repository: CampaignsRepository) {}

  async create(userId: string, dto: CreateCampaignDto) {
    return this.repository.create({
      title: dto.title,
      description: dto.description,
      survey: { connect: { id: dto.survey_id } },
      targeting: dto.targeting as any,
      budget_total: dto.budget_total,
      cpr: dto.cpr,
      max_responses: dto.max_responses,
      starts_at: dto.starts_at ? new Date(dto.starts_at) : undefined,
      ends_at: dto.ends_at ? new Date(dto.ends_at) : undefined,
      user: { connect: { id: userId } },
    });
  }

  async findAll(userId: string, params?: { skip?: number; take?: number; search?: string; status?: CampaignStatus }) {
    const where: any = { user_id: userId, deleted_at: null };
    if (params?.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { description: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params?.status) where.status = params.status;

    return this.repository.findMany({
      skip: params?.skip || 0,
      take: params?.take || 20,
      where,
      orderBy: { created_at: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const campaign = await this.repository.findById(id);
    if (!campaign) throw new NotFoundException('Campaign not found');
    if (campaign.user_id !== userId) throw new ForbiddenException('Access denied');
    return campaign;
  }

  async update(id: string, userId: string, dto: UpdateCampaignDto) {
    const campaign = await this.findOne(id, userId);
    if (campaign.status !== CampaignStatus.draft && campaign.status !== CampaignStatus.rejected) {
      throw new BadRequestException('Only draft or rejected campaigns can be edited');
    }
    return this.repository.update(id, {
      title: dto.title,
      description: dto.description,
      targeting: dto.targeting as any,
      budget_total: dto.budget_total,
      cpr: dto.cpr,
      max_responses: dto.max_responses,
      starts_at: dto.starts_at ? new Date(dto.starts_at) : undefined,
      ends_at: dto.ends_at ? new Date(dto.ends_at) : undefined,
    });
  }

  async remove(id: string, userId: string) {
    const campaign = await this.findOne(id, userId);
    if (campaign.status === CampaignStatus.active) {
      throw new BadRequestException('Cannot delete active campaign');
    }
    return this.repository.softDelete(id);
  }

  async duplicate(id: string, userId: string) {
    const original = await this.findOne(id, userId);
    return this.repository.create({
      title: `${original.title} (Copy)`,
      description: original.description,
      survey: { connect: { id: original.survey_id } },
      targeting: original.targeting as any,
      budget_total: original.budget_total,
      cpr: original.cpr,
      max_responses: original.max_responses,
      user: { connect: { id: userId } },
    });
  }

  async transitionStatus(id: string, userId: string, toStatus: CampaignStatus, note?: string) {
    const campaign = await this.findOne(id, userId);
    if (!this.validTransitions[campaign.status].includes(toStatus)) {
      throw new BadRequestException(`Invalid transition from ${campaign.status} to ${toStatus}`);
    }
    const updated = await this.repository.update(id, { status: toStatus });
    await this.repository.createStatusHistory(id, campaign.status, toStatus, userId, note);
    this.logger.log(`Campaign ${id} transitioned from ${campaign.status} to ${toStatus}`);
    return updated;
  }

  async submit(id: string, userId: string) {
    return this.transitionStatus(id, userId, CampaignStatus.pending_review, 'Submitted for review');
  }

  async activate(id: string, userId: string) {
    return this.transitionStatus(id, userId, CampaignStatus.active, 'Campaign activated');
  }

  async pause(id: string, userId: string) {
    return this.transitionStatus(id, userId, CampaignStatus.paused, 'Campaign paused');
  }

  async resume(id: string, userId: string) {
    return this.transitionStatus(id, userId, CampaignStatus.active, 'Campaign resumed');
  }

  async archive(id: string, userId: string) {
    return this.transitionStatus(id, userId, CampaignStatus.archived, 'Campaign archived');
  }

  async getStatusHistory(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.repository.getStatusHistory(id);
  }
}
