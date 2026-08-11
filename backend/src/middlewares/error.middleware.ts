import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { env } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (err: AppError, req: Request, res: Response, _next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_SERVER_ERROR';
  logger.error(`[${req.method}] ${req.url} - ${statusCode} - ${message}`);
  res.status(statusCode).json({
    success: false,
    error: { code, message, ...(env.NODE_ENV === 'development' && { stack: err.stack }) },
  });
};
