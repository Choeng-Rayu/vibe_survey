// Requirement 19: API Key Management Controller
import { Controller, Post, Get, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto, ApiKeyResponseDto, ApiKeyWithSecretDto } from './dto/api-key.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/v1/integration/api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeyController {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  // Requirement 19.8: Create API key
  @Post()
  async create(@Request() req: any, @Body() dto: CreateApiKeyDto): Promise<ApiKeyWithSecretDto> {
    return this.apiKeyService.create(req.user.id, dto);
  }

  // List user's API keys
  @Get()
  async findAll(@Request() req: any): Promise<ApiKeyResponseDto[]> {
    return this.apiKeyService.findAll(req.user.id);
  }

  // Requirement 19.8: Revoke API key
  @Delete(':id')
  async revoke(@Request() req: any, @Param('id') id: string): Promise<{ message: string }> {
    await this.apiKeyService.revoke(req.user.id, id);
    return { message: 'API key revoked successfully' };
  }

  // Rotate API key
  @Post(':id/rotate')
  async rotate(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: CreateApiKeyDto,
  ): Promise<ApiKeyWithSecretDto> {
    return this.apiKeyService.rotate(req.user.id, id, dto);
  }
}
