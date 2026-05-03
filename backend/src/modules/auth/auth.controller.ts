import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { MfaService } from './mfa.service';
import { RegisterDto, LoginDto, RefreshTokenDto } from './dto';
import { MfaVerifyDto, MfaEnableDto } from './dto/mfa.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';

// Requirement 3: Authentication endpoints
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mfaService: MfaService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@CurrentUser('userId') userId: string) {
    return this.authService.getCurrentUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/enable')
  async setupMfa(@CurrentUser('userId') userId: string, @CurrentUser('email') email: string) {
    return this.mfaService.generateMfaSecret(userId, email);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/verify')
  async enableMfa(@CurrentUser('userId') userId: string, @Body() dto: MfaEnableDto) {
    const backupCodes = await this.mfaService.enableMfa(userId, dto.token);
    return { message: 'MFA enabled', backupCodes };
  }

  @UseGuards(JwtAuthGuard)
  @Post('mfa/disable')
  async disableMfa(@CurrentUser('userId') userId: string) {
    await this.mfaService.disableMfa(userId);
    return { message: 'MFA disabled' };
  }

  // Google OAuth endpoints
  @Public()
  @Get('oauth/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {
    // Initiates Google OAuth flow; Passport handles redirect
  }

  @Public()
  @Get('oauth/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request) {
    const user = req.user as any;
    const tokens = await this.authService.issueTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  }

  @Public()
  @Post('oauth/callback')
  async oauthCallback(@Req() req: Request) {
    const user = req.user as any;
    if (!user) {
      throw new UnauthorizedException('No OAuth user info');
    }
    const tokens = await this.authService.issueTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  }

  // Telegram OAuth endpoint (via Telegram Login widget)
  @Public()
  @Get('oauth/telegram')
  async telegramLogin(@Query() query: Record<string, string>) {
    const user = await this.authService.validateTelegramLogin(query);
    const tokens = await this.authService.issueTokens(user.id, user.email, user.role);
    return { user: { id: user.id, email: user.email, role: user.role }, ...tokens };
  }
}
