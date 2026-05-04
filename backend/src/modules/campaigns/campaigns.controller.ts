import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { BudgetService } from './budget.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { UpdateBudgetDto, TopUpBudgetDto } from './dto/budget-settings.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CampaignStatus } from '@prisma/client';

// Requirement 8: Campaign Management Module
@Controller('campaigns')
@UseGuards(JwtAuthGuard)
export class CampaignsController {
  constructor(
    private readonly campaignsService: CampaignsService,
    private readonly budgetService: BudgetService,
  ) {}

  @Post()
  create(@Request() req: any, @Body() dto: CreateCampaignDto) {
    return this.campaignsService.create(req.user.sub, dto);
  }

  @Get()
  findAll(
    @Request() req: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
    @Query('status') status?: CampaignStatus,
  ) {
    return this.campaignsService.findAll(req.user.sub, {
      skip: skip ? parseInt(skip) : undefined,
      take: take ? parseInt(take) : undefined,
      search,
      status,
    });
  }

  @Get(':id')
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService.findOne(id, req.user.sub);
  }

  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateCampaignDto) {
    return this.campaignsService.update(id, req.user.sub, dto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService.remove(id, req.user.sub);
  }

  @Post(':id/duplicate')
  duplicate(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService.duplicate(id, req.user.sub);
  }

  @Post(':id/submit')
  submit(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService.submit(id, req.user.sub);
  }

  @Post(':id/activate')
  activate(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService.activate(id, req.user.sub);
  }

  @Post(':id/pause')
  pause(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService.pause(id, req.user.sub);
  }

  @Post(':id/resume')
  resume(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService.resume(id, req.user.sub);
  }

  @Post(':id/archive')
  archive(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService.archive(id, req.user.sub);
  }

  @Get(':id/status')
  getStatus(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService.findOne(id, req.user.sub).then((c) => ({ status: c.status }));
  }

  @Get(':id/history')
  getHistory(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService.getStatusHistory(id, req.user.sub);
  }

  // Requirement 8.6: Budget Management
  @Get(':id/budget')
  getBudget(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService
      .findOne(id, req.user.sub)
      .then(() => this.budgetService.getBudget(id));
  }

  @Put(':id/budget')
  updateBudget(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateBudgetDto) {
    return this.campaignsService
      .findOne(id, req.user.sub)
      .then(() =>
        this.budgetService.updateBudget(id, dto.budget_total, dto.cpr, dto.max_responses),
      );
  }

  @Post(':id/budget/topup')
  topUpBudget(@Request() req: any, @Param('id') id: string, @Body() dto: TopUpBudgetDto) {
    return this.campaignsService
      .findOne(id, req.user.sub)
      .then(() => this.budgetService.topUpBudget(id, dto.amount));
  }

  @Get(':id/budget/alerts')
  getBudgetAlerts(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService
      .findOne(id, req.user.sub)
      .then(() => this.budgetService.getBudgetAlerts(id));
  }

  @Get(':id/budget/forecast')
  forecastBudget(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService
      .findOne(id, req.user.sub)
      .then(() => this.budgetService.forecastBudget(id));
  }

  @Post(':id/budget/reconcile')
  reconcileBudget(@Request() req: any, @Param('id') id: string) {
    return this.campaignsService
      .findOne(id, req.user.sub)
      .then(() => this.budgetService.reconcileBudget(id));
  }
}
