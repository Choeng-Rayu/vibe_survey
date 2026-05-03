import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { OAuthServerService } from './oauth-server.service';
import { AuthorizeOAuthDto, OAuthTokenDto, RegisterOAuthClientDto } from './dto/oauth-client.dto';
import { Public } from './decorators/public.decorator';

@Controller('integration/oauth')
export class OAuthServerController {
  constructor(private readonly oauthServerService: OAuthServerService) {}

  @Post('clients')
  registerClient(@Request() req: any, @Body() dto: RegisterOAuthClientDto) {
    return this.oauthServerService.registerClient(req.user.id, dto);
  }

  @Get('clients')
  listClients(@Request() req: any) {
    return this.oauthServerService.listClients(req.user.id);
  }

  @Post('authorize')
  authorize(@Request() req: any, @Body() dto: AuthorizeOAuthDto) {
    return this.oauthServerService.authorize(req.user.id, dto);
  }

  @Public()
  @Post('token')
  token(@Body() dto: OAuthTokenDto) {
    return this.oauthServerService.token(dto);
  }
}
