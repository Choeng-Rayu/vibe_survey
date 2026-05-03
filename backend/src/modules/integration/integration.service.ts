import { Injectable } from '@nestjs/common';
import { ApiKeyService } from '../auth/api-key.service';
import { OAuthServerService } from '../auth/oauth-server.service';
import { CreateApiKeyDto } from '../auth/dto/api-key.dto';
import {
  AuthorizeOAuthDto,
  OAuthTokenDto,
  RegisterOAuthClientDto,
} from '../auth/dto/oauth-client.dto';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly oauthServerService: OAuthServerService,
  ) {}

  createApiKey(userId: string, dto: CreateApiKeyDto) {
    return this.apiKeyService.create(userId, dto);
  }

  listApiKeys(userId: string) {
    return this.apiKeyService.findAll(userId);
  }

  revokeApiKey(userId: string, apiKeyId: string) {
    return this.apiKeyService.revoke(apiKeyId, userId);
  }

  rotateApiKey(userId: string, apiKeyId: string, dto: CreateApiKeyDto) {
    return this.apiKeyService.rotate(userId, apiKeyId, dto);
  }

  registerOAuthClient(userId: string, dto: RegisterOAuthClientDto) {
    return this.oauthServerService.registerClient(userId, dto);
  }

  listOAuthClients(userId: string) {
    return this.oauthServerService.listClients(userId);
  }

  authorizeOAuth(userId: string, dto: AuthorizeOAuthDto) {
    return this.oauthServerService.authorize(userId, dto);
  }

  exchangeOAuthToken(dto: OAuthTokenDto) {
    return this.oauthServerService.token(dto);
  }

  listPaymentProviders() {
    return {
      providers: ['bakong', 'aba_pay', 'wing', 'true_money', 'manual_bank', 'mock_card'],
      default_provider: 'bakong',
    };
  }

  configurePaymentProvider(userId: string, payload: Record<string, unknown>) {
    return { configured_by: userId, status: 'configured', provider: payload['provider'] };
  }

  configureAiService(userId: string, payload: Record<string, unknown>) {
    return { configured_by: userId, status: 'configured', provider: payload['provider'] };
  }

  getAiServiceStatus() {
    return {
      status: 'operational',
      providers: [{ name: 'primary', status: 'available' }],
      checked_at: new Date().toISOString(),
    };
  }
}
