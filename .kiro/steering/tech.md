# Technology Stack

## Backend Architecture

**Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Caching**: Redis for performance optimization
- **Queue System**: Bull for background job processing
- **Real-time**: WebSocket and Server-Sent Events (SSE)

## Frontend Applications

**Framework**: Next.js 16.2.4 with React 19.2.4
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript 5+
- **Build Tool**: Next.js built-in bundler

## Development Tools

**Code Quality**:
- ESLint for linting
- Prettier for code formatting (single quotes, trailing commas)
- TypeScript strict mode enabled

**Testing**:
- Jest for unit and integration testing
- Supertest for API testing
- Property-based testing for critical business logic
- Target: >90% test coverage

## Common Commands

### Backend (NestJS)
```bash
# Development
npm run start:dev          # Start with hot reload
npm run start:debug        # Start with debugging

# Building
npm run build              # Build for production
npm run start:prod         # Start production build

# Testing
npm run test               # Run unit tests
npm run test:watch         # Run tests in watch mode
npm run test:cov           # Run with coverage
npm run test:e2e           # Run end-to-end tests

# Code Quality
npm run lint               # Run ESLint with auto-fix
npm run format             # Format code with Prettier
```

### Frontend Applications
```bash
# Development
npm run dev                # Start development server

# Building
npm run build              # Build for production
npm run start              # Start production build

# Code Quality
npm run lint               # Run ESLint
```

## Configuration Standards

**Environment Variables**: Use .env files with validation
**Database**: Prisma migrations for schema changes
**Security**: Rate limiting, input validation, CORS configuration
**Performance**: Connection pooling, caching strategies, pagination
**Monitoring**: Health checks, structured logging, error tracking