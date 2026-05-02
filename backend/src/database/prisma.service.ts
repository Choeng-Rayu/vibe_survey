import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Req 18.3, 18.4: Connection pooling and query optimization
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env['NODE_ENV'] === 'development'
          ? [{ emit: 'event', level: 'query' }, 'warn', 'error']
          : ['warn', 'error'],
    });

    // Req 18.6: Query performance monitoring
    if (process.env['NODE_ENV'] === 'development') {
      this.$on('query' as never, (e: any) => {
        if (e.duration > 1000) {
          this.logger.warn(`Slow query detected: ${e.duration}ms - ${e.query}`);
        }
      });
    }
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    this.logger.log('Database connected with connection pooling');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log('Database disconnected');
  }
}
