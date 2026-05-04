# Testing Infrastructure Documentation

## Overview

Comprehensive testing infrastructure for the Vibe Survey backend with >90% code coverage target.

## Test Types

### Unit Tests
- **Location**: `src/**/*.spec.ts`
- **Purpose**: Test individual service methods and business logic
- **Coverage Target**: >90%
- **Run**: `npm run test:unit`

### Integration Tests
- **Location**: `test/**/*.e2e-spec.ts`
- **Purpose**: Test API endpoints and database operations
- **Run**: `npm run test:e2e`

### E2E Tests
- **Location**: `test/**/*.e2e-spec.ts`
- **Purpose**: Test complete user workflows
- **Run**: `npm run test:e2e`

## Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run tests with HTML coverage report
npm run test:cov:html

# Run only unit tests
npm run test:unit

# Run E2E tests
npm run test:e2e

# Run tests in CI mode
npm run test:ci

# Debug tests
npm run test:debug
```

## Test Utilities

### TestHelper
Located in `test/utils/test-helper.ts`

```typescript
import { TestHelper } from '../test/utils/test-helper';

// Create testing module with mocked dependencies
const module = await TestHelper.createTestingModule([YourService]);

// Get mock Prisma service
const prisma = TestHelper.mockPrismaService();

// Get mock cache service
const cache = TestHelper.mockCacheService();
```

### Test Factories

#### UserFactory
```typescript
import { UserFactory } from '../test/factories/user.factory';

const user = UserFactory.create();
const advertiser = UserFactory.createAdvertiser();
const admin = UserFactory.createAdmin();
const users = UserFactory.createMany(10);
```

#### SurveyFactory
```typescript
import { SurveyFactory } from '../test/factories/survey.factory';

const survey = SurveyFactory.create();
const activeSurvey = SurveyFactory.createActive();
const surveys = SurveyFactory.createMany(5);
```

#### CampaignFactory
```typescript
import { CampaignFactory } from '../test/factories/campaign.factory';

const campaign = CampaignFactory.create();
const activeCampaign = CampaignFactory.createActive();
```

## Writing Tests

### Unit Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';
import { TestHelper } from '../test/utils/test-helper';

describe('YourService', () => {
  let service: YourService;
  let prisma: any;

  beforeEach(async () => {
    const module = await TestHelper.createTestingModule([YourService]);
    service = module.get<YourService>(YourService);
    prisma = module.get(PrismaService);
  });

  describe('yourMethod', () => {
    it('should do something', async () => {
      prisma.model.findUnique.mockResolvedValue({ id: '1' });
      
      const result = await service.yourMethod('1');
      
      expect(result).toBeDefined();
      expect(prisma.model.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
```

### E2E Test Example

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('YourEndpoint (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/endpoint (GET)', () => {
    return request(app.getHttpServer())
      .get('/endpoint')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
      });
  });
});
```

## Coverage Requirements

- **Global**: 90% minimum for lines, functions, branches, statements
- **Service Layer**: >90% coverage required
- **Controllers**: >80% coverage required
- **Utilities**: 100% coverage required

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Changes in `backend/**` directory

### GitHub Actions Workflow
Located in `.github/workflows/test.yml`

**Steps**:
1. Setup PostgreSQL and Redis services
2. Install dependencies
3. Run linter
4. Run unit tests with coverage
5. Upload coverage to Codecov
6. Verify coverage threshold (90%)

## Best Practices

1. **Arrange-Act-Assert**: Structure tests clearly
2. **Mock External Dependencies**: Use TestHelper mocks
3. **Test One Thing**: Each test should verify one behavior
4. **Descriptive Names**: Use clear test descriptions
5. **Clean Up**: Use `beforeEach` and `afterEach` properly
6. **Avoid Test Interdependence**: Tests should run independently
7. **Use Factories**: Use test factories for consistent test data
8. **Test Edge Cases**: Include error scenarios and edge cases

## Troubleshooting

### Tests Timeout
Increase timeout in `test/setup.ts`:
```typescript
jest.setTimeout(30000); // 30 seconds
```

### Database Connection Issues
Ensure `DATABASE_URL` is set in test environment:
```bash
export DATABASE_URL="postgresql://test:test@localhost:5432/test"
```

### Mock Not Working
Verify mock is called before the service method:
```typescript
prisma.model.findUnique.mockResolvedValue(mockData);
const result = await service.method();
```

## Coverage Reports

### View HTML Report
```bash
npm run test:cov:html
open coverage/index.html
```

### View Terminal Report
```bash
npm run test:cov
```

## Property-Based Testing

For critical business logic, use property-based testing with `fast-check`:

```typescript
import * as fc from 'fast-check';

it('should satisfy property', () => {
  fc.assert(
    fc.property(fc.integer(), (n) => {
      const result = yourFunction(n);
      return result >= 0; // Property to verify
    })
  );
});
```

## Next Steps

1. Add more unit tests for remaining services
2. Implement integration tests for all API endpoints
3. Add E2E tests for critical user workflows
4. Set up performance testing for high-load scenarios
5. Implement contract testing for external services
