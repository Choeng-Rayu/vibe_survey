import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { FilesService } from './files.service.js';
import { FileUploadDto } from './dto/file-upload.dto.js';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: FileUploadDto,
    @CurrentUser() user: any,
  ) {
    return this.filesService.upload(
      {
        ...dto,
        filename: file.filename || file.originalname,
        originalName: file.originalname,
        mimetype: file.mimetype,
      },
      file.buffer,
      user.id,
    );
  }

  @Get(':id')
  async getFile(@Param('id') id: string) {
    return this.filesService.findOne(id);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string, @CurrentUser() user: any) {
    return this.filesService.delete(id, user.id);
  }

  @Get(':id/metadata')
  async getMetadata(@Param('id') id: string) {
    return this.filesService.getMetadata(id);
  }

  @Get('temporary/:id/url')
  async getTemporaryUrl(@Param('id') id: string) {
    return this.filesService.getTemporaryUrl(id);
  }
}
