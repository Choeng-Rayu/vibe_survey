# Unified API Routes Design

## Overview

This document defines the comprehensive REST API routes for the Vibe Survey platform, ensuring consistency across all frontend services (Survey Creator Frontend, Survey Taker Frontend, System Admin Frontend) and the AI Survey Builder Agent. The API follows RESTful principles and implements proper versioning, authentication, and error handling.

## Base URL Structure

```
https://api.vibesurvey.com/api/v1
```

## Authentication

All API endpoints require authentication via JWT tokens in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Common Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2024-04-28T10:00:00Z",
    "version": "1.0",
    "requestId": "uuid"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {},
    "timestamp": "2024-04-28T10:00:00Z"
  },
  "meta": {
    "requestId": "uuid"
  }
}
```

## 1. Authentication & Authorization Routes

### User Authentication
```http
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
POST /api/v1/auth/verify-phone
POST /api/v1/auth/forgot-password
POST /api/v1/auth/reset-password
GET  /api/v1/auth/me
```

### OAuth Integration
```http
GET  /api/v1/auth/oauth/google
GET  /api/v1/auth/oauth/facebook
POST /api/v1/auth/oauth/callback
```

### Multi-Factor Authentication
```http
POST /api/v1/auth/mfa/enable
POST /api/v1/auth/mfa/disable
POST /api/v1/auth/mfa/verify
```

## 2. User Management Routes

### Profile Management
```http
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
GET    /api/v1/users/preferences
PUT    /api/v1/users/preferences
DELETE /api/v1/users/account
```

### Trust & Reputation
```http
GET /api/v1/users/trust-tier
GET /api/v1/users/reputation
GET /api/v1/users/badges
```

### Notifications
```http
GET    /api/v1/users/notifications
PUT    /api/v1/users/notifications/:id/read
POST   /api/v1/users/notifications/mark-all-read
PUT    /api/v1/users/notifications/preferences
```

### Push Notifications
```http
POST   /api/v1/users/push/subscribe
DELETE /api/v1/users/push/unsubscribe
PUT    /api/v1/users/push/preferences
```

## 3. Survey Management Routes

### Survey CRUD Operations
```http
POST   /api/v1/surveys
GET    /api/v1/surveys
GET    /api/v1/surveys/:id
PUT    /api/v1/surveys/:id
DELETE /api/v1/surveys/:id
POST   /api/v1/surveys/:id/duplicate
```

### Survey Validation & Preview
```http
POST /api/v1/surveys/validate
GET  /api/v1/surveys/:id/preview
GET  /api/v1/surveys/:id/flow-diagram
```

### Survey Versioning
```http
GET  /api/v1/surveys/:id/versions
POST /api/v1/surveys/:id/rollback
GET  /api/v1/surveys/:id/versions/:version
```

### Survey Templates & Question Bank
```http
GET  /api/v1/surveys/templates
GET  /api/v1/surveys/templates/:id
POST /api/v1/surveys/templates
GET  /api/v1/surveys/question-bank
POST /api/v1/surveys/question-bank
```

## 4. AI Survey Builder Routes

### AI Generation & Modification
```http
POST /api/v1/surveys/ai/generate
POST /api/v1/surveys/:id/ai/modify
POST /api/v1/surveys/:id/ai/enhance
POST /api/v1/surveys/:id/ai/analyze
POST /api/v1/surveys/:id/ai/translate
```

### AI Conversation Management
```http
GET  /api/v1/surveys/:id/ai/conversation
POST /api/v1/surveys/:id/ai/conversation/clear
GET  /api/v1/surveys/ai/conversation/:conversationId
```

### AI Rate Limiting & Status
```http
GET /api/v1/surveys/ai/quota
GET /api/v1/surveys/ai/status
```

## 5. Survey Import/Export Routes

### Import Operations
```http
POST /api/v1/surveys/import
GET  /api/v1/surveys/import/status/:jobId
POST /api/v1/surveys/import/preview
POST /api/v1/surveys/import/validate
```

### Export Operations
```http
GET  /api/v1/surveys/:id/export
POST /api/v1/surveys/:id/export/async
GET  /api/v1/surveys/export/status/:jobId
GET  /api/v1/surveys/export/download/:jobId
```

## 6. Campaign Management Routes

### Campaign CRUD Operations
```http
POST   /api/v1/campaigns
GET    /api/v1/campaigns
GET    /api/v1/campaigns/:id
PUT    /api/v1/campaigns/:id
DELETE /api/v1/campaigns/:id
POST   /api/v1/campaigns/:id/duplicate
```

### Campaign Lifecycle Management
```http
POST /api/v1/campaigns/:id/submit
POST /api/v1/campaigns/:id/activate
POST /api/v1/campaigns/:id/pause
POST /api/v1/campaigns/:id/resume
POST /api/v1/campaigns/:id/archive
```

### Campaign Status & History
```http
GET /api/v1/campaigns/:id/status
GET /api/v1/campaigns/:id/history
GET /api/v1/campaigns/:id/timeline
```

## 7. Audience Targeting Routes

### Targeting Configuration
```http
POST /api/v1/campaigns/:id/targeting
GET  /api/v1/campaigns/:id/targeting
PUT  /api/v1/campaigns/:id/targeting
```

### Audience Estimation & Analysis
```http
POST /api/v1/targeting/estimate
GET  /api/v1/targeting/demographics
GET  /api/v1/targeting/interests
GET  /api/v1/targeting/behaviors
```

### Lookalike Audiences
```http
POST /api/v1/targeting/lookalike
GET  /api/v1/targeting/lookalike/:id
```

## 8. Budget & Billing Routes

### Wallet Management
```http
GET  /api/v1/billing/wallet
POST /api/v1/billing/wallet/topup
GET  /api/v1/billing/wallet/transactions
```

### Campaign Budget Management
```http
GET /api/v1/campaigns/:id/budget
PUT /api/v1/campaigns/:id/budget
POST /api/v1/campaigns/:id/budget/topup
GET /api/v1/campaigns/:id/budget/history
```

### Invoicing & Payment Methods
```http
GET    /api/v1/billing/invoices
GET    /api/v1/billing/invoices/:id
POST   /api/v1/billing/payment-methods
GET    /api/v1/billing/payment-methods
DELETE /api/v1/billing/payment-methods/:id
```

## 9. Survey Taking Routes

### Survey Discovery & Feed
```http
GET /api/v1/surveys/feed
GET /api/v1/surveys/feed/personalized
GET /api/v1/surveys/recommendations
```

### Survey Participation
```http
GET  /api/v1/surveys/:id/screener
POST /api/v1/surveys/:id/screener
GET  /api/v1/surveys/:id/questions
POST /api/v1/surveys/:id/start
```

### Response Management
```http
POST /api/v1/surveys/:id/responses
PUT  /api/v1/surveys/:id/responses/autosave
GET  /api/v1/surveys/:id/responses/resume
POST /api/v1/surveys/:id/complete
```

### Survey History
```http
GET /api/v1/users/surveys/history
GET /api/v1/users/surveys/in-progress
GET /api/v1/users/surveys/completed
```

## 10. Rewards & Payout Routes

### Wallet & Balance
```http
GET /api/v1/rewards/wallet
GET /api/v1/rewards/balance
GET /api/v1/rewards/transactions
```

### Withdrawal Management
```http
POST /api/v1/rewards/withdraw
GET  /api/v1/rewards/withdrawals
PUT  /api/v1/rewards/withdrawals/:id/retry
GET  /api/v1/rewards/withdrawals/:id/status
```

### Payment Methods & Exchange Rates
```http
GET /api/v1/rewards/payment-methods
POST /api/v1/rewards/payment-methods
GET /api/v1/rewards/exchange-rates
```

## 11. Analytics & Reporting Routes

### Campaign Analytics
```http
GET /api/v1/campaigns/:id/analytics
GET /api/v1/campaigns/:id/analytics/real-time
GET /api/v1/campaigns/:id/responses
GET /api/v1/campaigns/:id/demographics
GET /api/v1/campaigns/:id/quality
```

### Dashboard & Trends
```http
GET /api/v1/analytics/dashboard
GET /api/v1/analytics/trends
GET /api/v1/analytics/benchmarks
```

### Data Export & Reports
```http
POST /api/v1/campaigns/:id/export
GET  /api/v1/analytics/reports
POST /api/v1/analytics/reports/schedule
```

## 12. Admin Management Routes

### Campaign Review & Moderation
```http
GET  /api/v1/admin/campaigns/review-queue
POST /api/v1/admin/campaigns/:id/approve
POST /api/v1/admin/campaigns/:id/reject
POST /api/v1/admin/campaigns/:id/request-revision
```

### Content Moderation
```http
GET  /api/v1/admin/moderation/queue
POST /api/v1/admin/moderation/:id/action
GET  /api/v1/admin/moderation/reports
```

### User Account Management
```http
GET    /api/v1/admin/users
GET    /api/v1/admin/users/:id
PUT    /api/v1/admin/users/:id/status
POST   /api/v1/admin/users/:id/suspend
POST   /api/v1/admin/users/:id/ban
DELETE /api/v1/admin/users/:id/ban
```

### Data Management & Governance
```http
GET    /api/v1/admin/data/quality
POST   /api/v1/admin/data/export
DELETE /api/v1/admin/data/responses/:id
GET    /api/v1/admin/data/retention
POST   /api/v1/admin/data/anonymize
```

### Compliance Management
```http
GET  /api/v1/admin/compliance/requests
POST /api/v1/admin/compliance/requests/:id/approve
POST /api/v1/admin/compliance/requests/:id/deny
GET  /api/v1/admin/compliance/settings
PUT  /api/v1/admin/compliance/settings
```

## 13. System Configuration Routes

### Platform Configuration
```http
GET /api/v1/admin/config/platform
PUT /api/v1/admin/config/platform
GET /api/v1/admin/config/features
PUT /api/v1/admin/config/features/:feature
```

### Rate Limiting & Security
```http
GET /api/v1/admin/config/limits
PUT /api/v1/admin/config/limits
GET /api/v1/admin/security/settings
PUT /api/v1/admin/security/settings
```

### System Health & Monitoring
```http
GET /api/v1/admin/system/health
GET /api/v1/admin/system/metrics
GET /api/v1/admin/system/logs
```

## 14. Audit & Logging Routes

### Audit Trail
```http
GET /api/v1/admin/audit-logs
GET /api/v1/admin/audit-logs/export
GET /api/v1/admin/audit-logs/search
```

### System Logs
```http
GET /api/v1/admin/logs/application
GET /api/v1/admin/logs/security
GET /api/v1/admin/logs/performance
```

## 15. Notification & Communication Routes

### Notification Management
```http
GET    /api/v1/notifications
POST   /api/v1/notifications/send
GET    /api/v1/notifications/templates
POST   /api/v1/notifications/templates
PUT    /api/v1/notifications/templates/:id
DELETE /api/v1/notifications/templates/:id
```

### Webhook Management
```http
POST   /api/v1/webhooks/register
GET    /api/v1/webhooks
PUT    /api/v1/webhooks/:id
DELETE /api/v1/webhooks/:id
POST   /api/v1/webhooks/:id/test
```

## 16. File Management Routes

### File Upload & Storage
```http
POST   /api/v1/files/upload
GET    /api/v1/files/:id
DELETE /api/v1/files/:id
GET    /api/v1/files/:id/metadata
```

### Temporary Files & URLs
```http
POST /api/v1/files/temporary
GET  /api/v1/files/temporary/:id/url
```

## 17. Real-Time Communication Routes

### WebSocket Endpoints
```http
WS /api/v1/ws/notifications
WS /api/v1/ws/analytics/:campaignId
WS /api/v1/ws/survey/:surveyId/responses
```

### Server-Sent Events
```http
GET /api/v1/sse/notifications
GET /api/v1/sse/analytics/:campaignId
GET /api/v1/sse/system/status
```

## 18. Integration & Third-Party Routes

### API Keys & OAuth
```http
POST   /api/v1/integration/api-keys
GET    /api/v1/integration/api-keys
DELETE /api/v1/integration/api-keys/:id
POST   /api/v1/integration/oauth/authorize
POST   /api/v1/integration/oauth/token
```

### External Service Integration
```http
POST /api/v1/integration/payment-providers
GET  /api/v1/integration/payment-providers
POST /api/v1/integration/ai-services
GET  /api/v1/integration/ai-services/status
```

## Request/Response Examples

### Survey Creation Request
```http
POST /api/v1/surveys
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "Customer Satisfaction Survey",
  "description": "Measure customer satisfaction with our service",
  "canonical_json": {
    "version": "1.0",
    "metadata": {
      "title": "Customer Satisfaction Survey",
      "language": "en",
      "category": "customer_feedback"
    },
    "sections": [
      {
        "id": "section_1",
        "questions": [
          {
            "id": "q1",
            "type": "rating_scale",
            "text": "How satisfied are you with our service?",
            "required": true,
            "options": [
              {"id": "opt1", "text": "Very Dissatisfied", "value": "1"},
              {"id": "opt2", "text": "Dissatisfied", "value": "2"},
              {"id": "opt3", "text": "Neutral", "value": "3"},
              {"id": "opt4", "text": "Satisfied", "value": "4"},
              {"id": "opt5", "text": "Very Satisfied", "value": "5"}
            ]
          }
        ]
      }
    ]
  }
}
```

### Survey Creation Response
```http
HTTP/1.1 201 Created
Content-Type: application/json

{
  "success": true,
  "data": {
    "id": "survey_123",
    "title": "Customer Satisfaction Survey",
    "status": "draft",
    "created_at": "2024-04-28T10:00:00Z",
    "updated_at": "2024-04-28T10:00:00Z",
    "canonical_json": { ... }
  },
  "meta": {
    "timestamp": "2024-04-28T10:00:00Z",
    "version": "1.0",
    "requestId": "req_456"
  }
}
```

### Campaign Analytics Request
```http
GET /api/v1/campaigns/camp_123/analytics?start_date=2024-04-01&end_date=2024-04-28
Authorization: Bearer <token>
```

### Campaign Analytics Response
```http
HTTP/1.1 200 OK
Content-Type: application/json

{
  "success": true,
  "data": {
    "campaign_id": "camp_123",
    "period": {
      "start_date": "2024-04-01",
      "end_date": "2024-04-28"
    },
    "metrics": {
      "total_responses": 1250,
      "qualified_responses": 1100,
      "completion_rate": 88.0,
      "average_completion_time": 180,
      "cost_per_response": 2.50,
      "fraud_score_distribution": {
        "high_quality": 85.5,
        "suspicious": 12.3,
        "likely_fraud": 2.2
      }
    },
    "demographics": {
      "age_groups": {
        "18-24": 25.5,
        "25-34": 35.2,
        "35-44": 22.1,
        "45-54": 12.8,
        "55+": 4.4
      },
      "gender": {
        "male": 48.2,
        "female": 51.8
      }
    }
  },
  "meta": {
    "timestamp": "2024-04-28T10:00:00Z",
    "version": "1.0",
    "requestId": "req_789"
  }
}
```

## Error Handling Examples

### Validation Error
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": {
      "field_errors": [
        {
          "field": "title",
          "message": "Title is required and must be between 1 and 255 characters"
        },
        {
          "field": "canonical_json.sections",
          "message": "At least one section is required"
        }
      ]
    },
    "timestamp": "2024-04-28T10:00:00Z"
  },
  "meta": {
    "requestId": "req_error_123"
  }
}
```

### Authentication Error
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired authentication token",
    "details": {
      "token_status": "expired",
      "expires_at": "2024-04-28T09:00:00Z"
    },
    "timestamp": "2024-04-28T10:00:00Z"
  },
  "meta": {
    "requestId": "req_auth_error_456"
  }
}
```

### Rate Limit Error
```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 3600

{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "AI request quota exceeded",
    "details": {
      "limit": 100,
      "remaining": 0,
      "reset_time": "2024-04-28T11:00:00Z",
      "retry_after": 3600
    },
    "timestamp": "2024-04-28T10:00:00Z"
  },
  "meta": {
    "requestId": "req_rate_limit_789"
  }
}
```

## Pagination

All list endpoints support cursor-based pagination:

### Request Parameters
```
?limit=20&cursor=eyJpZCI6IjEyMyIsImNyZWF0ZWRfYXQiOiIyMDI0LTA0LTI4VDEwOjAwOjAwWiJ9
```

### Response Format
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "has_more": true,
      "next_cursor": "eyJpZCI6IjQ1NiIsImNyZWF0ZWRfYXQiOiIyMDI0LTA0LTI4VDEwOjMwOjAwWiJ9",
      "total_count": 1500,
      "limit": 20
    }
  }
}
```

## Filtering and Sorting

### Query Parameters
```
?filter[status]=active&filter[category]=customer_feedback&sort=-created_at,title
```

### Supported Operators
- `eq` (equals) - default
- `ne` (not equals)
- `gt` (greater than)
- `gte` (greater than or equal)
- `lt` (less than)
- `lte` (less than or equal)
- `in` (in array)
- `contains` (string contains)

### Example
```
?filter[created_at][gte]=2024-04-01&filter[status][in]=active,paused&sort=-created_at
```

## API Versioning

### URL Versioning
Current version: `/api/v1/`
Future version: `/api/v2/`

### Version Headers
```http
X-API-Version: 1.0
X-Deprecated-Version: false
X-Sunset-Date: 2025-04-28T00:00:00Z
```

## Security Headers

All responses include security headers:
```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
```

## Rate Limiting

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1714305600
X-RateLimit-Window: 3600
```

### Rate Limit Tiers
- **Free Tier**: 100 requests/hour
- **Basic Tier**: 1,000 requests/hour  
- **Premium Tier**: 10,000 requests/hour
- **Enterprise Tier**: 100,000 requests/hour

## Caching

### Cache Headers
```http
Cache-Control: public, max-age=300
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
Last-Modified: Mon, 28 Apr 2024 10:00:00 GMT
```

### Cache Strategy
- **Static Data**: 1 hour cache
- **User Data**: 5 minutes cache
- **Real-time Data**: No cache
- **Analytics**: 30 seconds cache

This unified API design ensures consistency across all frontend applications while providing comprehensive functionality for the entire Vibe Survey platform ecosystem.