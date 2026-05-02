import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { ApiKeyController } from './api-key.controller';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { ApiKeyService } from './api-key.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { DatabaseModule } from '../../database/database.module';

// Requirement 3: Authentication Module
// Requirement 19: API Key Management
@Module({
  imports: [DatabaseModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController, ApiKeyController],
  providers: [
    AuthService,
    MfaService,
    ApiKeyService,
    JwtStrategy,
    RefreshTokenStrategy,
    GoogleStrategy,
  ],
  exports: [AuthService, MfaService, ApiKeyService],
})
export class AuthModule {}
