import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432'),
  DB_NAME: z.string().default('agency_v2_db'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  JWT_SECRET: z.string().min(16, 'JWT secret must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z.string().min(16, 'JWT refresh secret must be at least 16 characters'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('*'),
  ADMIN_EMAIL: z.string().default('admin@vanta.studio'),
  ADMIN_PASSWORD: z.string().default('admin123'),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
});

const parseEnv = () => {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Environment variable validation failed');
  }

  const data = result.data;

  // Strict production security validation
  if (data.NODE_ENV === 'production') {
    if (data.ADMIN_PASSWORD === 'admin123') {
      console.warn('⚠️ WARNING: ADMIN_PASSWORD is set to default "admin123". Change ADMIN_PASSWORD in production!');
    }
    if (data.JWT_SECRET.includes('vanta_agency_jwt_access_secret')) {
      console.warn('⚠️ WARNING: JWT_SECRET is using the default development key. Set a secure random string in production!');
    }
    if (data.JWT_REFRESH_SECRET.includes('vanta_agency_jwt_refresh_secret')) {
      console.warn('⚠️ WARNING: JWT_REFRESH_SECRET is using the default development key. Set a secure random string in production!');
    }
  }

  return data;
};

export const env = parseEnv();

