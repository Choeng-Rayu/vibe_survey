// Req 16: Notification endpoints
import { Controller, Get, Post, Put, Delete, Param, Query, Body, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { TemplateService } from './template.service.js';
import { SendNotificationDto } from './dto/notification.dto.js';
import { CreateTemplateDto, UpdateTemplateDto } from './dto/notification-template.dto.js';

@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly templateService: TemplateService,
  ) {}

  // POST /api/v1/notifications/send
  @Post('send')
  sendNotification(@Body() dto: SendNotificationDto) {
    return this.notificationsService.send(dto);
  }

  // GET /api/v1/notifications
  @Get()
  getUserNotifications(@Request() req: any, @Query('skip') skip?: string, @Query('take') take?: string) {
    return this.notificationsService.getUserNotifications(req.user.id, {
      skip: Number(skip ?? 0),
      take: Number(take ?? 20),
    });
  }

  // PUT /api/v1/notifications/:id/read
  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }

  // GET /api/v1/notifications/templates
  @Get('templates')
  listTemplates() {
    return this.templateService.findAll();
  }

  // POST /api/v1/notifications/templates
  @Post('templates')
  createTemplate(@Body() dto: CreateTemplateDto) {
    return this.templateService.create(dto);
  }

  // PUT /api/v1/notifications/templates/:id
  @Put('templates/:id')
  updateTemplate(@Param('id') id: string, @Body() dto: UpdateTemplateDto) {
    return this.templateService.update(id, dto);
  }

  // DELETE /api/v1/notifications/templates/:id
  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string) {
    return this.templateService.delete(id);
  }
}
