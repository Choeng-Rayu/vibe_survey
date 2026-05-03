import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { ApiKeyService } from './api-key.service';
import { OAuthServerService } from './oauth-server.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { GoogleStrategy } from '../../auth/strategies/oauth.strategy';
import { OAuthService } from '../../auth/oauth.service';
import { DatabaseModule } from '../../database/database.module';

// Requirement 3: Authentication Module
// Requirement 19: API Key Management
@Module({
  imports: [DatabaseModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    MfaService,
    ApiKeyService,
    OAuthServerService,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
    OAuthService,
  ],
  exports: [AuthService, MfaService, ApiKeyService, OAuthServerService],
})
export class AuthModule {}
