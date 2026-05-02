// Requirement 19: API Key Guard for third-party authentication
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ApiKeyService } from '../../modules/auth/api-key.service.js';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly apiKeyService: ApiKeyService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractApiKey(request);

    if (!apiKey) {
      throw new UnauthorizedException('API key is required');
    }

    // Requirement 19.8: Validate API key
    const validation = await this.apiKeyService.validate(apiKey);

    if (!validation) {
      throw new UnauthorizedException('Invalid or expired API key');
    }

    // Attach user info to request
    request.user = {
      id: validation.userId,
      scopes: validation.scopes,
      authType: 'api_key',
    };

    // Check required scopes if specified
    const requiredScopes = this.reflector.get<string[]>('scopes', context.getHandler());
    if (requiredScopes && requiredScopes.length > 0) {
      const hasScope = requiredScopes.some((scope) => validation.scopes.includes(scope));
      if (!hasScope) {
        throw new UnauthorizedException('Insufficient API key permissions');
      }
    }

    return true;
  }

  private extractApiKey(request: any): string | null {
    // Check Authorization header: "Bearer vsk_..."
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check X-API-Key header
    const apiKeyHeader = request.headers['x-api-key'];
    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    return null;
  }
}
