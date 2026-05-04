# Vibe Survey — Agent Instructions

## Project Overview

**Vibe Survey** is a three-sided marketplace (Survey-as-Ads platform) connecting:
- **Advertisers** → Create survey-based ad campaigns (`survey_creator_frontend`)
- **Users/Survey Takers** → Complete surveys for rewards (`survey_taker_frontend`)
- **Platform Admins** → Manage approvals and operations (`admin_frontend`)

**Backend** is a NestJS monolith with modular domain architecture serving 200+ REST API endpoints.
**Database** is Supabase (PostgreSQL).

## Critical: Next.js v16 Breaking Changes

This repo uses **Next.js 16.2.4** (App Router, React 19). APIs differ from training data.

**Before writing ANY Next.js code**, read the guide at:
- `node_modules/next/dist/docs/`

Heed deprecation notices.

## Project Structure

| Directory | Purpose | Stack |
|-----------|---------|-------|
| `backend/` | API server | NestJS 11, TypeScript 5.7, ESM |
| `admin_frontend/` | Platform admin dashboard | Next.js 16, Tailwind v4 |
| `survey_creator_frontend/` | Advertiser campaign portal | Next.js 16, Tailwind v4 |
| `survey_taker_frontend/` | User survey app + fraud detection | Next.js 16, Tailwind v4 |

**Not a monorepo.** Each directory has its own `package.json` and `node_modules`. Run commands from within each directory.

## Design System: "Soft Luxury"

All frontend work must follow `.github/skills/frontend-design/SKILL.md`:
- **Background:** `#FAF7F2` (cream) — never pure white
- **Surface:** `#F2EDE5` (warm gray)
- **Primary:** `#7C9E8A` (sage green)
- **Primary hover:** `#6A8C78`
- **Text:** `#1C1C1A` (near-black)
- **Muted:** `#6B6860`
- **Accent:** `#C4956A` (warm gold, use sparingly)

**Typography:** Cormorant Garamond (headlines, `-0.02em` letter-spacing), DM Sans (body)

**Layout:** 120px+ vertical spacing, 16px border-radius cards, 999px pill buttons

**Guardrails:** No blue primaries, no pure white, no heavy shadows

## Requirements Source

Feature specs live in `.kiro/specs/*/requirements.md`:
- `rest-api-design/` — Complete REST API specification (Req 1-25)
- `scalable-nestjs-backend/` — Backend architecture requirements (Req 1-30)
- `survey-creator-frontend/` — Advertiser campaign management (Req 1-28)
- `survey-taker-frontend/` — User survey experience + fraud detection (Req 1-45)
- `system-admin-frontend/` — Admin dashboard (Req 1-30)
- `ai-survey-builder-agent/` — Natural language survey creation (Req 1-22)

Design docs and tasks live alongside each spec in `design.md` and `tasks.md` where applicable.

## Kiro Spec Execution Workflow

When working on any task under `.kiro/specs/`, follow this order every time:
1. Read `tasks.md` first to find the task id, title, sub-steps, and requirement ids.
2. Read `requirements.md` next to extract all acceptance criteria for those ids.
3. Read `design.md` last to follow the required interfaces, patterns, and file structure.
4. Implement only the current task, matching the design patterns and criteria.
5. Verify with the relevant lint/test/build commands for the area you changed.
6. Update the task and sub-steps to `[x]` in `tasks.md` after verification passes.

Reference prompt (optional): [.kiro/specs/kiro-task-execution.prompt.md](.kiro/specs/kiro-task-execution.prompt.md)

## Backend Architecture (NestJS)

### Module Organization (Domain-Driven)

```
backend/src/
├── modules/
│   ├── auth/              # JWT, MFA, OAuth, device fingerprint
│   ├── users/             # Profiles, trust tiers, preferences
│   ├── surveys/           # CRUD, versioning, templates, AI integration
│   ├── campaigns/         # Lifecycle, targeting, budgets
│   ├── responses/         # Survey taking, auto-save, fraud detection
│   ├── analytics/         # Campaign metrics, demographics, reports
│   ├── payments/          # Wallet, withdrawals, mobile wallets (ABA/WING/TrueMoney)
│   ├── admin/             # Review queues, moderation, compliance
│   ├── notifications/     # Multi-channel (email, push, SMS)
│   ├── ai/                # AI service integration, rate limiting (100 req/hour)
│   └── webhooks/          # External integrations
├── common/                # Guards, interceptors, pipes, decorators
├── config/                # Environment validation
├── prisma/                # Schema, migrations, seeders
└── main.ts                # Entry point (port 3000)
```

### Key Backend Patterns

**ESM Only:** `"module": "NodeNext"` in `tsconfig.json` — use `.js` extensions in imports

**Prisma ORM:** All database access through Prisma Client — never raw SQL

**JWT Auth:** Access + refresh tokens, stored in httpOnly cookies — never localStorage

**RBAC:** Roles = `survey_taker`, `advertiser`, `admin`

**Rate Limiting:** AI endpoints = 100 req/hour/user

**Fraud Detection:** Behavioral signals → Fraud Confidence Score (0-100)

**Queue System:** Bull for background jobs (exports, AI processing, payouts)

**Validation:** class-validator + class-transformer on all DTOs

### Database (Supabase/PostgreSQL)

**Key Tables:**
- `users` — Auth, trust tier, verification status
- `profiles` — Demographics, completion percentage
- `surveys` — Canonical JSON schema, versions, status
- `campaigns` — Budget, targeting, lifecycle status
- `responses` — Answers + behavioral data + fraud analysis
- `wallets` — Points balance, transactions
- `withdrawals` — Payout requests, mobile wallet details

**JSONB Fields:** survey definitions, response data, targeting criteria

**Soft Deletes:** `deleted_at` timestamps, never hard delete

**Audit Fields:** `created_at`, `updated_at` on all tables

## Frontend Architecture

### Shared Patterns (All Frontends)

**State Management:** TanStack Query (React Query) for server state

**Forms:** React Hook Form + Zod validation

**Styling:** Tailwind v4 with PostCSS (`@tailwindcss/postcss`)

**Path Alias:** `@/*` maps to project root

**Fonts:** Geist (default), Cormorant Garamond + DM Sans (design system)

### Frontend Implementation Guidelines

- Favor scalable, clean component architecture over quick fixes.
- Reuse existing components before creating new ones.
- When new UI is needed, design reusable components instead of one-off usage.

### survey_creator_frontend Specifics

**Core Features:**
- Campaign wizard (6 steps: objective → targeting → budget → survey → review → submit)
- AI Survey Builder (chat interface, diff viewer, 6 modes: Generate/Modify/Enhance/Normalize/Translate/Analyze)
- Drag-drop survey builder
- Logic flow editor (skip/branch/quotas)
- Audience targeting with real-time size estimation
- Budget management (CPR model)
- Analytics dashboard

**AI Integration Pattern:**
```typescript
// All AI modifications show in Diff_Viewer before apply
// AI_Actions are surgical: add_question, update_logic, reorder_questions
// Rate limit display shows remaining quota
```

### survey_taker_frontend Specifics

**Core Features:**
- Phone OTP verification (required before surveys)
- Survey feed with Match_Score sorting
- Fraud detection tracking (Req 31-45):
  - Response time analysis per question
  - Click pattern / bot detection
  - Mouse movement and scroll depth tracking
  - Fraud Confidence Score (0-100)
  - Quality labels: "High Quality" | "Suspicious" | "Likely Fraud"
- Progressive profiling
- Rewards wallet (points → mobile wallets)
- Bilingual: Khmer + English

**Fraud Tracking Implementation:**
```typescript
// Track on every question:
- responseTime: ms from display to answer
- clickEvents: timestamps, coordinates, target elements
- scrollEvents: depth percentages, velocity
- mouseMovements: path, velocity, pauses
- focusEvents: blur/focus timestamps
```

### admin_frontend Specifics

**Core Features:**
- Campaign review queue (approve/reject/request revision)
- User moderation (suspend/ban/unban)
- Content moderation queue
- System configuration
- Audit logs
- Compliance management (GDPR/data requests)
- Platform analytics

## API Contracts

**Base URL:** `/api/v1/`

**Auth Header:** `Authorization: Bearer <jwt_token>`

**Response Format:**
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "...",
    "version": "1.0",
    "requestId": "..."
  }
}
```

**Key Endpoint Groups:**
- `/api/v1/auth/*` — All auth operations (register, login, refresh, OTP, MFA, OAuth)
- `/api/v1/users/*` — Profile, preferences, trust tier, notifications
- `/api/v1/surveys/*` — CRUD + AI + import/export + versioning + templates
- `/api/v1/campaigns/*` — Lifecycle + targeting + budgets + analytics
- `/api/v1/surveys/feed` — Survey discovery for takers
- `/api/v1/surveys/:id/responses` — Submit responses, auto-save, resume
- `/api/v1/rewards/*` — Wallet + withdrawals + exchange rates
- `/api/v1/admin/*` — All admin operations (review, moderation, compliance, audit)
- `/api/v1/ws/*`, `/api/v1/sse/*` — Real-time notifications and analytics

See full spec: `.kiro/specs/rest-api-design/unified-api-routes.md`
All route endpoints are already designed in `unified-api-routes.md`.

## Integration Rules

### Backend ↔ Frontend Contract

1. **API version in URL:** `/api/v1/` — always include version
2. **Pagination:** Cursor-based with `limit` + `cursor` params
3. **Error Format:** Standard envelope with `code`, `message`, `details[]`
4. **File Uploads:** Signed URLs from backend → upload direct to storage
5. **Real-Time:** WebSocket for notifications, SSE for analytics updates

### AI Service Integration

- AI calls go through backend (`/api/v1/surveys/ai/*`)
- Frontend NEVER calls AI directly
- All AI responses pass through diff viewer before apply
- Conversation context maintained per survey edit session

### Mobile Wallet Integration (Cambodia)

Supported: **ABA Pay**, **WING**, **TrueMoney**

- Withdrawal requests: `POST /api/v1/rewards/withdraw`
- Payout processed async via queue
- Retry logic with exponential backoff

## Development Workflow

### Running Locally

```bash
# Backend
cd backend
npm run start:dev  # Port 3000

# Frontend (each in separate terminal)
cd survey_creator_frontend
npm run dev        # Port 3001

cd survey_taker_frontend
npm run dev        # Port 3002

cd admin_frontend
npm run dev        # Port 3003
```

### Testing

**Backend:**
```bash
npm run test       # Unit tests (Jest)
npm run test:e2e   # E2E tests
```

**Frontend:**
```bash
npm run lint       # ESLint 9
npm run build      # TypeScript check + build
```

### Database Changes

```bash
cd backend
npx prisma migrate dev --name <migration_name>
npx prisma generate
```

## Security Rules

1. **JWT in httpOnly cookies** — never localStorage
2. **Device fingerprint** on auth requests (survey_taker)
3. **Input sanitization** on all text fields
4. **Rate limiting** on auth and AI endpoints
5. **CORS** configured per environment
6. **SQL injection prevention** via Prisma (never raw SQL)
7. **XSS protection** via React + CSP headers
8. **File uploads** — validate type/size, scan for malware
9. **Prompt injection guard** on all AI endpoints

## Common Mistakes to Avoid

- **Don't** use Next.js 15 patterns (this is v16 with App Router)
- **Don't** put business logic in frontend — backend is source of truth
- **Don't** skip fraud tracking in survey_taker — it's required
- **Don't** forget phone verification in survey_taker
- **Don't** use raw SQL — always use Prisma
- **Don't** hard delete — always soft delete with `deleted_at`
- **Don't** skip Zod validation on forms
- **Don't** forget error boundaries in React components
- **Don't** commit `.env` files
