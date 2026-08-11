import app from '../backend/src/app';

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (error: any) {
    console.error('Vercel Serverless Handler Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVERLESS_HANDLER_ERROR',
        message: error?.message || 'Serverless Execution Error',
        stack: error?.stack,
      },
    });
  }
}
