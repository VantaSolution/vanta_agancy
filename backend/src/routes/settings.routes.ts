import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/settings
router.get('/', async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM settings');
    const settings: Record<string, any> = {};
    result.rows.forEach((row: any) => {
      settings[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
    });
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch settings' } });
  }
});

// PUT /api/settings — Protected
router.put('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const entries = req.body;
    for (const [key, value] of Object.entries(entries)) {
      const payload = typeof value === 'string' ? value : JSON.stringify(value);
      await query(
        `INSERT INTO settings (key, value) VALUES ($1, $2)
         ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = NOW()`,
        [key, payload]
      );
    }
    res.json({ success: true, data: entries });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update settings' } });
  }
});

export default router;
