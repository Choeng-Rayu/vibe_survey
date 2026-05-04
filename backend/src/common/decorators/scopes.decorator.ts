// Requirement 19: Scopes decorator for API key permissions
import { SetMetadata } from '@nestjs/common';

export const Scopes = (...scopes: string[]) => SetMetadata('scopes', scopes);
