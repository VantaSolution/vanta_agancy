import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { authenticateJWT } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/dashboard/stats — Protected
router.get('/stats', authenticateJWT, async (_req: Request, res: Response) => {
  try {
    const projectsRes = await query('SELECT count(*) as total, count(*) FILTER (WHERE is_published = true) as published, count(*) FILTER (WHERE is_published = false) as draft FROM projects');
    const messagesRes = await query("SELECT count(*) as total, count(*) FILTER (WHERE status = 'new') as unread FROM messages");

    const projectStats = projectsRes.rows[0] || { total: 0, published: 0, draft: 0 };
    const messageStats = messagesRes.rows[0] || { total: 0, unread: 0 };

    res.json({
      success: true,
      data: {
        totalProjects: parseInt(projectStats.total, 10) || 0,
        publishedProjects: parseInt(projectStats.published, 10) || 0,
        draftProjects: parseInt(projectStats.draft, 10) || 0,
        totalMessages: parseInt(messageStats.total, 10) || 0,
        unreadMessages: parseInt(messageStats.unread, 10) || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch dashboard stats' } });
  }
});

export default router;
