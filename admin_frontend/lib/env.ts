import { z } from 'zod';

/**
 * Environment Variables Schema - Req 1.6
 * Validates all NEXT_PUBLIC_ environment variables for the admin frontend
 */

const envSchema = z.object({
  // API Configuration
  NEXT_PUBLIC_API_BASE_URL: z
    .string()
    .url()
    .default('http://localhost:3000/api/v1'),

  NEXT_PUBLIC_API_TIMEOUT: z
    .string()
    .default('30000'),

  // Application Configuration
  NEXT_PUBLIC_APP_NAME: z
    .string()
    .default('Vibe Survey Admin'),

  NEXT_PUBLIC_APP_URL: z
    .string()
    .url()
    .default('http://localhost:3003'),

  // Session & Security
  NEXT_PUBLIC_SESSION_TIMEOUT: z
    .string()
    .default('1800000'),

  NEXT_PUBLIC_TOKEN_REFRESH_INTERVAL: z
    .string()
    .default('300000'),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_MFA: z
    .string()
    .default('true'),

  NEXT_PUBLIC_ENABLE_AUDIT_LOGGING: z
    .string()
    .default('true'),
});

export type EnvVariables = z.infer<typeof envSchema>;

function parseEnv(): EnvVariables {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = (error as any).errors
        .map((err: any) => `${err.path.join('.')}: ${err.message}`)
        .join('\n');
      
      if (process.env.NODE_ENV === 'development') {
        throw new Error(`Environment validation failed:\n${errorMessages}`);
      }
      
      console.error('Environment validation warning:', errorMessages);
    }
    
    return envSchema.parse({});
  }
}

const env: EnvVariables = parseEnv();

export function getEnv<K extends keyof EnvVariables>(key: K): EnvVariables[K] {
  return env[key];
}

export function getAllEnv(): EnvVariables {
  return { ...env };
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export default env;
