import winston from 'winston';
import { env } from '../config/env';

const levels = { error: 0, warn: 1, info: 2, http: 3, debug: 4 };
const colors = { error: 'red', warn: 'yellow', info: 'green', http: 'magenta', debug: 'white' };
winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `[${info.timestamp}] [${info.level}]: ${info.message}`)
);

const transports: winston.transport[] = [new winston.transports.Console()];

// Only add file transports in non-serverless local development environments
if (env.NODE_ENV === 'development' && !process.env.VERCEL) {
  try {
    transports.push(
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    );
  } catch (_e) {
    // Ignore file logger creation in read-only filesystems
  }
}

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format,
  transports,
});
