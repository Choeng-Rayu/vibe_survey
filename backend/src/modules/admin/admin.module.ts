// Req 14: Admin Management Module
import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { ApprovalWorkflowService } from './approval-workflow.service.js';
import { ModerationService } from './moderation.service.js';
import { UserManagementService } from './user-management.service.js';
import { DatabaseModule } from '../../database/database.module.js';

@Module({
  imports: [DatabaseModule],
  controllers: [AdminController],
  providers: [AdminService, ApprovalWorkflowService, ModerationService, UserManagementService],
  exports: [AdminService, ApprovalWorkflowService, ModerationService, UserManagementService],
})
export class AdminModule {}
