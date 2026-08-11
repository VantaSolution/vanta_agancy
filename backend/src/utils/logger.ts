import { env } from '../config/env';

// Diagnostic boot logging
console.log("[VANTA LOGGER] SERVERLESS-SAFE NATIVE CONSOLE LOGGER INITIALIZED");
console.log("[VANTA LOGGER] VERCEL:", Boolean(process.env.VERCEL));
console.log("[VANTA LOGGER] NODE_ENV:", process.env.NODE_ENV);

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
