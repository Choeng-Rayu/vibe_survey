import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';

// Requirement 3.6: MFA guard for protected endpoints
@Injectable()
export class MfaGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;
    if (!userId) throw new UnauthorizedException('User not authenticated');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.is_mfa_enabled && !request.user.mfaVerified) {
      throw new UnauthorizedException('MFA verification required');
    }
    return true;
  }
}
