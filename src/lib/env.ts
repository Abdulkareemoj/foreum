import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url().startsWith('postgresql://', 'DATABASE_URL must be a PostgreSQL connection string'),
  BETTER_AUTH_SECRET: z.string().min(32, 'BETTER_AUTH_SECRET must be at least 32 characters'),

  SMTP_HOST: z.string().optional().default('smtp.example.com'),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).optional().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  SMTP_SECURE: z.coerce.boolean().optional().default(false),
  SMTP_FROM: z.string().optional().default('noreply@localhost'),

  GOOGLE_CLIENT_ID: z.string().optional().default(''),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(''),
  DISCORD_CLIENT_ID: z.string().optional().default(''),
  DISCORD_CLIENT_SECRET: z.string().optional().default(''),

  BASE_URL: z.string().url().optional().default('http://localhost:3000'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional().default('info'),
  NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

export type Env = z.infer<typeof envSchema>;

let _env: Env | null = null;

/**
 * Validate and parse environment variables at startup.
 * Call this once in the server entrypoint. Throws a descriptive error if validation fails.
 */
export function validateEnv(): Env {
  if (_env) return _env;

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const formatted = parsed.error.flatten().fieldErrors;
    const lines = Object.entries(formatted)
      .map(([key, errors]) => `  ${key}: ${errors?.join(', ')}`)
      .join('\n');
    throw new Error(`Environment validation failed:\n${lines}`);
  }

  _env = parsed.data;
  return _env;
}

/**
 * Get validated env vars. Calls validateEnv() internally if not yet called.
 */
export function getEnv(): Env {
  if (!_env) return validateEnv();
  return _env;
}
