import app from '../src/app';

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error('Vercel Serverless Execution Error:', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'VERCEL_SERVERLESS_ERROR',
        message: err?.message || String(err),
        stack: err?.stack,
      },
    });
  }
}
