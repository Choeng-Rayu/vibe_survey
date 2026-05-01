// Req 1.5: Typed configuration factory
export default () => ({
  app: {
    port: parseInt(process.env['PORT'] ?? '3000', 10),
    nodeEnv: process.env['NODE_ENV'] ?? 'development',
    corsOrigins: (process.env['CORS_ORIGINS'] ?? 'http://localhost:3001,http://localhost:3002,http://localhost:3003').split(','),
    logLevel: process.env['LOG_LEVEL'] ?? 'debug',
  },
  database: {
    url: process.env['DATABASE_URL'],
    directUrl: process.env['DIRECT_URL'],
  },
  redis: {
    url: process.env['REDIS_URL'] ?? 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env['JWT_SECRET'],
    refreshSecret: process.env['JWT_REFRESH_SECRET'],
    accessExpiration: process.env['JWT_ACCESS_EXPIRATION'] ?? '15m',
    refreshExpiration: process.env['JWT_REFRESH_EXPIRATION'] ?? '7d',
  },
  encryption: {
    key: process.env['ENCRYPTION_KEY'],
  },
  ai: {
    nvidiaApiKey: process.env['NVIDIA_API_KEY'],
    modelName: process.env['MODEL_NAME'] ?? 'gpt-oss-120b',
    rateLimit: parseInt(process.env['AI_RATE_LIMIT'] ?? '100', 10),
  },
  storage: {
    maxFileSize: parseInt(process.env['MAX_FILE_SIZE'] ?? '10485760', 10),
    allowedTypes: (process.env['ALLOWED_FILE_TYPES'] ?? 'image/jpeg,image/png,application/pdf').split(','),
  },
  bakong: {
    apiUrl: process.env['BAKONG_API_URL'] ?? 'https://api-bakong.nbc.gov.kh/v1',
    merchantId: process.env['BAKONG_MERCHANT_ID'],
    phoneNumber: process.env['BAKONG_PHONE_NUMBER'],
    developerToken: process.env['BAKONG_DEVELOPER_TOKEN'],
    merchantName: process.env['BAKONG_MERCHANT_NAME'] ?? 'Vibe Survey',
    merchantCity: process.env['BAKONG_MERCHANT_CITY'] ?? 'Phnom Penh',
  },
});
