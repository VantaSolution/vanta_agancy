import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { mapProject } from '../utils/transformers';

const router = Router();

// GET /api/projects — Public: published only if requested, Admin: all
router.get('/', async (req: Request, res: Response) => {
  try {
    const isPublicOnly = req.query.published === 'true';
    const sql = isPublicOnly
      ? 'SELECT * FROM projects WHERE is_published = true ORDER BY display_order ASC'
      : 'SELECT * FROM projects ORDER BY display_order ASC';
    const result = await query(sql);
    res.json({ success: true, data: result.rows.map(mapProject) });
  } catch (error: any) {
    console.error('[GET /api/projects] Error:', error?.message || error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch projects', details: error?.message } });
  }
});

// PUT /api/projects/reorder — Protected (Must be placed before GET/PUT /:id)
router.put('/reorder', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const { projectIds } = req.body as { projectIds: string[] };
    if (!Array.isArray(projectIds)) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'projectIds must be an array' } });
    }

    for (let index = 0; index < projectIds.length; index++) {
      await query('UPDATE projects SET display_order = $1, updated_at = NOW() WHERE id = $2', [index + 1, projectIds[index]]);
    }

    res.json({ success: true, message: 'Projects reordered successfully' });
  } catch (error: any) {
    console.error('[PUT /api/projects/reorder] Error:', error?.message || error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to reorder projects', details: error?.message } });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    res.json({ success: true, data: mapProject(result.rows[0]) });
  } catch (error: any) {
    console.error('[GET /api/projects/:id] Error:', error?.message || error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch project', details: error?.message } });
  }
});

// POST /api/projects — Protected
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const b = req.body;
    const name = b.name;

    // Validate required fields
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Project name is required' } });
    }

    const slug = b.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const short_description = b.shortDescription || b.short_description || '';
    const full_description = b.fullDescription || b.full_description || '';
    const category = b.category || '';
    const client_name = b.clientName || b.client_name || '';
    const project_image = b.projectImage || b.project_image || '';
    const gallery_images = JSON.stringify(b.galleryImages || b.gallery_images || []);
    const technologies = JSON.stringify(b.technologies || []);
    const project_url = b.projectUrl || b.project_url || '';
    const case_study_url = b.caseStudyUrl || b.case_study_url || '';
    const is_featured = b.isFeatured !== undefined ? b.isFeatured : (b.is_featured || false);
    const is_published = b.isPublished !== undefined ? b.isPublished : (b.is_published || false);
    const display_order = b.displayOrder !== undefined ? b.displayOrder : (b.display_order || 0);
    const project_date = b.projectDate || b.project_date || new Date().toISOString().split('T')[0];

    // Check for duplicate slug
    const existing = await query('SELECT id FROM projects WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: { code: 'DUPLICATE_SLUG', message: `A project with slug "${slug}" already exists. Please use a different name.` } });
    }

    const result = await query(
      `INSERT INTO projects (name, slug, short_description, full_description, category, client_name, project_image, gallery_images, technologies, project_url, case_study_url, is_featured, is_published, display_order, project_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [name, slug, short_description, full_description, category, client_name, project_image, gallery_images, technologies, project_url, case_study_url, is_featured, is_published, display_order, project_date]
    );
    res.status(201).json({ success: true, data: mapProject(result.rows[0]) });
  } catch (error: any) {
    console.error('[POST /api/projects] Error creating project:', error?.message || error, error?.stack);
    // Handle PostgreSQL unique constraint violation
    if (error?.code === '23505') {
      return res.status(409).json({ success: false, error: { code: 'DUPLICATE_ENTRY', message: 'A project with this slug already exists.' } });
    }
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create project', details: error?.message } });
  }
});

// PUT /api/projects/:id — Protected
router.put('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const b = req.body;
    const fieldMapping: Record<string, string> = {
      name: 'name',
      slug: 'slug',
      shortDescription: 'short_description',
      short_description: 'short_description',
      fullDescription: 'full_description',
      full_description: 'full_description',
      category: 'category',
      clientName: 'client_name',
      client_name: 'client_name',
      projectImage: 'project_image',
      project_image: 'project_image',
      galleryImages: 'gallery_images',
      gallery_images: 'gallery_images',
      technologies: 'technologies',
      projectUrl: 'project_url',
      project_url: 'project_url',
      caseStudyUrl: 'case_study_url',
      case_study_url: 'case_study_url',
      isFeatured: 'is_featured',
      is_featured: 'is_featured',
      isPublished: 'is_published',
      is_published: 'is_published',
      displayOrder: 'display_order',
      display_order: 'display_order',
      projectDate: 'project_date',
      project_date: 'project_date',
    };

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(b)) {
      const dbCol = fieldMapping[key];
      if (dbCol) {
        setClauses.push(`${dbCol} = $${paramIndex}`);
        if (dbCol === 'gallery_images' || dbCol === 'technologies') {
          values.push(typeof value === 'string' ? value : JSON.stringify(value));
        } else {
          values.push(value);
        }
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'No valid fields to update' } });
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(req.params.id);

    const result = await query(
      `UPDATE projects SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    res.json({ success: true, data: mapProject(result.rows[0]) });
  } catch (error: any) {
    console.error('[PUT /api/projects/:id] Error:', error?.message || error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update project', details: error?.message } });
  }
});

// DELETE /api/projects/:id — Protected
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const result = await query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error: any) {
    console.error('[DELETE /api/projects/:id] Error:', error?.message || error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete project', details: error?.message } });
  }
});

export default router;
