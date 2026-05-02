import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { RegisterDto, LoginDto } from './dto';

// Requirement 3: Authentication and Authorization System
@Injectable()
export class AuthService {
  // Handles OAuth logins (e.g., Google, Telegram)
  async validateOAuthLogin(
    provider: string,
    providerId: string,
    email: string,
    firstName?: string,
    lastName?: string,
  ) {
    // Find existing OAuth linking
    const existingLink = await this.prisma.oAuthAccount.findUnique({
      where: {
        provider_provider_id: {
          provider,
          provider_id: providerId,
        },
      },
      include: { user: true },
    });
    if (existingLink && existingLink.user) {
      return existingLink.user;
    }

    // No link; try to find user by email
    let user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Create new user with default role
      user = await this.prisma.user.create({
        data: {
          email,
          role: Role.survey_taker,
        },
      });
      // Create a profile record (optional name extraction)
      await this.prisma.profile.create({
        data: {
          user_id: user.id,
          first_name: firstName,
          last_name: lastName,
        },
      });
    }

    // Create OAuthAccount linking
    await this.prisma.oAuthAccount.create({
      data: {
        user_id: user.id,
        provider,
        provider_id: providerId,
      },
    });
    return user;
  }

  private readonly logger = new Logger(AuthService.name);
  private readonly saltRounds = 10;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, role, phone, deviceFingerprint } = registerDto;
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('User already exists');

    const user = await this.prisma.user.create({
      data: {
        email,
        password_hash: await this.hashPassword(password),
        role,
        phone,
        device_fingerprint: deviceFingerprint,
      },
    });

    await this.prisma.profile.create({
      data: {
        user_id: user.id,
        first_name: name.split(' ')[0],
        last_name: name.split(' ').slice(1).join(' ') || null,
      },
    });

    this.logger.log(`User registered: ${email}`);
    return {
      user: { id: user.id, email: user.email, role: user.role },
      message: 'Registration successful',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password, deviceFingerprint } = loginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      this.logger.warn(`Failed login: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    if (deviceFingerprint) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: { device_fingerprint: deviceFingerprint, last_login_at: new Date() },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);
    this.logger.log(`User logged in: ${email}`);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException('User not found');
      return this.generateTokens(user.id, user.email, user.role);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user?.password_hash) return null;
    const valid = await bcrypt.compare(password, user.password_hash);
    return valid ? user : null;
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Public wrapper for token generation used by OAuth flows.
   */
  async issueTokens(userId: string, email: string, role: Role) {
    return this.generateTokens(userId, email, role);
  }

  /**
   * Verify Telegram login data and return (or create) the associated user.
   * @param authData Query parameters received from Telegram login widget.
   */
  async validateTelegramLogin(authData: Record<string, string>) {
    const hash = authData['hash'];
    if (!hash) {
      throw new UnauthorizedException('Missing Telegram hash');
    }
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) {
      throw new UnauthorizedException('Telegram bot token not configured');
    }
    const secretKey = crypto.createHash('sha256').update(token).digest();
    const dataCheckString = Object.entries(authData)
      .filter(([k]) => k !== 'hash')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('\n');
    const calculatedHash = crypto
      .createHmac('sha256', secretKey)
      .update(dataCheckString)
      .digest('hex');
    if (calculatedHash !== hash) {
      throw new UnauthorizedException('Invalid Telegram auth data');
    }
    // Optional: check auth_date freshness (max 1 day)
    const authDate = Number(authData['auth_date'] ?? '0');
    if (Date.now() / 1000 - authDate > 86400) {
      throw new UnauthorizedException('Telegram auth data is outdated');
    }
    const providerId = authData['id'];
    const email = `${providerId}@telegram`; // placeholder email
    const firstName = authData['first_name'];
    const lastName = authData['last_name'];
    return this.validateOAuthLogin('telegram', providerId, email, firstName, lastName);
  }

  private async generateTokens(userId: string, email: string, role: Role) {
    const payload = { sub: userId, email, role: role as string };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.accessExpiration') || '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('jwt.refreshSecret'),
        expiresIn: this.configService.get('jwt.refreshExpiration') || '7d',
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async getCurrentUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, is_email_verified: true },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }
}
