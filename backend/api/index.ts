export default function handler(req: any, res: any) {
  if (req.url === '/test' || req.url === '/api/test' || req.url === '/health') {
    return res.status(200).json({
      success: true,
      message: 'VANTA Vercel Serverless API is active',
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const app = require('../src/app').default;
    return app(req, res);
  } catch (error: any) {
    console.error('Serverless dynamic import failure:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'SERVERLESS_IMPORT_ERROR',
        message: error?.message || String(error),
        stack: error?.stack,
      },
    });
  }
}
