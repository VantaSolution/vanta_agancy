export default function handler(req: any, res: any) {
  console.log('[BOOT 1] Minimal diagnostic Vercel function handler executed');
  return res.status(200).json({
    status: 'ok',
    message: 'Vercel function is running',
    timestamp: new Date().toISOString(),
  });
}
