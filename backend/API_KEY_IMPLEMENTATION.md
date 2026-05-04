# API Key Management Implementation

## Overview

Task 46 implements API Key Management for third-party integrations as specified in Requirement 19.8.

## Features Implemented

### 1. API Key Model (Prisma Schema)
- **Location**: `backend/prisma/schema.prisma`
- **Fields**:
  - `id`: Unique identifier
  - `name`: Human-readable key name
  - `key_hash`: Bcrypt-hashed API key
  - `key_prefix`: First 12 characters for identification (vsk_ + 8 chars)
  - `user_id`: Owner reference
  - `scopes`: Array of permission strings
  - `last_used_at`: Timestamp of last usage
  - `expires_at`: Optional expiration date
  - `revoked_at`: Soft delete timestamp
  - `created_at`, `updated_at`: Audit timestamps

### 2. API Key Service
- **Location**: `backend/src/modules/auth/api-key.service.ts`
- **Methods**:
  - `create()`: Generate new API key with bcrypt hashing
  - `validate()`: Verify API key and return user context
  - `findAll()`: List user's active API keys
  - `revoke()`: Soft delete API key
  - `rotate()`: Revoke old key and create new one

### 3. API Key Guard
- **Location**: `backend/src/common/guards/api-key.guard.ts`
- **Features**:
  - Extracts API key from `Authorization: Bearer` or `X-API-Key` header
  - Validates key and attaches user context to request
  - Checks required scopes if specified via `@Scopes()` decorator

### 4. API Key Controller
- **Location**: `backend/src/modules/auth/api-key.controller.ts`
- **Endpoints**:
  - `POST /api/v1/integration/api-keys` - Create new API key
  - `GET /api/v1/integration/api-keys` - List user's API keys
  - `DELETE /api/v1/integration/api-keys/:id` - Revoke API key
  - `POST /api/v1/integration/api-keys/:id/rotate` - Rotate API key

### 5. DTOs
- **Location**: `backend/src/modules/auth/dto/api-key.dto.ts`
- **Classes**:
  - `CreateApiKeyDto`: Input for creating API keys
  - `ApiKeyResponseDto`: Safe response without secret
  - `ApiKeyWithSecretDto`: Response with secret (only on creation)

### 6. Scopes Decorator
- **Location**: `backend/src/common/decorators/scopes.decorator.ts`
- **Usage**: `@Scopes('surveys:read', 'campaigns:write')`

## Usage Example

### Creating an API Key

```typescript
POST /api/v1/integration/api-keys
Authorization: Bearer <jwt_token>

{
  "name": "Production Integration",
  "scopes": ["surveys:read", "campaigns:write"],
  "expires_at": "2025-12-31T23:59:59Z"
}

Response:
{
  "id": "clx...",
  "name": "Production Integration",
  "key_prefix": "vsk_a1b2c3d4",
  "scopes": ["surveys:read", "campaigns:write"],
  "key": "vsk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6",
  "created_at": "2026-05-02T08:30:00Z"
}
```

### Using an API Key

```typescript
GET /api/v1/surveys
Authorization: Bearer vsk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

// Or

GET /api/v1/surveys
X-API-Key: vsk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### Protecting Endpoints with API Key

```typescript
import { UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../../common/guards/api-key.guard';
import { Scopes } from '../../common/decorators/scopes.decorator';

@Controller('api/v1/surveys')
@UseGuards(ApiKeyGuard)
export class SurveysController {
  
  @Get()
  @Scopes('surveys:read')
  async findAll() {
    // Only API keys with 'surveys:read' scope can access
  }
}
```

## Security Features

1. **Bcrypt Hashing**: API keys are hashed with bcrypt (10 rounds) before storage
2. **Key Prefix**: First 12 characters stored for efficient lookup
3. **Expiration**: Optional expiration dates enforced
4. **Revocation**: Soft delete with `revoked_at` timestamp
5. **Scope-based Permissions**: Fine-grained access control
6. **Usage Tracking**: `last_used_at` updated on each use
7. **Rate Limiting**: Integrated with existing throttler system

## Database Migration

⚠️ **Database credentials required**: Update `DIRECT_URL` in `backend/.env` with your Supabase password before running migrations.

After configuring credentials, run:

```bash
cd backend
npx prisma migrate dev --name update_api_keys_with_revoked_at
```

**Migration adds:**
- `revoked_at` column for soft delete
- `updated_at` column for audit trail
- Additional indexes on `key_prefix` and `expires_at`

## Requirements Satisfied

- ✅ Requirement 19.8: API key management for third-party integrations
- ✅ Requirement 19.1: Rate limiting (via existing throttler)
- ✅ Requirement 19.2: Input validation (via class-validator)
- ✅ Requirement 19.5: Request logging (via existing audit system)

## Files Created/Modified

### Created:
- `backend/src/modules/auth/api-key.service.ts`
- `backend/src/modules/auth/api-key.controller.ts`
- `backend/src/modules/auth/dto/api-key.dto.ts`
- `backend/src/common/guards/api-key.guard.ts`
- `backend/src/common/decorators/scopes.decorator.ts`

### Modified:
- `backend/prisma/schema.prisma` - Added ApiKey model
- `backend/src/modules/auth/auth.module.ts` - Added ApiKeyService and ApiKeyController

## Next Steps

1. Run `npx prisma generate` to generate Prisma client with ApiKey model
2. Run `npx prisma migrate dev` to create database migration
3. Test API key creation and validation
4. Add API key rate limiting configuration
5. Document API key scopes for third-party developers
