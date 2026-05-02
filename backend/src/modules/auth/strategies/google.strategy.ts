import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { Role } from '@prisma/client';

/**
 * Google OAuth 2.0 strategy.
 * Handles authentication via Google and delegates user handling to AuthService.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL') ?? '',
      scope: ['email', 'profile'],
    });
  }

  // passport-google-oauth20 returns the profile object after successful authentication.
  // We extract the essential fields and let AuthService create/find the user.
  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const email = profile?.emails?.[0]?.value;
      if (!email) {
        return done(new UnauthorizedException('Google account email not available'), undefined);
      }

      const providerId = profile.id;
      const firstName = profile?.name?.givenName ?? undefined;
      const lastName = profile?.name?.familyName ?? undefined;

      // AuthService will handle linking/creating the user and return the user entity.
      const user = await this.authService.validateOAuthLogin(
        'google',
        providerId,
        email,
        firstName,
        lastName,
      );
      // Return minimal user payload for the request.
      return done(null, { id: user.id, email: user.email, role: user.role } as const);
    } catch (err) {
      return done(err as any, undefined);
    }
  }
}
