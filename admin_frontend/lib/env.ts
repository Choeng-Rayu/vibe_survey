import { z } from 'zod';

/**
 * Environment Variables Schema
 * Validates all NEXT_PUBLIC_ environment variables for the admin frontend
 * Uses Zod for runtime validation with type inference
 */

const envSchema = z.object({
  // API Configuration
  NEXT_PUBLIC_API_URL: z
    .string()
    .url('NEXT_PUBLIC_API_URL must be a valid URL')
    .default('http://localhost:3000'),

  // Application Configuration
  NEXT_PUBLIC_APP_NAME: z
    .string()
    .min(1, 'NEXT_PUBLIC_APP_NAME is required')
    .default('Vibe Survey Admin'),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .default('http://localhost:3003'),

  // Pagination & Data Display
  NEXT_PUBLIC_DEFAULT_PAGE_SIZE: z
    .string()
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed < 1) {
        return 25;
      }
      return parsed;
    })
    .default('25'),

  // Real-time Updates
  NEXT_PUBLIC_QUEUE_REFRESH_INTERVAL: z
    .string()
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed < 1000) {
        return 30000; // Minimum 1 second, default 30 seconds
      }
      return parsed;
    })
    .default('30000'),

  // Session & Security
  NEXT_PUBLIC_SESSION_TIMEOUT_MINUTES: z
    .string()
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed) || parsed < 5) {
        return 30; // Minimum 5 minutes, default 30 minutes
      }
      return parsed;
    })
    .default('30'),
});

export type EnvVariables = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 * Throws error if validation fails in development
 * Returns validated config with defaults applied
 */
function parseEnv(): EnvVariables {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      
      const message = `Environment validation failed:\n${errorMessages}`;
      
      // In development, throw immediately to catch configuration errors
      if (process.env.NODE_ENV === 'development') {
        throw new Error(message);
      }
      
      // In production, log error but continue with defaults (if possible)
      // eslint-disable-next-line no-console
      console.error('Environment validation warning:', message);
    }
    
    // Return defaults as fallback
    return envSchema.parse({});
  }
}

// Singleton instance of validated environment variables
const env: EnvVariables = parseEnv();

/**
 * Get a specific environment variable
 * All variables are guaranteed to be validated and have defaults
 */
export function getEnv<K extends keyof EnvVariables>(key: K): EnvVariables[K] {
  return env[key];
}

/**
 * Get all environment variables
 */
export function getAllEnv(): EnvVariables {
  return { ...env };
}

/**
 * Check if environment is in development mode
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Check if environment is in production mode
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export default env;
