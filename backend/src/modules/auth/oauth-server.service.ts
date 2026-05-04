import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'crypto';
import { AuthorizeOAuthDto, RegisterOAuthClientDto } from './dto/oauth-client.dto';

interface OAuthClientRecord {
  client_id: string;
  client_secret: string;
  name: string;
  redirect_uri: string;
  scopes: string[];
  owner_id: string;
  created_at: Date;
}

interface OAuthCodeRecord {
  client_id: string;
  user_id: string;
  scopes: string[];
  redirect_uri: string;
  expires_at: Date;
}

@Injectable()
export class OAuthServerService {
  private readonly clients = new Map<string, OAuthClientRecord>();
  private readonly codes = new Map<string, OAuthCodeRecord>();
  private readonly refreshTokens = new Map<string, OAuthCodeRecord>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  registerClient(ownerId: string, dto: RegisterOAuthClientDto) {
    const client = {
      client_id: `vso_${randomBytes(16).toString('hex')}`,
      client_secret: `vss_${randomBytes(32).toString('hex')}`,
      name: dto.name,
      redirect_uri: dto.redirect_uri,
      scopes: dto.scopes,
      owner_id: ownerId,
      created_at: new Date(),
    };
    this.clients.set(client.client_id, client);
    return client;
  }

  listClients(ownerId: string) {
    return Array.from(this.clients.values())
      .filter((client) => client.owner_id === ownerId)
      .map(({ client_secret: _secret, ...client }) => client);
  }

  authorize(userId: string, dto: AuthorizeOAuthDto) {
    const client = this.validateClient(dto.client_id, dto.redirect_uri);
    const requestedScopes = dto.scopes.filter((scope) => client.scopes.includes(scope));
    if (requestedScopes.length !== dto.scopes.length) {
      throw new UnauthorizedException('Requested OAuth scope is not allowed for this client');
    }

    const code = randomBytes(32).toString('hex');
    this.codes.set(code, {
      client_id: client.client_id,
      user_id: userId,
      scopes: requestedScopes,
      redirect_uri: dto.redirect_uri,
      expires_at: new Date(Date.now() + 10 * 60 * 1000),
    });

    return { code, state: dto.state, expires_in: 600 };
  }

  async token(dto: {
    grant_type: 'authorization_code' | 'refresh_token';
    code?: string;
    refresh_token?: string;
    client_id: string;
    client_secret: string;
  }) {
    const client = this.clients.get(dto.client_id);
    if (!client || client.client_secret !== dto.client_secret) {
      throw new UnauthorizedException('Invalid OAuth client credentials');
    }

    const grant =
      dto.grant_type === 'refresh_token'
        ? this.consumeRefreshGrant(dto.refresh_token)
        : this.consumeAuthorizationCode(dto.code);

    if (grant.client_id !== client.client_id) {
      throw new UnauthorizedException('OAuth grant does not belong to this client');
    }

    return this.issueOAuthTokens(grant);
  }

  private validateClient(clientId: string, redirectUri: string) {
    const client = this.clients.get(clientId);
    if (!client || client.redirect_uri !== redirectUri) {
      throw new UnauthorizedException('Invalid OAuth client or redirect URI');
    }
    return client;
  }

  private consumeAuthorizationCode(code?: string) {
    if (!code) throw new UnauthorizedException('Authorization code is required');
    const grant = this.codes.get(code);
    this.codes.delete(code);
    if (!grant || grant.expires_at < new Date()) {
      throw new UnauthorizedException('Invalid or expired authorization code');
    }
    return grant;
  }

  private consumeRefreshGrant(refreshToken?: string) {
    if (!refreshToken) throw new UnauthorizedException('Refresh token is required');
    const grant = this.refreshTokens.get(refreshToken);
    if (!grant) throw new UnauthorizedException('Invalid refresh token');
    return grant;
  }

  private async issueOAuthTokens(grant: OAuthCodeRecord) {
    const payload = {
      sub: grant.user_id,
      aud: grant.client_id,
      scopes: grant.scopes,
      token_use: 'third_party_oauth',
    };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: '1h',
    });
    const refreshToken = randomBytes(32).toString('hex');
    this.refreshTokens.set(refreshToken, {
      ...grant,
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 3600,
      scope: grant.scopes.join(' '),
    };
  }
}
