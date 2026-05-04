// Req 20.6: Tracing module configuration
import { Module, Global } from '@nestjs/common';
import { TracingService } from './tracing.service.js';

@Global()
@Module({
  providers: [TracingService],
  exports: [TracingService],
})
export class TracingModule {}
