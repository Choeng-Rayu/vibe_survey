import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';
import { PrismaService } from '../../database/prisma.service';

// Requirement 3.6: Multi-factor authentication with OTP verification
@Injectable()
export class MfaService {
  private readonly logger = new Logger(MfaService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateMfaSecret(userId: string, email: string) {
    const secret = speakeasy.generateSecret({ name: `Vibe Survey (${email})`, length: 32 });
    await this.prisma.user.update({ where: { id: userId }, data: { mfa_secret: secret.base32 } });
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);
    this.logger.log(`MFA secret generated for user: ${userId}`);
    return { secret: secret.base32, qrCode: qrCodeUrl };
  }

  async enableMfa(userId: string, token: string): Promise<string[]> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.mfa_secret) throw new BadRequestException('MFA secret not generated');

    const verified = speakeasy.totp.verify({ secret: user.mfa_secret, encoding: 'base32', token });
    if (!verified) throw new BadRequestException('Invalid OTP token');

    const backupCodes = Array.from({ length: 10 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase(),
    );
    await this.prisma.user.update({ where: { id: userId }, data: { is_mfa_enabled: true } });
    this.logger.log(`MFA enabled for user: ${userId}`);
    return backupCodes;
  }

  async disableMfa(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { is_mfa_enabled: false, mfa_secret: null },
    });
    this.logger.log(`MFA disabled for user: ${userId}`);
  }

  async verifyMfaToken(userId: string, token: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user?.is_mfa_enabled || !user.mfa_secret) return false;
    return speakeasy.totp.verify({ secret: user.mfa_secret, encoding: 'base32', token, window: 2 });
  }
}
