import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { mapService } from '../utils/transformers';

const router = Router();

// GET /api/services
router.get('/', async (req: Request, res: Response) => {
  try {
    const activeOnly = req.query.active === 'true';
    if (activeOnly) {
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    }
    const sql = activeOnly
      ? 'SELECT * FROM services WHERE is_active = true ORDER BY display_order ASC'
      : 'SELECT * FROM services ORDER BY display_order ASC';
    const result = await query(sql);
    res.json({ success: true, data: result.rows.map(mapService) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch services' } });
  }
});

// PUT /api/services/reorder — Protected (Must be placed before GET/PUT /:id)
router.put('/reorder', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { serviceIds } = req.body as { serviceIds: string[] };
    if (!Array.isArray(serviceIds)) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'serviceIds must be an array' } });
    }

    for (let index = 0; index < serviceIds.length; index++) {
      await query('UPDATE services SET display_order = $1, updated_at = NOW() WHERE id = $2', [index + 1, serviceIds[index]]);
    }

    res.json({ success: true, message: 'Services reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to reorder services' } });
  }
});

// POST /api/services — Protected
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const b = req.body;
    const name = b.name;
    const short_description = b.shortDescription || b.short_description || '';
    const full_description = b.fullDescription || b.full_description || '';
    const icon = b.icon || 'globe';
    const display_order = b.displayOrder !== undefined ? b.displayOrder : (b.display_order || 0);
    const is_active = b.isActive !== undefined ? b.isActive : (b.is_active !== false);

    const result = await query(
      'INSERT INTO services (name, short_description, full_description, icon, display_order, is_active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [name, short_description, full_description, icon, display_order, is_active]
    );
    res.status(201).json({ success: true, data: mapService(result.rows[0]) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create service' } });
  }
});

// PUT /api/services/:id — Protected
router.put('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const b = req.body;
    const fieldMapping: Record<string, string> = {
      name: 'name',
      shortDescription: 'short_description',
      short_description: 'short_description',
      fullDescription: 'full_description',
      full_description: 'full_description',
      icon: 'icon',
      displayOrder: 'display_order',
      display_order: 'display_order',
      isActive: 'is_active',
      is_active: 'is_active',
    };

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(b)) {
      const dbCol = fieldMapping[key];
      if (dbCol) {
        setClauses.push(`${dbCol} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'No valid fields to update' } });
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(req.params.id);

    const result = await query(`UPDATE services SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`, values);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Service not found' } });
    res.json({ success: true, data: mapService(result.rows[0]) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update service' } });
  }
});

// DELETE /api/services/:id — Protected
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const result = await query('DELETE FROM services WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Service not found' } });
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete service' } });
  }
});

export default router;
