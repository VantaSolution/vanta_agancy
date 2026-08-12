import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { mapProject } from '../utils/transformers';
import { logger } from '../utils/logger';

const router = Router();

/**
 * Validate URL strings (HTTPS, HTTP, or safe Data URIs)
 */
function isValidUrlOrPath(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return true; // Optional fields can be empty
  const trimmed = urlStr.trim();
  if (!trimmed) return true;

  // Allow safe HTTP / HTTPS URLs
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    // Allow safe Base64 image data URIs if submitted for compatibility
    if (trimmed.startsWith('data:image/')) {
      return true;
    }
    return false;
  }
}

// GET /api/projects — Public: published only if requested, Admin: all
router.get('/', async (req: Request, res: Response) => {
  try {
    const isPublicOnly = req.query.published === 'true';
    if (isPublicOnly) {
      res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    }
    const sql = isPublicOnly
      ? 'SELECT * FROM projects WHERE is_published = true ORDER BY display_order ASC'
      : 'SELECT * FROM projects ORDER BY display_order ASC';
    const result = await query(sql);
    res.json({ success: true, data: result.rows.map(mapProject) });
  } catch (error: any) {
    logger.error(`[GET /api/projects] Error: ${error?.message || error}`);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch projects' } });
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
    logger.error(`[PUT /api/projects/reorder] Error: ${error?.message || error}`);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to reorder projects' } });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }
    res.json({ success: true, data: mapProject(result.rows[0]) });
  } catch (error: any) {
    logger.error(`[GET /api/projects/:id] Error: ${error?.message || error}`);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch project' } });
  }
});

// POST /api/projects — Protected
router.post('/', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const b = req.body || {};

    // 1. Validate name
    const rawName = b.name;
    if (!rawName || typeof rawName !== 'string' || !rawName.trim()) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Project name is required and cannot be empty.' } });
    }
    const name = rawName.trim();

    // 2. Validate URLs
    const project_image = (b.projectImage || b.project_image || '').toString().trim();
    const project_url = (b.projectUrl || b.project_url || '').toString().trim();
    const case_study_url = (b.caseStudyUrl || b.case_study_url || '').toString().trim();

    if (!isValidUrlOrPath(project_image)) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid project image URL. Must be a valid HTTP or HTTPS URL.' } });
    }
    if (!isValidUrlOrPath(project_url)) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid live project URL. Must be a valid HTTP or HTTPS URL.' } });
    }
    if (!isValidUrlOrPath(case_study_url)) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid case study URL. Must be a valid HTTP or HTTPS URL.' } });
    }

    // 3. Validate slug
    const rawSlug = b.slug ? b.slug.toString().trim() : '';
    const slug = rawSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check duplicate slug
    const existing = await query('SELECT id FROM projects WHERE slug = $1', [slug]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ success: false, error: { code: 'DUPLICATE_SLUG', message: `A project with slug "${slug}" already exists. Please use a different name.` } });
    }

    // 4. Sanitize text fields
    const short_description = (b.shortDescription || b.short_description || '').toString().trim();
    const full_description = (b.fullDescription || b.full_description || '').toString().trim();
    const category = (b.category || '').toString().trim();
    const client_name = (b.clientName || b.client_name || '').toString().trim();

    // 5. Parse and validate JSON arrays
    let galleryArr: string[] = [];
    const rawGallery = b.galleryImages || b.gallery_images;
    if (Array.isArray(rawGallery)) {
      galleryArr = rawGallery.map((img: any) => img.toString().trim()).filter(Boolean);
    } else if (typeof rawGallery === 'string') {
      try { galleryArr = JSON.parse(rawGallery); } catch { galleryArr = []; }
    }

    let techArr: string[] = [];
    const rawTech = b.technologies;
    if (Array.isArray(rawTech)) {
      techArr = rawTech.map((t: any) => t.toString().trim()).filter(Boolean);
    } else if (typeof rawTech === 'string') {
      try { techArr = JSON.parse(rawTech); } catch { techArr = []; }
    }

    const gallery_images = JSON.stringify(galleryArr);
    const technologies = JSON.stringify(techArr);

    // 6. Flags and date
    const is_featured = Boolean(b.isFeatured !== undefined ? b.isFeatured : b.is_featured);
    const is_published = Boolean(b.isPublished !== undefined ? b.isPublished : b.is_published);
    const display_order = Number(b.displayOrder !== undefined ? b.displayOrder : (b.display_order || 0));

    let project_date = b.projectDate || b.project_date;
    if (!project_date || isNaN(Date.parse(project_date))) {
      project_date = new Date().toISOString().split('T')[0];
    }

    // 7. Insert with explicit ::jsonb casting
    const result = await query(
      `INSERT INTO projects (name, slug, short_description, full_description, category, client_name, project_image, gallery_images, technologies, project_url, case_study_url, is_featured, is_published, display_order, project_date)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb,$10,$11,$12,$13,$14,$15) RETURNING *`,
      [name, slug, short_description, full_description, category, client_name, project_image, gallery_images, technologies, project_url, case_study_url, is_featured, is_published, display_order, project_date]
    );

    logger.info(`[POST /api/projects] Successfully created project "${name}" (ID: ${result.rows[0].id})`);
    return res.status(201).json({ success: true, data: mapProject(result.rows[0]) });
  } catch (error: any) {
    logger.error(`[POST /api/projects] Error creating project: ${error?.message || error}`);
    if (error?.code === '23505') {
      return res.status(409).json({ success: false, error: { code: 'DUPLICATE_ENTRY', message: 'A project with this slug already exists.' } });
    }
    return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to create project' } });
  }
});

// PUT /api/projects/:id — Protected
router.put('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const b = req.body || {};
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
        if (dbCol === 'gallery_images' || dbCol === 'technologies') {
          setClauses.push(`${dbCol} = $${paramIndex}::jsonb`);
          const arr = Array.isArray(value) ? value : (typeof value === 'string' ? JSON.parse(value) : []);
          values.push(JSON.stringify(arr));
        } else {
          setClauses.push(`${dbCol} = $${paramIndex}`);
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

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }

    logger.info(`[PUT /api/projects/:id] Successfully updated project ID: ${req.params.id}`);
    res.json({ success: true, data: mapProject(result.rows[0]) });
  } catch (error: any) {
    logger.error(`[PUT /api/projects/:id] Error: ${error?.message || error}`);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update project' } });
  }
});

// DELETE /api/projects/:id — Protected
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const result = await query('DELETE FROM projects WHERE id = $1 RETURNING id', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Project not found' } });
    }
    logger.info(`[DELETE /api/projects/:id] Successfully deleted project ID: ${req.params.id}`);
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error: any) {
    logger.error(`[DELETE /api/projects/:id] Error: ${error?.message || error}`);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete project' } });
  }
});

export default router;
