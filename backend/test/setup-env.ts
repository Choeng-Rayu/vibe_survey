process.env.NODE_ENV = 'test';
process.env.DATABASE_URL ??= 'postgresql://test:test@localhost:5432/test';
process.env.JWT_SECRET ??= 'test-access-secret-with-at-least-thirty-two-chars';
process.env.JWT_REFRESH_SECRET ??= 'test-refresh-secret-with-at-least-thirty-two-chars';
process.env.REDIS_HOST ??= 'localhost';
process.env.REDIS_PORT ??= '6379';
