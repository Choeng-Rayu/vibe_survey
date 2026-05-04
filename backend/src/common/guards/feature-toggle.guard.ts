import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { FeatureToggleService } from '../feature-toggles/feature-toggle.service';

export const FEATURE_TOGGLE_KEY = 'featureToggle';
export const RequiresFeature = (featureName: string) =>
  SetMetadata(FEATURE_TOGGLE_KEY, featureName);

@Injectable()
export class FeatureToggleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly featureToggleService: FeatureToggleService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const featureName = this.reflector.getAllAndOverride<string>(FEATURE_TOGGLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!featureName) return true;

    const request = context.switchToHttp().getRequest<{ user?: { id?: string } }>();
    const enabled = await this.featureToggleService.isEnabled(featureName, request.user?.id);
    if (!enabled) throw new NotFoundException('Feature is not enabled');
    return true;
  }
}
