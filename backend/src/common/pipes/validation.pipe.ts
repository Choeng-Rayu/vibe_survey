import { ValidationPipe } from '@nestjs/common';

// Req 1.8: class-validator + class-transformer, Req 21.4: detailed error messages
export const globalValidationPipe = new ValidationPipe({
  whitelist: true,           // strip unknown properties
  forbidNonWhitelisted: true,
  transform: true,           // auto-transform payloads to DTO instances
  transformOptions: { enableImplicitConversion: true },
});
