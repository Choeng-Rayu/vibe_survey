# Project Structure

## Repository Organization

The Vibe Survey platform follows a multi-application monorepo structure with clear separation of concerns:

```
├── backend/                    # NestJS API server
├── admin_frontend/             # System Admin Dashboard (Next.js)
├── survey_creator_frontend/    # Advertiser Interface (Next.js)
├── survey_taker_frontend/      # Survey Taker App (Next.js)
└── .kiro/                      # Kiro configuration and specs
    ├── specs/                  # Feature specifications
    ├── steering/               # Development guidelines
    └── hooks/                  # Automation hooks
```

## Backend Structure (NestJS)

```
backend/
├── src/
│   ├── app.module.ts          # Root application module
│   ├── main.ts                # Application entry point
│   ├── auth/                  # Authentication & authorization
│   ├── users/                 # User management
│   ├── surveys/               # Survey CRUD operations
│   ├── campaigns/             # Campaign management
│   ├── analytics/             # Reporting & analytics
│   ├── payments/              # Payment processing
│   ├── admin/                 # Admin operations
│   ├── common/                # Shared utilities
│   │   ├── guards/            # Authentication guards
│   │   ├── interceptors/      # Cross-cutting concerns
│   │   ├── pipes/             # Validation pipes
│   │   └── dto/               # Data transfer objects
│   └── database/              # Prisma configuration
├── test/                      # E2E tests
├── prisma/                    # Database schema & migrations
└── package.json
```

## Frontend Structure (Next.js Apps)

Each frontend application follows Next.js 16+ app router structure:

```
{app_name}/
├── app/
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── globals.css            # Global styles
│   └── {feature}/             # Feature-based routing
├── components/                # Reusable UI components
├── lib/                       # Utility functions
├── public/                    # Static assets
├── package.json
└── next.config.ts
```

## Naming Conventions

**Directories**: snake_case for top-level apps, kebab-case for features
**Files**: 
- Components: PascalCase (UserProfile.tsx)
- Pages: lowercase (page.tsx, layout.tsx)
- Utilities: camelCase (apiClient.ts)
- Constants: UPPER_SNAKE_CASE

**Database**: snake_case for tables and columns
**API Endpoints**: kebab-case for routes (/api/survey-responses)

## Module Organization

**Domain-Driven Design**: Each major feature area has its own module
**Layered Architecture**: Controller → Service → Repository pattern
**Shared Code**: Common utilities in dedicated modules
**Configuration**: Environment-based configuration with validation

## File Placement Rules

- **Business Logic**: Keep in service classes
- **Data Access**: Isolate in repository pattern
- **Validation**: Use DTOs with class-validator
- **Types**: Define interfaces in dedicated files
- **Tests**: Co-locate with source files (.spec.ts suffix)