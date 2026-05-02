import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { VerifyEmailDto, VerifyPhoneDto } from './dto/verification.dto';
import { UpdateProfileDto } from './dto/profile.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private verificationTokens = new Map<string, string>();
  private phoneOtps = new Map<string, string>();

  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return { user: { id: user.id, email: user.email, role: user.role }, profile: user.profile };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const profile = await this.prisma.profile.upsert({
      where: { user_id: userId },
      create: { user_id: userId, ...dto },
      update: dto,
    });

    this.logger.log(`Profile updated for user: ${userId}`);
    return profile;
  }

  async sendEmailVerification(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.is_email_verified) throw new BadRequestException('Email already verified');

    const token = Math.random().toString(36).substring(2, 15);
    this.verificationTokens.set(token, userId);
    this.logger.log(`Email verification sent to user: ${userId}`);
    return { message: 'Verification email sent', token };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const userId = this.verificationTokens.get(dto.token);
    if (!userId) throw new BadRequestException('Invalid verification token');

    await this.prisma.user.update({ where: { id: userId }, data: { is_email_verified: true } });
    this.verificationTokens.delete(dto.token);
    this.logger.log(`Email verified for user: ${userId}`);
    return { message: 'Email verified' };
  }

  async sendPhoneVerification(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    if (user.is_phone_verified) throw new BadRequestException('Phone already verified');
    if (!user.phone) throw new BadRequestException('Phone number not set');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    this.phoneOtps.set(userId, otp);
    this.logger.log(`Phone OTP sent to user: ${userId}`);
    return { message: 'OTP sent', otp };
  }

  async verifyPhone(userId: string, dto: VerifyPhoneDto) {
    const storedOtp = this.phoneOtps.get(userId);
    if (!storedOtp || storedOtp !== dto.otp) throw new BadRequestException('Invalid OTP');

    await this.prisma.user.update({ where: { id: userId }, data: { is_phone_verified: true } });
    this.phoneOtps.delete(userId);
    this.logger.log(`Phone verified for user: ${userId}`);
    return { message: 'Phone verified' };
  }

  async getTrustTier(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return { trustTier: user.trust_tier, trustScore: user.trust_score };
  }

  async updateTrustScore(userId: string, score: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const newScore = Math.max(0, Math.min(100, user.trust_score + score));
    let tier = user.trust_tier;

    if (newScore >= 80) tier = 'platinum';
    else if (newScore >= 60) tier = 'gold';
    else if (newScore >= 40) tier = 'silver';
    else tier = 'bronze';

    await this.prisma.user.update({
      where: { id: userId },
      data: { trust_score: newScore, trust_tier: tier },
    });
    this.logger.log(`Trust score updated for user: ${userId} - ${tier} (${newScore})`);
    return { trustTier: tier, trustScore: newScore };
  }
}
