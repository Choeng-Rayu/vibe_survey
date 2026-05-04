// Req 14: Admin Management Module
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { ApprovalWorkflowService } from './approval-workflow.service.js';
import { ModerationService } from './moderation.service.js';
import { UserManagementService } from './user-management.service.js';
import { DatabaseModule } from '../../database/database.module.js';
import { CacheModule } from '../../common/cache/cache.module.js';
import { AuditService } from '../../common/audit/audit.service.js';
import { FeatureToggleService } from '../../common/feature-toggles/feature-toggle.service.js';

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [AdminController],
  providers: [
    AdminService,
    ApprovalWorkflowService,
    ModerationService,
    UserManagementService,
    AuditService,
    FeatureToggleService,
  ],
  exports: [
    AdminService,
    ApprovalWorkflowService,
    ModerationService,
    UserManagementService,
    AuditService,
    FeatureToggleService,
  ],
})
export class AdminModule {}
