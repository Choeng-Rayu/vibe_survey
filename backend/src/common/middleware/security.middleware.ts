// Req 19.2, 19.3: Input sanitization and XSS protection
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
  private readonly logger = new Logger(SecurityMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Req 19.2: Sanitize request body, query, and params
    if (req.body) {
      req.body = this.sanitize(req.body);
    }
    if (req.query) {
      req.query = this.sanitize(req.query);
    }
    if (req.params) {
      req.params = this.sanitize(req.params);
    }

    next();
  }

  private sanitize(obj: any): any {
    if (typeof obj === 'string') {
      // Req 19.3: XSS protection - remove script tags and dangerous patterns
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitize(item));
    }

    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          sanitized[key] = this.sanitize(obj[key]);
        }
      }
      return sanitized;
    }

    return obj;
  }
}
