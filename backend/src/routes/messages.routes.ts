import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { mapMessage } from '../utils/transformers';

const router = Router();

// GET /api/messages — Protected
router.get('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM messages ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows.map(mapMessage) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch messages' } });
  }
});

// POST /api/messages — Public (contact form submission)
router.post('/', async (req: Request, res: Response) => {
  try {
    const b = req.body;
    const name = b.name;
    const email = b.email;
    const company = b.company || '';
    const project_type = b.projectType || b.project_type || '';
    const budget_range = b.budgetRange || b.budget_range || '';
    const message = b.message;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Name, email, and message are required' } });
    }
    const result = await query(
      'INSERT INTO messages (name, email, company, project_type, budget_range, message) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, email, company, project_type, budget_range, message]
    );
    res.status(201).json({ success: true, data: mapMessage(result.rows[0]) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to submit message' } });
  }
});

// PUT /api/messages/:id — Protected (status update)
router.put('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const result = await query('UPDATE messages SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *', [status, req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Message not found' } });
    res.json({ success: true, data: mapMessage(result.rows[0]) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update message' } });
  }
});

// DELETE /api/messages/:id — Protected
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const result = await query('DELETE FROM messages WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Message not found' } });
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete message' } });
  }
});

export default router;
