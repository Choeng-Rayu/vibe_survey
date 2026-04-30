# Vibe Survey - Project Manager Instructions

## Overview

Vibe Survey is a three-sided marketplace (Survey-as-Ads platform) with:
- **Backend**: NestJS monolith serving 200+ REST API endpoints
- **Database**: Supabase (PostgreSQL)
- **Frontends**: 3 separate Next.js 16 applications
  - `survey_creator_frontend` - Advertiser campaign portal (Port 3001)
  - `survey_taker_frontend` - User survey app + fraud detection (Port 3002)
  - `admin_frontend` - Platform admin dashboard (Port 3003)

All frontends connect to a single backend running on Docker (Port 3000).

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────┬─────────────────┬───────────────────────────────┤
│  Survey Creator │  Survey Taker   │        Admin Portal         │
│   (Port 3001)   │   (Port 3002)   │         (Port 3003)         │
│                 │                 │                             │
│  - Campaign     │  - Survey feed  │  - Campaign review          │
│    wizard       │  - Fraud        │  - User moderation          │
│  - AI builder   │    detection    │  - Content moderation       │
│  - Analytics    │  - Rewards      │  - System config            │
└────────┬────────┴────────┬────────┴───────────────┬─────────────┘
         │                 │                        │
         └─────────────────┼────────────────────────┘
                           │
              ┌─────────────▼──────────────┐
              │      API GATEWAY           │
              │    /api/v1/* (Port 3000)   │
              └─────────────┬──────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         │                  │                  │
┌────────▼────────┐  ┌───────▼────────┐  ┌────▼──────────────┐
│   AUTH MODULE   │  │  CORE MODULES  │  │   ADMIN MODULES   │
│                 │  │                │  │                   │
│ - /auth/*       │  │ - /surveys/*   │  │ - /admin/*        │
│ - JWT/MFA/OAuth │  │ - /campaigns/* │  │ - /analytics/*    │
│ - Device        │  │ - /users/*     │  │ - /webhooks/*     │
│   fingerprint   │  │ - /responses/* │  │                   │
└─────────────────┘  │ - /rewards/*   │  └───────────────────┘
                     │ - /files/*     │
                     │ - /billing/*   │
                     └────────────────┘
                           │
              ┌─────────────▼──────────────┐
              │    SHARED SERVICES         │
              │                            │
              │  - Prisma ORM (Supabase)   │
              │  - Bull Queue (Redis)      │
              │  - WebSocket Gateway       │
              │  - AI Service Integration  │
              └────────────────────────────┘
```

---

## Module Structure (Domain-Driven)

Based on `/home/rayu/vibe_survey/.kiro/specs/rest-api-design/unified-api-routes.md`, organize modules as follows:

```
backend/src/
├── modules/
│   ├── auth/                    # Authentication & Authorization
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts   # POST /auth/login, /auth/register, etc.
│   │   ├── auth.service.ts
│   │   ├── guards/
│   │   ├── strategies/
│   │   └── dto/
│   │
│   ├── users/                   # User Management
│   │   ├── users.controller.ts  # GET /users/profile, /users/preferences
│   │   ├── users.service.ts
│   │   └── dto/
│   │
│   ├── surveys/                 # Survey CRUD + AI
│   │   ├── surveys.controller.ts
│   │   ├── surveys.service.ts
│   │   ├── ai/
│   │   │   ├── ai.controller.ts # POST /surveys/ai/generate
│   │   │   └── ai.service.ts
│   │   └── dto/
│   │
│   ├── campaigns/               # Campaign Lifecycle
│   │   ├── campaigns.controller.ts
│   │   ├── campaigns.service.ts
│   │   └── dto/
│   │
│   ├── responses/               # Survey Taking & Fraud Detection
│   │   ├── responses.controller.ts
│   │   ├── responses.service.ts
│   │   ├── fraud/
│   │   │   └── fraud-detection.service.ts
│   │   └── dto/
│   │
│   ├── analytics/               # Campaign Analytics
│   │   ├── analytics.controller.ts
│   │   └── analytics.service.ts
│   │
│   ├── rewards/                 # Wallet & Payouts
│   │   ├── rewards.controller.ts
│   │   └── rewards.service.ts
│   │
│   ├── admin/                   # Admin Operations
│   │   ├── admin.controller.ts
│   │   ├── admin.service.ts
│   │   ├── moderation/
│   │   ├── compliance/
│   │   └── fraud-review/
│   │
│   ├── notifications/           # Multi-channel notifications
│   │   ├── notifications.controller.ts
│   │   └── notifications.service.ts
│   │
│   ├── files/                   # File uploads & storage
│   │   ├── files.controller.ts
│   │   └── files.service.ts
│   │
│   ├── billing/                 # Campaign budgets & payments
│   │   ├── billing.controller.ts
│   │   └── billing.service.ts
│   │
│   ├── webhooks/                # External integrations
│   │   ├── webhooks.controller.ts
│   │   └── webhooks.service.ts
│   │
│   └── targeting/               # Audience targeting
│       ├── targeting.controller.ts
│       └── targeting.service.ts
│
├── common/                      # Shared utilities
│   ├── decorators/
│   ├── filters/                 # Exception filters
│   ├── guards/                  # Auth guards
│   ├── interceptors/
│   └── pipes/
│
├── config/                      # Configuration
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── app.config.ts
│
├── prisma/                      # Database schema & client
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
└── main.ts                      # Application entry point
```

---

## Coding Standards

### 1. ESM Only (CRITICAL)

NestJS 11 with TypeScript 5.7 uses ESM. All imports MUST include `.js` extension:

```typescript
// CORRECT
import { AuthService } from './auth.service.js';
import { User } from '../entities/user.entity.js';

// WRONG - will fail at runtime
import { AuthService } from './auth.service';
```

**tsconfig.json requirements:**
```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "esModuleInterop": true
  }
}
```

### 2. Module Registration Pattern

Each module must follow this structure:

```typescript
// modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```

### 3. Controller Route Structure

Prefix ALL routes with `/api/v1/` in main.ts:

```typescript
// main.ts
app.setGlobalPrefix('api/v1');
```

Then controllers define sub-routes:

```typescript
// modules/auth/auth.controller.ts
@Controller('auth')
export class AuthController {
  @Post('login')
  async login() {}  // Results in POST /api/v1/auth/login

  @Post('register')
  async register() {} // Results in POST /api/v1/auth/register
}
```

### 4. Response Format (Standard Envelope)

All responses MUST follow the unified format from `unified-api-routes.md`:

```typescript
// Success Response
{
  success: true,
  data: { ... },
  meta: {
    timestamp: new Date().toISOString(),
    version: '1.0',
    requestId: generateUUID()
  }
}

// Error Response
{
  success: false,
  error: {
    code: 'ERROR_CODE',
    message: 'Human readable message',
    details: { ... },
    timestamp: new Date().toISOString()
  },
  meta: { requestId: generateUUID() }
}
```

Implement using an interceptor:

```typescript
// common/interceptors/response.interceptor.ts
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.headers['x-request-id'] || uuidv4();

    return next.handle().pipe(
      map(data => ({
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0',
          requestId,
        },
      })),
    );
  }
}
```

### 5. Validation with class-validator

All DTOs must use class-validator:

```typescript
// dto/create-survey.dto.ts
export class CreateSurveyDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  canonicalJson: Record<string, any>;
}
```

Enable validation globally in main.ts:
```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

### 6. Database Access (Prisma Only)

**NEVER use raw SQL.** Always use Prisma:

```typescript
// CORRECT
const survey = await this.prisma.survey.create({
  data: { title, description, canonicalJson },
});

// WRONG
const survey = await this.prisma.$queryRaw`INSERT ...`;
```

### 7. Authentication Pattern

- JWT tokens in httpOnly cookies (NEVER localStorage)
- Device fingerprint for survey takers
- RBAC: roles = `survey_taker`, `advertiser`, `admin`

```typescript
// guards/roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = Reflect.getMetadata('roles', context.getHandler());
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles?.includes(user.role);
  }
}
```

### 8. Soft Deletes

All entities must use soft deletes:

```typescript
// schema.prisma
model Survey {
  id          String   @id @default(uuid())
  title       String
  deletedAt   DateTime? @map("deleted_at")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("surveys")
}
```

Query with soft delete filter:
```typescript
await this.prisma.survey.findMany({
  where: { deletedAt: null },
});
```

---

## Docker Configuration

### 1. Backend Dockerfile

Create `backend/Dockerfile`:

```dockerfile
# Multi-stage build for production optimization
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .
RUN npm run build

# Production stage
FROM node:22-alpine AS production

WORKDIR /app

# Copy built assets and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### 2. Root docker-compose.yml

Create `/home/rayu/vibe_survey/docker-compose.yml`:

```yaml
version: '3.8'

services:
  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: vibe_backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_URL=redis://redis:6379
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_KEY=${SUPABASE_KEY}
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      - redis
    networks:
      - vibe_network
    restart: unless-stopped

  # Redis for Bull Queue & Sessions
  redis:
    image: redis:7-alpine
    container_name: vibe_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - vibe_network
    restart: unless-stopped

  # Optional: PostgreSQL for local development
  # (Use Supabase in production)
  postgres:
    image: postgres:16-alpine
    container_name: vibe_postgres
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=${DB_USER:-postgres}
      - POSTGRES_PASSWORD=${DB_PASSWORD:-postgres}
      - POSTGRES_DB=${DB_NAME:-vibe_survey}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - vibe_network
    restart: unless-stopped

volumes:
  redis_data:
  postgres_data:

networks:
  vibe_network:
    driver: bridge
```

### 3. Environment Variables

Create `backend/.env.example`:

```bash
# Server
NODE_ENV=development
PORT=3000

# Supabase (Production Database)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_KEY=[anon-key]
SUPABASE_SERVICE_KEY=[service-role-key]

# Redis (for Bull Queue)
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key-min-32-characters
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# AI Service
AI_SERVICE_URL=https://api.openai.com/v1
AI_API_KEY=your-api-key
AI_RATE_LIMIT=100  # requests per hour per user

# File Storage (Supabase Storage)
STORAGE_BUCKET=surveys

# Cambodia Mobile Wallets
ABA_PAY_ENABLED=true
WING_ENABLED=true
TRUEMONEY_ENABLED=true

# Rate Limiting
RATE_LIMIT_WINDOW=3600000  # 1 hour in ms
RATE_LIMIT_MAX_REQUESTS=1000
```

---

## API Endpoint Mapping

Map all endpoints from `unified-api-routes.md` to module controllers:

### Auth Module (`/api/v1/auth/*`)
```typescript
@Controller('auth')
export class AuthController {
  @Post('register')           // POST /api/v1/auth/register
  @Post('login')              // POST /api/v1/auth/login
  @Post('refresh')            // POST /api/v1/auth/refresh
  @Post('logout')             // POST /api/v1/auth/logout
  @Post('verify-phone')      // POST /api/v1/auth/verify-phone
  @Post('forgot-password')   // POST /api/v1/auth/forgot-password
  @Post('reset-password')    // POST /api/v1/auth/reset-password
  @Get('me')                 // GET /api/v1/auth/me
  @Get('oauth/google')       // GET /api/v1/auth/oauth/google
  @Get('oauth/facebook')    // GET /api/v1/auth/oauth/facebook
  @Post('mfa/enable')        // POST /api/v1/auth/mfa/enable
  @Post('mfa/verify')       // POST /api/v1/auth/mfa/verify
}
```

### Users Module (`/api/v1/users/*`)
```typescript
@Controller('users')
export class UsersController {
  @Get('profile')            // GET /api/v1/users/profile
  @Put('profile')            // PUT /api/v1/users/profile
  @Get('preferences')       // GET /api/v1/users/preferences
  @Get('trust-tier')        // GET /api/v1/users/trust-tier
  @Get('notifications')     // GET /api/v1/users/notifications
}
```

### Surveys Module (`/api/v1/surveys/*`)
```typescript
@Controller('surveys')
export class SurveysController {
  @Post()                    // POST /api/v1/surveys
  @Get()                     // GET /api/v1/surveys
  @Get(':id')               // GET /api/v1/surveys/:id
  @Put(':id')               // PUT /api/v1/surveys/:id
  @Delete(':id')            // DELETE /api/v1/surveys/:id
  @Post(':id/duplicate')    // POST /api/v1/surveys/:id/duplicate
  @Get(':id/versions')      // GET /api/v1/surveys/:id/versions
  @Get('feed')              // GET /api/v1/surveys/feed
  @Get('recommendations')   // GET /api/v1/surveys/recommendations
}
```

### AI Sub-module (`/api/v1/surveys/ai/*`)
```typescript
@Controller('surveys/ai')
export class AiController {
  @Post('generate')          // POST /api/v1/surveys/ai/generate
  @Get('quota')             // GET /api/v1/surveys/ai/quota
}

@Controller('surveys/:id/ai')
export class AiSurveyController {
  @Post('modify')           // POST /api/v1/surveys/:id/ai/modify
  @Post('enhance')          // POST /api/v1/surveys/:id/ai/enhance
  @Post('analyze')          // POST /api/v1/surveys/:id/ai/analyze
  @Post('translate')        // POST /api/v1/surveys/:id/ai/translate
}
```

### Campaigns Module (`/api/v1/campaigns/*`)
```typescript
@Controller('campaigns')
export class CampaignsController {
  @Post()                    // POST /api/v1/campaigns
  @Get()                     // GET /api/v1/campaigns
  @Get(':id')               // GET /api/v1/campaigns/:id
  @Put(':id')               // PUT /api/v1/campaigns/:id
  @Delete(':id')            // DELETE /api/v1/campaigns/:id
  @Post(':id/submit')       // POST /api/v1/campaigns/:id/submit
  @Post(':id/activate')     // POST /api/v1/campaigns/:id/activate
  @Post(':id/pause')        // POST /api/v1/campaigns/:id/pause
  @Get(':id/analytics')     // GET /api/v1/campaigns/:id/analytics
  @Get(':id/budget')        // GET /api/v1/campaigns/:id/budget
}
```

### Responses Module (`/api/v1/surveys/:id/*`)
```typescript
@Controller('surveys/:id')
export class ResponsesController {
  @Get('screener')          // GET /api/v1/surveys/:id/screener
  @Post('screener')         // POST /api/v1/surveys/:id/screener
  @Post('start')            // POST /api/v1/surveys/:id/start
  @Post('responses')        // POST /api/v1/surveys/:id/responses
  @Put('responses/autosave') // PUT /api/v1/surveys/:id/responses/autosave
  @Post('complete')         // POST /api/v1/surveys/:id/complete
}
```

### Rewards Module (`/api/v1/rewards/*`)
```typescript
@Controller('rewards')
export class RewardsController {
  @Get('wallet')            // GET /api/v1/rewards/wallet
  @Get('balance')           // GET /api/v1/rewards/balance
  @Get('transactions')      // GET /api/v1/rewards/transactions
  @Post('withdraw')         // POST /api/v1/rewards/withdraw
  @Get('withdrawals')       // GET /api/v1/rewards/withdrawals
}
```

### Admin Module (`/api/v1/admin/*`)
```typescript
@Controller('admin')
export class AdminController {
  @Get('campaigns/review-queue')      // GET /api/v1/admin/campaigns/review-queue
  @Post('campaigns/:id/approve')     // POST /api/v1/admin/campaigns/:id/approve
  @Post('campaigns/:id/reject')      // POST /api/v1/admin/campaigns/:id/reject
  @Get('users')                       // GET /api/v1/admin/users
  @Post('users/:id/suspend')         // POST /api/v1/admin/users/:id/suspend
  @Post('users/:id/ban')              // POST /api/v1/admin/users/:id/ban
  @Get('audit-logs')                  // GET /api/v1/admin/audit-logs
}
```

---

## Rate Limiting

Implement rate limiting per the spec:

```typescript
// common/guards/rate-limit.guard.ts
@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?.id;
    const key = `rate_limit:${userId}`;

    const current = await this.redis.incr(key);
    if (current === 1) {
      await this.redis.expire(key, 3600); // 1 hour
    }

    if (current > 100) { // 100 req/hour for AI
      throw new HttpException('Rate limit exceeded', HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }
}
```

Apply to AI endpoints:
```typescript
@Controller('surveys/ai')
@UseGuards(RateLimitGuard)
export class AiController { ... }
```

---

## Fraud Detection Implementation

Required for survey taker responses (Req 31-45):

```typescript
// modules/responses/fraud/fraud-detection.service.ts
@Injectable()
export class FraudDetectionService {
  calculateFraudScore(responseData: ResponseData): FraudScore {
    const signals = {
      responseTime: this.analyzeResponseTime(responseData.timing),
      clickPattern: this.analyzeClickPattern(responseData.clicks),
      mouseMovement: this.analyzeMouseMovement(responseData.mouseData),
      scrollDepth: this.analyzeScrollPattern(responseData.scrollEvents),
    };

    const weightedScore = this.calculateWeightedScore(signals);

    return {
      score: weightedScore,
      label: this.getQualityLabel(weightedScore),
      signals,
      confidence: this.calculateConfidence(signals),
    };
  }

  private getQualityLabel(score: number): QualityLabel {
    if (score < 30) return 'High Quality';
    if (score < 70) return 'Suspicious';
    return 'Likely Fraud';
  }
}
```

---

## Running the Project

### Development (Local)

```bash
# Terminal 1: Start Docker services
docker-compose up -d redis postgres

# Terminal 2: Backend
cd backend
npm install
npx prisma migrate dev
npx prisma generate
npm run start:dev

# Terminal 3: Survey Creator Frontend
cd survey_creator_frontend
npm install
npm run dev

# Terminal 4: Survey Taker Frontend
cd survey_taker_frontend
npm install
npm run dev

# Terminal 5: Admin Frontend
cd admin_frontend
npm install
npm run dev
```

### Production (Docker)

```bash
# Build and run all services
docker-compose up --build -d

# View logs
docker-compose logs -f backend

# Scale backend (if needed)
docker-compose up -d --scale backend=3
```

---

## Security Checklist

- [ ] JWT in httpOnly cookies (never localStorage)
- [ ] Device fingerprint on auth
- [ ] Input sanitization on all text fields
- [ ] Rate limiting on auth and AI endpoints
- [ ] CORS configured per environment
- [ ] SQL injection prevention via Prisma (never raw SQL)
- [ ] XSS protection via CSP headers
- [ ] File upload validation (type, size, malware scan)
- [ ] PII detection in responses
- [ ] Soft deletes (never hard delete)

---

## Common Mistakes to Avoid

1. **Don't** use Next.js 15 patterns (this is v16 with App Router)
2. **Don't** put business logic in frontend - backend is source of truth
3. **Don't** skip fraud tracking in survey_taker - it's required
4. **Don't** forget phone verification in survey_taker
5. **Don't** use raw SQL - always use Prisma
6. **Don't** hard delete - always soft delete with `deleted_at`
7. **Don't** skip Zod validation on forms
8. **Don't** forget error boundaries in React components
9. **Don't** commit `.env` files
10. **Don't** forget `.js` extensions in ESM imports

---

## Frontend Connection Pattern

All 3 frontends connect to the same backend:

```typescript
// frontend/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export async function fetchAPI(endpoint: string, options?: RequestInit) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: 'include', // For httpOnly cookies
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const data = await response.json();

  if (!data.success) {
    throw new APIError(data.error);
  }

  return data.data;
}
```

---

## Testing

### Backend Tests
```bash
cd backend
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage
```

### Frontend Tests
```bash
cd <frontend-directory>
npm run lint              # ESLint 9
npm run build             # TypeScript check + build
```

---

## Database Migrations

```bash
cd backend

# Create new migration
npx prisma migrate dev --name add_user_preferences

# Apply migrations
npx prisma migrate deploy

# Generate client
npx prisma generate

# View database
npx prisma studio
```

---

## Deployment Notes

- Backend runs on Docker (Port 3000)
- Supabase handles database (PostgreSQL)
- Redis handles queues (Bull) and sessions
- Each frontend deploys separately (Vercel recommended)
- Configure environment variables in Docker Compose or deployment platform

---

## Reference Documents

- **API Spec**: `/home/rayu/vibe_survey/.kiro/specs/rest-api-design/unified-api-routes.md`
- **Backend Requirements**: `/home/rayu/vibe_survey/.kiro/specs/scalable-nestjs-backend/requirements.md`
- **Frontend Requirements**:
  - Creator: `.kiro/specs/survey-creator-frontend/requirements.md`
  - Taker: `.kiro/specs/survey-taker-frontend/requirements.md`
  - Admin: `.kiro/specs/system-admin-frontend/requirements.md`

---

Last Updated: 2026-04-29
