import { Injectable } from '@nestjs/common';
import { AuthService } from '../modules/auth/auth.service';
import { Profile } from 'passport-google-oauth20';

/**
 * Service handling OAuth user lookup/creation and account linking.
 * Delegates to AuthService.validateOAuthLogin for persistence.
 */
@Injectable()
export class OAuthService {
  constructor(private readonly authService: AuthService) {}

  /**
   * Find an existing user by Google profile or create a new one.
   * Links the OAuth provider to the user account.
   */
  async findOrCreateOAuthUser(profile: Profile) {
    const provider = 'google';
    const providerId = profile.id;
    const email = profile.emails?.[0]?.value;
    const firstName = profile.name?.givenName;
    const lastName = profile.name?.familyName;
    if (!email) {
      // In practice, email should always be present with scope 'email'.
      throw new Error('OAuth profile does not contain email');
    }
    return this.authService.validateOAuthLogin(provider, providerId, email, firstName, lastName);
  }
}
