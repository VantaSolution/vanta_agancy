import { Pool } from 'pg';
import { env } from './env';

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || env.DIRECT_URL || env.DATABASE_URL;

export const pool = new Pool(
  connectionString
    ? {
        connectionString,
        ssl: connectionString && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1')
          ? { rejectUnauthorized: false }
          : undefined,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      }
    : {
        host: env.DB_HOST,
        port: parseInt(env.DB_PORT, 10),
        database: env.DB_NAME,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
);

pool.on('error', (err) => {
  console.error('Unexpected database connection error on idle client', err);
});

export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (env.NODE_ENV === 'development') {
    console.log(`[DB Query] executed in ${duration}ms - rows: ${res.rowCount}`);
  }
  return res;
};
