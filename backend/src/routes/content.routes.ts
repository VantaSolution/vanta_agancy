import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/content — Public
router.get('/', async (_req: Request, res: Response) => {
  try {
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    const result = await query('SELECT * FROM website_content');
    const content: Record<string, any> = {};
    result.rows.forEach((row: any) => {
      content[row.section] = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
    });
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch content' } });
  }
});

// PUT /api/content — Protected
router.put('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const sections = req.body;
    for (const [section, content] of Object.entries(sections)) {
      const payload = typeof content === 'string' ? content : JSON.stringify(content);
      await query(
        `INSERT INTO website_content (section, content) VALUES ($1, $2)
         ON CONFLICT (section) DO UPDATE SET content = $2, updated_at = NOW()`,
        [section, payload]
      );
    }
    res.json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update content' } });
  }
});

export default router;
