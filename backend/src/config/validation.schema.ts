import Joi from 'joi';

// Req 1.5: App fails to start with missing required env vars
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  PORT: Joi.number().default(3000),

  // Required in production, optional in dev (allows local prisma dev)
  DATABASE_URL: Joi.string().required(),
  DIRECT_URL: Joi.string().optional(),

  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_ACCESS_EXPIRATION: Joi.string().default('15m'),
  JWT_REFRESH_EXPIRATION: Joi.string().default('7d'),

  ENCRYPTION_KEY: Joi.string().optional(),
  CORS_ORIGINS: Joi.string().default(
    'http://localhost:3001,http://localhost:3002,http://localhost:3003',
  ),
  LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'debug', 'verbose').default('debug'),

  REDIS_URL: Joi.string().default('redis://localhost:6379'),

  // Optional integrations
  NVIDIA_API_KEY: Joi.string().optional(),
  MODEL_NAME: Joi.string().default('gpt-oss-120b'),
  AI_RATE_LIMIT: Joi.number().default(100),
  MAX_FILE_SIZE: Joi.number().default(10485760),
  ALLOWED_FILE_TYPES: Joi.string().default('image/jpeg,image/png,application/pdf'),

  SUPABASE_URL: Joi.string().optional(),
  SUPABASE_SERVICE_KEY: Joi.string().optional(),
});
