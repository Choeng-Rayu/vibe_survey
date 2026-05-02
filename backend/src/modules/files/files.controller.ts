// Req 24: File management endpoints
import { Controller, Post, Get, Delete, Param, Body, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service.js';
import { FileUploadDto } from './dto/file-upload.dto.js';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // POST /api/v1/files/upload
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Request() req: any, @UploadedFile() file: Express.Multer.File, @Body() dto: FileUploadDto) {
    return this.filesService.upload(
      req.user.id,
      file.originalname,
      file.buffer,
      file.mimetype,
      dto.storage_type,
      dto.is_temporary,
    );
  }

  // GET /api/v1/files/:id
  @Get(':id')
  getFileMetadata(@Param('id') id: string) {
    return { message: 'File metadata', id };
  }

  // GET /api/v1/files/temporary/:id/url
  @Get('temporary/:id/url')
  getTemporaryUrl(@Param('id') id: string) {
    return this.filesService.getTemporaryUrl(id);
  }

  // DELETE /api/v1/files/:id
  @Delete(':id')
  deleteFile(@Param('id') id: string) {
    return this.filesService.deleteFile(id);
  }
}
