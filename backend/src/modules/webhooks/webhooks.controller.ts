// Req 22: Webhook management endpoints
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WebhooksService } from './webhooks.service.js';
import { WebhookDeliveryService } from './webhook-delivery.service.js';
import { CreateWebhookDto, UpdateWebhookDto } from './dto/webhook.dto.js';

@Controller('api/v1/webhooks')
export class WebhooksController {
  constructor(
    private readonly webhooksService: WebhooksService,
    private readonly deliveryService: WebhookDeliveryService,
  ) {}

  @Post('register')
  create(@Request() req: any, @Body() dto: CreateWebhookDto) {
    return this.webhooksService.create(req.user.id, dto);
  }

  @Get()
  findAll(@Request() req: any) {
    return this.webhooksService.findAll(req.user.id);
  }

  @Put(':id')
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateWebhookDto) {
    return this.webhooksService.update(id, req.user.id, dto);
  }

  @Delete(':id')
  remove(@Request() req: any, @Param('id') id: string) {
    return this.webhooksService.remove(id, req.user.id);
  }

  @Post(':id/test')
  async test(@Request() req: any, @Param('id') id: string) {
    const webhook = await this.webhooksService.findOne(id, req.user.id);
    if (!webhook) throw new Error('Webhook not found');

    await this.deliveryService.deliver(id, 'test', { message: 'Test webhook delivery' });
    return { success: true };
  }

  @Get(':id/deliveries')
  getDeliveries(@Param('id') id: string) {
    return this.deliveryService.getDeliveries(id);
  }
}
