import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { mapMedia } from '../utils/transformers';
import { logger } from '../utils/logger';
import { env } from '../config/env';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';
import path from 'path';

// Memory storage for 100% serverless safety (Vercel)
const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/avif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'application/pdf',
    'application/json',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed formats: JPEG, PNG, GIF, WebP, AVIF, SVG, MP4, WebM, PDF, JSON.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

// Initialize Supabase Storage Client if privileged server key is provided
const supabaseUrl = process.env.SUPABASE_URL || env.SUPABASE_URL || 'https://yuqcieznapwdtenybqqs.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || env.SUPABASE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || env.SUPABASE_STORAGE_BUCKET || 'vanta-media';

const supabase = (supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } })
  : null;

const router = Router();

// GET /api/media — Protected
router.get('/', authenticateJWT, async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM media ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows.map(mapMedia) });
  } catch (error: any) {
    logger.error(`[GET /api/media] Failed to fetch media: ${error?.message || error}`);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch media' } });
  }
});

// POST /api/media — Protected (Upload file to Supabase Storage)
router.post('/', authenticateJWT, (req: Request, res: Response) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: { code: 'FILE_UPLOAD_ERROR', message: err.message } });
    }

    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'No file uploaded' } });
      }

      const { originalname, mimetype, size, buffer } = req.file;
      const fileExt = path.extname(originalname) || '.png';
      const safeFilename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
      const storagePath = `projects/${safeFilename}`;

      // Enforce production object storage — NO local filesystem fallback on Vercel
      if (!supabase) {
        logger.error('[POST /api/media] Storage configuration missing: SUPABASE_SERVICE_ROLE_KEY is not set in environment.');
        return res.status(503).json({
          success: false,
          error: {
            code: 'STORAGE_UNAVAILABLE',
            message: 'Media storage is not configured on the server. SUPABASE_SERVICE_ROLE_KEY environment variable is required.',
          },
        });
      }

      // Upload buffer directly to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, buffer, {
          contentType: mimetype,
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        logger.error(`[POST /api/media] Supabase Storage upload error: ${uploadError.message}`);

        // If bucket does not exist, attempt auto-creation or return clean 503
        if (uploadError.message?.includes('not found') || uploadError.message?.includes('Bucket')) {
          const { error: createBucketErr } = await supabase.storage.createBucket(bucketName, { public: true });
          if (!createBucketErr) {
            // Retry upload once after bucket creation
            const { error: retryErr } = await supabase.storage.from(bucketName).upload(storagePath, buffer, {
              contentType: mimetype,
              cacheControl: '3600',
              upsert: true,
            });
            if (retryErr) {
              return res.status(500).json({ success: false, error: { code: 'STORAGE_ERROR', message: `Storage upload failed: ${retryErr.message}` } });
            }
          } else {
            return res.status(503).json({ success: false, error: { code: 'STORAGE_BUCKET_MISSING', message: `Supabase Storage bucket "${bucketName}" could not be auto-created.` } });
          }
        } else {
          return res.status(500).json({ success: false, error: { code: 'STORAGE_ERROR', message: `Supabase upload error: ${uploadError.message}` } });
        }
      }

      // Retrieve public CDN URL from Supabase Storage
      const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
      const publicUrl = publicUrlData?.publicUrl || `${supabaseUrl}/storage/v1/object/public/${bucketName}/${storagePath}`;

      // Insert media reference row into PostgreSQL database
      const result = await query(
        'INSERT INTO media (filename, original_name, mime_type, size, url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [storagePath, originalname, mimetype, size, publicUrl]
      );

      logger.info(`[POST /api/media] Successfully uploaded media ${safeFilename} to Supabase Storage.`);
      return res.status(201).json({ success: true, data: mapMedia(result.rows[0]) });
    } catch (error: any) {
      logger.error(`[POST /api/media] Exception during media upload: ${error?.message || error}`);
      return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to upload media file' } });
    }
  });
});

// DELETE /api/media/:id — Protected
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM media WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Media item not found' } });
    }

    const mediaRow = result.rows[0];

    // Attempt cleanup in Supabase Storage if file exists
    if (supabase && mediaRow.filename) {
      try {
        await supabase.storage.from(bucketName).remove([mediaRow.filename]);
      } catch (stErr: any) {
        logger.warn(`[DELETE /api/media/:id] Storage cleanup warning: ${stErr?.message}`);
      }
    }

    await query('DELETE FROM media WHERE id = $1', [req.params.id]);
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error: any) {
    logger.error(`[DELETE /api/media/:id] Error deleting media: ${error?.message || error}`);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete media item' } });
  }
});

export default router;
