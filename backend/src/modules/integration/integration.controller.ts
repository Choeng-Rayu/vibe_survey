import { Body, Controller, Delete, Get, Param, Post, Request } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { CreateApiKeyDto } from '../auth/dto/api-key.dto';
import {
  AuthorizeOAuthDto,
  OAuthTokenDto,
  RegisterOAuthClientDto,
} from '../auth/dto/oauth-client.dto';
import { IntegrationService } from './integration.service';

@Controller('integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('api-keys')
  createApiKey(@Request() req: any, @Body() dto: CreateApiKeyDto) {
    return this.integrationService.createApiKey(req.user.id, dto);
  }

  @Get('api-keys')
  listApiKeys(@Request() req: any) {
    return this.integrationService.listApiKeys(req.user.id);
  }

  @Delete('api-keys/:id')
  revokeApiKey(@Request() req: any, @Param('id') id: string) {
    return this.integrationService.revokeApiKey(req.user.id, id);
  }

  @Post('api-keys/:id/rotate')
  rotateApiKey(@Request() req: any, @Param('id') id: string, @Body() dto: CreateApiKeyDto) {
    return this.integrationService.rotateApiKey(req.user.id, id, dto);
  }

  @Post('oauth/clients')
  registerOAuthClient(@Request() req: any, @Body() dto: RegisterOAuthClientDto) {
    return this.integrationService.registerOAuthClient(req.user.id, dto);
  }

  @Get('oauth/clients')
  listOAuthClients(@Request() req: any) {
    return this.integrationService.listOAuthClients(req.user.id);
  }

  @Post('oauth/authorize')
  authorizeOAuth(@Request() req: any, @Body() dto: AuthorizeOAuthDto) {
    return this.integrationService.authorizeOAuth(req.user.id, dto);
  }

  @Public()
  @Post('oauth/token')
  exchangeOAuthToken(@Body() dto: OAuthTokenDto) {
    return this.integrationService.exchangeOAuthToken(dto);
  }

  @Post('payment-providers')
  configurePaymentProvider(@Request() req: any, @Body() payload: Record<string, unknown>) {
    return this.integrationService.configurePaymentProvider(req.user.id, payload);
  }

  @Get('payment-providers')
  listPaymentProviders() {
    return this.integrationService.listPaymentProviders();
  }

  @Post('ai-services')
  configureAiService(@Request() req: any, @Body() payload: Record<string, unknown>) {
    return this.integrationService.configureAiService(req.user.id, payload);
  }

  @Get('ai-services/status')
  getAiServiceStatus() {
    return this.integrationService.getAiServiceStatus();
  }
}
