import { env } from '../config/env';

// Production & Serverless Console Logger
export const logger = {
  info: (message: string) => {
    console.log(`[${new Date().toISOString()}] [INFO]: ${message}`);
  },
  warn: (message: string) => {
    console.warn(`[${new Date().toISOString()}] [WARN]: ${message}`);
  },
  error: (message: string) => {
    console.error(`[${new Date().toISOString()}] [ERROR]: ${message}`);
  },
  http: (message: string) => {
    console.log(`[${new Date().toISOString()}] [HTTP]: ${message}`);
  },
  debug: (message: string) => {
    if (env.NODE_ENV === 'development') {
      console.log(`[${new Date().toISOString()}] [DEBUG]: ${message}`);
    }
  },
};
