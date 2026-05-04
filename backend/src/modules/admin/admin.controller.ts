// Req 14: Admin Management endpoints
import { Controller, Get, Post, Put, Delete, Param, Query, Body, Request } from '@nestjs/common';
import { AdminService } from './admin.service.js';
import { ApprovalWorkflowService } from './approval-workflow.service.js';
import { ModerationService } from './moderation.service.js';
import { UserManagementService } from './user-management.service.js';
import { AuditService } from '../../common/audit/audit.service.js';
import { FeatureToggleService } from '../../common/feature-toggles/feature-toggle.service.js';
import { CampaignReviewDto, BulkReviewDto, ReviewAction } from './dto/campaign-review.dto.js';
import { ModerationActionDto, FlagContentDto } from './dto/moderation-action.dto.js';
import { BulkUserActionDto, UserExportDto } from './dto/user-moderation.dto.js';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly approvalWorkflow: ApprovalWorkflowService,
    private readonly moderation: ModerationService,
    private readonly userManagement: UserManagementService,
    private readonly auditService: AuditService,
    private readonly featureToggleService: FeatureToggleService,
  ) {}

  // ── Campaign Review ──────────────────────────────────────────────────────────

  // GET /api/v1/admin/campaigns/review-queue
  @Get('campaigns/review-queue')
  getReviewQueue(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.approvalWorkflow.getReviewQueue({
      skip: Number(skip ?? 0),
      take: Number(take ?? 20),
    });
  }

  // POST /api/v1/admin/campaigns/:id/approve
  @Post('campaigns/:id/approve')
  approveCampaign(@Param('id') id: string, @Request() req: any, @Body() dto: CampaignReviewDto) {
    return this.approvalWorkflow.approveCampaign(id, req.user.id, dto.note);
  }

  // POST /api/v1/admin/campaigns/:id/reject
  @Post('campaigns/:id/reject')
  rejectCampaign(@Param('id') id: string, @Request() req: any, @Body() dto: CampaignReviewDto) {
    return this.approvalWorkflow.rejectCampaign(id, req.user.id, dto.note);
  }

  // POST /api/v1/admin/campaigns/:id/request-revision
  @Post('campaigns/:id/request-revision')
  requestRevision(@Param('id') id: string, @Request() req: any, @Body() dto: CampaignReviewDto) {
    return this.approvalWorkflow.requestRevision(id, req.user.id, dto.note);
  }

  // POST /api/v1/admin/campaigns/bulk-review
  @Post('campaigns/bulk-review')
  bulkReview(@Request() req: any, @Body() dto: BulkReviewDto) {
    return this.approvalWorkflow.bulkReview(dto.campaign_ids, req.user.id, dto.action, dto.note);
  }

  // ── Content Moderation ───────────────────────────────────────────────────────

  // GET /api/v1/admin/moderation/queue
  @Get('moderation/queue')
  getModerationQueue(@Query('skip') skip?: string, @Query('take') take?: string) {
    return this.moderation.getModerationQueue({
      skip: Number(skip ?? 0),
      take: Number(take ?? 20),
    });
  }

  // POST /api/v1/admin/moderation/:id/action
  @Post('moderation/:id/action')
  takeModerationAction(
    @Param('id') id: string,
    @Request() req: any,
    @Body() dto: ModerationActionDto,
  ) {
    return this.moderation.takeAction(id, req.user.id, dto.action, dto.note);
  }

  // GET /api/v1/admin/moderation/reports
  @Get('moderation/reports')
  getModerationReports() {
    return this.moderation.getModerationReports();
  }

  // POST /api/v1/admin/moderation/flag
  @Post('moderation/flag')
  flagContent(@Request() req: any, @Body() dto: FlagContentDto) {
    return this.moderation.flagContent(req.user.id, dto);
  }

  // ── User Management ──────────────────────────────────────────────────────────

  // GET /api/v1/admin/users
  @Get('users')
  listUsers(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.listUsers({
      skip: Number(skip ?? 0),
      take: Number(take ?? 20),
      search,
    });
  }

  // GET /api/v1/admin/users/:id
  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  // POST /api/v1/admin/users/:id/suspend
  @Post('users/:id/suspend')
  suspendUser(@Param('id') id: string, @Request() req: any, @Body('reason') reason: string) {
    return this.adminService.suspendUser(id, req.user.id, reason);
  }

  // POST /api/v1/admin/users/:id/ban
  @Post('users/:id/ban')
  banUser(@Param('id') id: string, @Request() req: any, @Body('reason') reason: string) {
    return this.adminService.banUser(id, req.user.id, reason);
  }

  // DELETE /api/v1/admin/users/:id/ban
  @Delete('users/:id/ban')
  unbanUser(@Param('id') id: string, @Request() req: any) {
    return this.adminService.unbanUser(id, req.user.id);
  }

  // POST /api/v1/admin/users/bulk-action (Req 14.7)
  @Post('users/bulk-action')
  bulkUserAction(@Request() req: any, @Body() dto: BulkUserActionDto) {
    return this.userManagement.bulkUserAction(dto.user_ids, req.user.id, dto.action, dto.reason);
  }

  // POST /api/v1/admin/users/export (Req 14.3)
  @Post('users/export')
  exportUsers(@Body() dto: UserExportDto) {
    return this.userManagement.exportUsers(dto.user_ids, dto.format);
  }

  // POST /api/v1/admin/users/:id/recover (Req 14.3)
  @Post('users/:id/recover')
  recoverAccount(@Param('id') id: string, @Request() req: any) {
    return this.userManagement.recoverAccount(id, req.user.id);
  }

  // ── Audit Logs ───────────────────────────────────────────────────────────────

  // GET /api/v1/admin/audit-logs
  @Get('audit-logs')
  getAuditLogs(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('entity_type') entity_type?: string,
    @Query('action') action?: string,
  ) {
    return this.adminService.getAuditLogs({
      skip: Number(skip ?? 0),
      take: Number(take ?? 50),
      entity_type,
      action,
    });
  }

  @Get('audit-logs/search')
  searchAuditLogs(
    @Query('skip') skip?: string,
    @Query('take') take?: string,
    @Query('entity_type') entity_type?: string,
    @Query('entity_id') entity_id?: string,
    @Query('action') action?: string,
    @Query('user_id') user_id?: string,
  ) {
    return this.auditService.search({
      skip: Number(skip ?? 0),
      take: Number(take ?? 50),
      entity_type,
      entity_id,
      action,
      user_id,
    });
  }

  @Get('audit-logs/export')
  exportAuditLogs(@Query('entity_type') entity_type?: string, @Query('action') action?: string) {
    return this.auditService.export({ entity_type, action });
  }

  @Get('config/platform')
  getPlatformConfig() {
    return {
      api_version: '1.0',
      default_locale: 'en',
      supported_locales: ['en', 'km'],
      payouts: { providers: ['aba_pay', 'wing', 'true_money', 'bakong'] },
    };
  }

  @Put('config/platform')
  updatePlatformConfig(@Body() body: Record<string, unknown>) {
    return { updated: true, config: body };
  }

  @Get('config/features')
  getFeatureFlags() {
    return this.featureToggleService.list();
  }

  @Put('config/features/:feature')
  updateFeatureFlag(
    @Param('feature') feature: string,
    @Request() req: any,
    @Body() dto: { is_enabled: boolean; description?: string; rollout_pct?: number },
  ) {
    return this.featureToggleService.upsert(feature, dto, req.user?.id);
  }
}
