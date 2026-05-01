import { Controller, Post, Body, UseGuards, Get, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { VerifyEmailDto, VerifyPhoneDto } from './dto/verification.dto';
import { UpdateProfileDto } from './dto/profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser('userId') userId: string) {
    return this.usersService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile')
  updateProfile(@CurrentUser('userId') userId: string, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify/email/send')
  sendEmailVerification(@CurrentUser('userId') userId: string) {
    return this.usersService.sendEmailVerification(userId);
  }

  @Public()
  @Post('verify/email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.usersService.verifyEmail(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify/phone/send')
  sendPhoneVerification(@CurrentUser('userId') userId: string) {
    return this.usersService.sendPhoneVerification(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify/phone')
  verifyPhone(@CurrentUser('userId') userId: string, @Body() dto: VerifyPhoneDto) {
    return this.usersService.verifyPhone(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('trust-tier')
  getTrustTier(@CurrentUser('userId') userId: string) {
    return this.usersService.getTrustTier(userId);
  }
}
