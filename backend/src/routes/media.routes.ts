import { Router, Request, Response } from 'express';
import { query } from '../config/db';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { mapMedia } from '../utils/transformers';
import multer from 'multer';
import path from 'path';

// Memory storage for 100% serverless safety (Vercel) & fast DB storage
const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'video/mp4', 'video/webm', 'application/pdf', 'application/json'
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, videos, PDFs, and JSON allowed.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});

const router = Router();

// GET /api/media — Protected
router.get('/', authenticateJWT, async (_req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM media ORDER BY created_at DESC');
    res.json({ success: true, data: result.rows.map(mapMedia) });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to fetch media' } });
  }
});

// POST /api/media — Protected
router.post('/', authenticateJWT, (req: Request, res: Response) => {
  upload.single('file')(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: { code: 'FILE_UPLOAD_ERROR', message: err.message } });
    }
    try {
      if (!req.file) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'No file uploaded' } });
      
      const { originalname, mimetype, size, buffer } = req.file;
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(originalname) || '.png'}`;
      
      // Convert image buffer to Base64 Data URI string for instant DB persistence & preview
      const base64 = buffer ? buffer.toString('base64') : '';
      const url = base64 ? `data:${mimetype};base64,${base64}` : `/uploads/${filename}`;

      const result = await query(
        'INSERT INTO media (filename, original_name, mime_type, size, url) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [filename, originalname, mimetype, size, url]
      );
      res.status(201).json({ success: true, data: mapMedia(result.rows[0]) });
    } catch (error: any) {
      console.error('Media upload database error:', error);
      res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to upload media' } });
    }
  });
});

// DELETE /api/media/:id — Protected
router.delete('/:id', authenticateJWT, async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM media WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Media not found' } });
    
    await query('DELETE FROM media WHERE id = $1', [req.params.id]);
    res.json({ success: true, data: { id: req.params.id } });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to delete media' } });
  }
});

export default router;
