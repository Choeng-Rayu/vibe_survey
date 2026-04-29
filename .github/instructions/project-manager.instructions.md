---
description: "Use when planning or implementing Vibe Survey backend/frontend work, API contract changes, Docker backend workflow, or Supabase/Prisma rules."
---
# Vibe Survey Project Manager Instructions

## Platform Overview
- Backend: NestJS monolith (200+ REST endpoints)
- Database: Supabase (PostgreSQL) via Prisma
- Frontends (Next.js 16):
  - survey_creator_frontend (port 3001)
  - survey_taker_frontend (port 3002)
  - admin_frontend (port 3003)
- One shared backend for all frontends (port 3000), running in Docker

## Architecture Governance
- All frontends integrate with the same backend API base.
- All routes must be under /api/v1 and follow unified-api-routes.md.
- Endpoint changes require:
  - Update unified-api-routes.md
  - Backend implementation update
  - Impact review for all three frontends
  - Contract or integration test update

## Backend Structure (Domain Modules)
Organize backend modules to match unified-api-routes.md:
- auth, users, surveys, campaigns, targeting, responses, rewards
- analytics, admin, notifications, files, billing, webhooks

Enforce controller -> service -> data access separation, and keep shared concerns in common.

## Coding Standards (Backend)
- ESM only: use .js extensions in imports.
- Global prefix: /api/v1.
- Standard response envelope per unified-api-routes.md.
- DTO validation with class-validator/class-transformer and global validation pipe.
- Prisma-only data access (no raw SQL except approved edge cases).
- Soft deletes with deleted_at and audit timestamps.
- Auth: httpOnly cookies, device fingerprint for survey takers, RBAC roles.

## Docker-First Backend Rule
- Every backend change must be Docker-compatible.
- Ensure Docker build succeeds and service starts in container.
- Environment variables must be documented and validated.
- Redis/Bull dependencies must be accounted for.

## Rate Limiting and Fraud Detection
- AI endpoints: 100 requests per hour per user.
- Survey responses must collect behavioral signals:
  - Response time, click pattern, mouse movement, scroll depth, focus events
- Fraud score outputs quality labels: High Quality, Suspicious, Likely Fraud.

## Frontend Integration Rules
- Use a shared API client base URL pointing to /api/v1.
- Do not duplicate business logic in frontends.
- Handle standard success/error envelopes uniformly.
- Keep endpoint usage aligned with unified-api-routes.md.

## Mandatory References
- .kiro/specs/rest-api-design/unified-api-routes.md
- .kiro/specs/scalable-nestjs-backend/requirements.md
- .kiro/specs/survey-creator-frontend/requirements.md
- .kiro/specs/survey-taker-frontend/requirements.md
- .kiro/specs/system-admin-frontend/requirements.md
- .kiro/steering/structure.md

## Common Mistakes to Avoid
- Next.js 15 patterns (use Next.js 16 App Router)
- Frontend business logic that belongs in backend
- Skipping fraud tracking or phone verification for survey takers
- Raw SQL usage outside approved exceptions
- Hard deletes (always use soft deletes)
- Missing .js extensions in ESM imports
- Skipping error boundaries or Zod validation in frontend
- Committing .env files
