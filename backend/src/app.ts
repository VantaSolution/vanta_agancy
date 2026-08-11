import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';

// Import routes
import authRoutes from './routes/auth.routes';
import projectsRoutes from './routes/projects.routes';
import servicesRoutes from './routes/services.routes';
import messagesRoutes from './routes/messages.routes';
import contentRoutes from './routes/content.routes';
import settingsRoutes from './routes/settings.routes';
import mediaRoutes from './routes/media.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app: Application = express();

// Trust reverse proxy for Vercel deployment IP rate limiting
app.set('trust proxy', 1);

// Security
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (env.CORS_ORIGIN === '*' || env.NODE_ENV === 'development') return callback(null, true);
      const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
      if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);

// Rate limiting — Global API Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again later.' } },
});
app.use(globalLimiter);

// Rate limiting — Strict Auth Limiter (Prevents brute-force login attacks)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: { code: 'TOO_MANY_LOGIN_ATTEMPTS', message: 'Too many login attempts. Please try again after 15 minutes.' } },
});

// Rate limiting — Strict Contact Form Submission Limiter (Prevents spam submissions)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: { code: 'TOO_MANY_SUBMISSIONS', message: 'Too many form submissions. Please try again later.' } },
});

// Logging & Parsers
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (uploads)
const uploadsPath = path.join(__dirname, '../uploads');
if (fs.existsSync(uploadsPath)) {
  app.use('/uploads', express.static(uploadsPath));
}

// Root Status Endpoint
app.get(['/', '/api', '/api/index'], (_req, res) => {
  res.status(200).json({
    name: 'VANTA Agency API',
    version: '2.0.0',
    status: 'online',
    environment: env.NODE_ENV,
    endpoints: {
      health: '/api/health',
      healthDb: '/api/health/db',
      content: '/api/content',
      services: '/api/services',
      projects: '/api/projects',
      auth: '/api/auth/login',
    },
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoints
app.get(['/health', '/api/health'], (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'backend',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get(['/health/db', '/api/health/db'], async (_req, res) => {
  try {
    const { query } = require('./config/db');
    const result = await query('SELECT 1 as alive');
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      result: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      error: error?.message || 'Database query failed',
    });
  }
});

// API Routes (Support both /api/* and /*)
app.use(['/api/auth', '/auth'], authLimiter, authRoutes);
app.use(['/api/projects', '/projects'], projectsRoutes);
app.use(['/api/services', '/services'], servicesRoutes);
app.use(['/api/messages', '/messages'], contactLimiter, messagesRoutes);
app.use(['/api/content', '/content'], contentRoutes);
app.use(['/api/settings', '/settings'], settingsRoutes);
app.use(['/api/media', '/media'], mediaRoutes);
app.use(['/api/dashboard', '/dashboard'], dashboardRoutes);

// Global error handler
app.use(errorHandler);

export default app;
