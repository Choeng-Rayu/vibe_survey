# Vibe Survey
> **"Turning your Prompt into the Survey form"**

Vibe Survey is a **Survey-as-Ads marketplace** that connects three key stakeholders through an AI-powered, fraud-resistant platform with integrated mobile wallet payouts.

---

## Three-Sided Marketplace

| Stakeholder | Role | Interface |
|-------------|------|-----------|
| **Advertisers** | Create survey-based ad campaigns, define targeting, set budgets, analyze responses | `survey_creator_frontend` |
| **Survey Takers (Users)** | Discover and complete surveys, earn points, withdraw to mobile wallets | `survey_taker_frontend` |
| **Platform Admins** | Review campaigns, moderate content, manage compliance, monitor system health | `admin_frontend` |

---

## Core Features

- **AI Survey Builder**: Generate, modify, enhance, translate, and analyze surveys from natural language prompts
- **Advanced Audience Targeting**: Demographic, geographic, interest-based, and behavioral targeting with real-time size estimation
- **Fraud Detection Engine**: Real-time behavioral analysis (response times, click patterns, mouse movements, scroll depth) producing a Fraud Confidence Score (0-100)
- **Mobile Wallet Integration**: Direct payouts via ABA Pay, WING, and TrueMoney (Cambodia-focused)
- **Real-Time Analytics**: Campaign performance, demographic breakdowns, cross-tabulation, and AI-powered sentiment analysis
- **Multi-Format Import/Export**: Excel, PDF, JSON with intelligent AI normalization
- **Bilingual Support**: Full Khmer and English localization

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Backend API** | NestJS 11, TypeScript 5.7 (ESM), 200+ REST endpoints |
| **Database** | PostgreSQL (Supabase) with Prisma ORM |
| **Cache / Queue** | Redis, Bull (background jobs) |
| **Real-Time** | WebSocket, Server-Sent Events (SSE) |
| **Frontends** | Next.js 16.2.4 (App Router), React 19.2.4, Tailwind CSS v4 |
| **State Management** | TanStack Query (server), Zustand (client) |
| **Forms / Validation** | React Hook Form + Zod |
| **Testing** | Jest, Supertest, Playwright, fast-check (property-based) |

---

## Project Structure

```
vibe_survey/
├── backend/                        # NestJS monolith API (port 3000)
│   └── src/
│       ├── modules/
│       │   ├── auth/               # JWT, MFA, OAuth, device fingerprint
│       │   ├── users/              # Profiles, trust tiers, preferences
│       │   ├── surveys/            # CRUD, versioning, templates, AI integration
│       │   ├── campaigns/          # Lifecycle, targeting, budgets
│       │   ├── responses/          # Survey taking, auto-save, fraud detection
│       │   ├── analytics/          # Metrics, demographics, reports
│       │   ├── payments/           # Wallet, withdrawals, mobile wallets
│       │   ├── admin/              # Review queues, moderation, compliance
│       │   ├── notifications/      # Email, push, SMS
│       │   ├── ai/                 # AI service integration (100 req/hour/user)
│       │   └── webhooks/           # External integrations
│       ├── common/                 # Guards, interceptors, pipes, decorators
│       ├── config/                 # Environment validation
│       └── prisma/                 # Schema, migrations, seeders
│
├── survey_creator_frontend/        # Advertiser portal (port 3001)
│   └── Campaign wizard (6 steps), AI Survey Builder, drag-drop builder,
│       logic flow editor, analytics dashboard, billing/invoicing
│
├── survey_taker_frontend/          # User survey app (port 3002)
│   └── Phone OTP verification, survey feed, fraud-tracked survey engine,
│       rewards wallet, progressive profiling, bilingual UI
│
├── admin_frontend/                 # Admin dashboard (port 3003)
│   └── Campaign review queue, user moderation, content moderation,
│       system config, audit logs, compliance management
│
└── .kiro/                          # Specifications & steering
    ├── specs/
    │   ├── ai-survey-builder-agent/    # Req 1-22: AI modes, diff viewer, validation
    │   ├── rest-api-design/            # Req 1-25: 200+ endpoints, versioning, rate limiting
    │   ├── scalable-nestjs-backend/    # Req 1-30: Architecture, auth, fraud, payments
    │   ├── survey-creator-frontend/    # Req 1-28: Wizard, targeting, AI panel, analytics
    │   ├── survey-taker-frontend/      # Req 1-45: Auth, fraud detection (Req 31-45), wallet
    │   └── system-admin-frontend/      # Req 1-30: Review, moderation, compliance, logs
    ├── steering/
    │   ├── product.md                  # Product overview & value proposition
    │   ├── structure.md                # Repo organization & naming conventions
    │   └── tech.md                     # Stack details & common commands
    └── hooks/
        └── docs-sync-hook.kiro.hook    # Auto-update docs on source changes
```

**Not a monorepo.** Each directory has its own `package.json` and `node_modules`.

---

## Design System: "Soft Luxury"

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#FAF7F2` | Cream — never pure white |
| Surface | `#F2EDE5` | Warm gray |
| Primary | `#7C9E8A` | Sage green |
| Primary Hover | `#6A8C78` | |
| Text | `#1C1C1A` | Near-black |
| Muted | `#6B6860` | |
| Accent | `#C4956A` | Warm gold (sparingly) |

**Typography**: Cormorant Garamond (headlines, `-0.02em` letter-spacing), DM Sans (body)
**Layout**: 120px+ vertical spacing, 16px border-radius cards, 999px pill buttons

---

## Key Backend Patterns

- **ESM Only**: `"module": "NodeNext"` in `tsconfig.json` — use `.js` extensions in imports
- **Prisma ORM**: All database access through Prisma Client — never raw SQL
- **JWT Auth**: Access + refresh tokens in httpOnly cookies — never localStorage
- **RBAC**: Roles = `survey_taker`, `advertiser`, `admin`
- **Rate Limiting**: AI endpoints = 100 req/hour/user
- **Fraud Detection**: Behavioral signals → Fraud Confidence Score (0-100) with quality labels
- **Queue System**: Bull for async jobs (exports, AI processing, payouts)
- **Validation**: class-validator + class-transformer on all DTOs
- **Soft Deletes**: `deleted_at` timestamps on all entities
- **Audit Fields**: `created_at`, `updated_at` on all tables
- **JSONB Fields**: survey definitions, response data, targeting criteria

---

## API Overview

**Base URL**: `/api/v1/`
**Auth Header**: `Authorization: Bearer <jwt_token>`
**Pagination**: Cursor-based (`limit` + `cursor`)
**Error Format**: Standard envelope with `code`, `message`, `details[]`

### Major Endpoint Groups

| Group | Prefix | Key Capabilities |
|-------|--------|------------------|
| Auth | `/api/v1/auth/*` | Register, login, refresh, OTP, MFA, OAuth |
| Users | `/api/v1/users/*` | Profile, preferences, trust tier, notifications |
| Surveys | `/api/v1/surveys/*` | CRUD, AI ops, import/export, versioning, templates |
| Campaigns | `/api/v1/campaigns/*` | Lifecycle, targeting, budgets, analytics |
| Responses | `/api/v1/surveys/:id/responses` | Submit, auto-save, resume, behavioral data |
| Rewards | `/api/v1/rewards/*` | Wallet, transactions, withdrawals, exchange rates |
| Admin | `/api/v1/admin/*` | Review queue, moderation, users, compliance, audit logs |
| Notifications | `/api/v1/notifications/*` | Multi-channel delivery, templates, preferences |
| WebSocket/SSE | `/api/v1/ws/*`, `/api/v1/sse/*` | Real-time notifications, analytics, survey responses |

Full spec: `.kiro/specs/rest-api-design/unified-api-routes.md`

---

## AI Survey Builder Agent

Six operational modes with surgical, action-based modifications:

| Mode | Purpose |
|------|---------|
| **Generate** | Create surveys from natural language prompts |
| **Modify** | Precise edits (add/remove/update questions, logic, options) |
| **Enhance** | Suggest clarity, completeness, and structural improvements |
| **Normalize** | Clean and standardize imported Excel data |
| **Translate** | Multi-language survey translation |
| **Analyze** | Evaluate survey quality without modifying |

All AI changes flow through a **Diff Viewer** for advertiser approval before application. Rate limit: 100 AI requests/hour/advertiser.

---

## Fraud Detection System (Requirements 31-45)

Behavioral signals collected on every question:

- **Response Time**: ms from display to answer (flags < 500ms)
- **Click Patterns**: Timestamps, coordinates, target elements (flags uniform intervals)
- **Scroll Events**: Depth percentages, velocity
- **Mouse Movements**: Path, velocity, pauses
- **Focus Events**: Blur/focus timestamps
- **Honeypot Questions**: Hidden fields bots will answer (+30 fraud points)
- **Attention Checks**: Platform-inserted verification questions

**Fraud Confidence Score** (0-100) weighted formula:
- Response Time: 25%
- Click Pattern: 20%
- Answer Pattern: 20%
- Interaction Depth: 20%
- Attention Check: 15%

**Quality Labels**:
- `0-30`: High Quality
- `31-60`: Suspicious
- `61-100`: Likely Fraud

Adaptive thresholds adjust based on survey complexity and question types.

---

## Mobile Wallet Integration (Cambodia)

Supported providers: **ABA Pay**, **WING**, **TrueMoney**

- Withdrawal requests: `POST /api/v1/rewards/withdraw`
- Async payout processing via Bull queue with exponential backoff retry
- Minimum withdrawal threshold enforced per trust tier

---

## Development Workflow

### Running Locally

```bash
# Backend (port 3000)
cd backend && npm run start:dev

# Survey Creator Frontend (port 3001)
cd survey_creator_frontend && npm run dev

# Survey Taker Frontend (port 3002)
cd survey_taker_frontend && npm run dev

# Admin Frontend (port 3003)
cd admin_frontend && npm run dev
```

### Testing

```bash
# Backend
cd backend
npm run test        # Unit tests (Jest)
npm run test:e2e    # E2E tests

# Frontend (run in each frontend directory)
npm run lint        # ESLint 9
npm run build       # TypeScript check + build
```

### Database Changes

```bash
cd backend
npx prisma migrate dev --name <migration_name>
npx prisma generate
```

---

## Security Rules

1. JWT in **httpOnly cookies** — never localStorage
2. **Device fingerprint** on auth requests (survey_taker)
3. **Input sanitization** on all text fields
4. **Rate limiting** on auth and AI endpoints
5. **CORS** configured per environment
6. **SQL injection prevention** via Prisma (never raw SQL)
7. **XSS protection** via React + CSP headers
8. **File uploads** — validate type/size, scan for malware
9. **Prompt injection guard** on all AI endpoints

---

## Requirements Source

Feature specifications live in `.kiro/specs/*/requirements.md`:

| Spec Directory | Requirements | Key Topics |
|----------------|--------------|------------|
| `ai-survey-builder-agent/` | Req 1-22 | Canonical JSON schema, 14 question types, 18 AI actions, diff viewer, rate limiting |
| `rest-api-design/` | Req 1-25 | 200+ endpoints, versioning, pagination, caching, HATEOAS, OpenAPI 3.0 |
| `scalable-nestjs-backend/` | Req 1-30 | Modular architecture, auth, fraud detection, payments, background jobs, testing |
| `survey-creator-frontend/` | Req 1-28 | Campaign wizard, AI panel, targeting, budget, analytics, import/export |
| `survey-taker-frontend/` | Req 1-45 | Registration, OTP, fraud detection (Req 31-45), wallet, bilingual, offline |
| `system-admin-frontend/` | Req 1-30 | Review queue, moderation, compliance, audit logs, feature toggles |

---

## Common Mistakes to Avoid

- **Don't** use Next.js 15 patterns — this repo uses v16 with App Router
- **Don't** put business logic in frontend — backend is source of truth
- **Don't** skip fraud tracking in `survey_taker` — it's required
- **Don't** forget phone verification in `survey_taker`
- **Don't** use raw SQL — always use Prisma
- **Don't** hard delete — always soft delete with `deleted_at`
- **Don't** skip Zod validation on forms
- **Don't** forget error boundaries in React components
- **Don't** commit `.env` files

---

*Last updated from `.kiro` specifications.*
