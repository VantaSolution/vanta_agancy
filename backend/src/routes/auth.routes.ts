import { Router, Request, Response } from 'express';
import { comparePassword, hashPassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, TokenPayload } from '../utils/jwt';
import { query } from '../config/db';
import { authenticateJWT, AuthenticatedRequest } from '../middlewares/auth.middleware';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Email and password required' } });
    }

    const result = await query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = result.rows[0];
    if (!admin) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    const isValid = await comparePassword(password, admin.password_hash);
    if (!isValid) {
      return res.status(401).json({ success: false, error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }

    const payload: TokenPayload = { userId: admin.id, email: admin.email, role: admin.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: { userId: admin.id, email: admin.email, name: admin.name, role: admin.role },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Login failed' } });
  }
});

// POST /api/auth/refresh
router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Refresh token required' } });
    }
    const payload = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({ userId: payload.userId, email: payload.email, role: payload.role });
    res.json({ success: true, data: { accessToken } });
  } catch (error) {
    res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid refresh token' } });
  }
});

// GET /api/auth/me
router.get('/me', authenticateJWT, (req: AuthenticatedRequest, res: Response) => {
  res.json({ success: true, data: req.user });
});

// PUT /api/auth/profile — Protected (Update admin credentials & password)
router.put('/profile', authenticateJWT, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, newPassword } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Unauthorized' } });
    }

    if (newPassword && newPassword.length < 6) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 6 characters long' } });
    }

    let queryText = 'UPDATE admins SET name = COALESCE($1, name), email = COALESCE($2, email), updated_at = NOW() WHERE id = $3 RETURNING id, name, email, role';
    let params: any[] = [name || null, email || null, userId];

    if (newPassword) {
      const passwordHash = await hashPassword(newPassword);
      queryText = 'UPDATE admins SET name = COALESCE($1, name), email = COALESCE($2, email), password_hash = $3, updated_at = NOW() WHERE id = $4 RETURNING id, name, email, role';
      params = [name || null, email || null, passwordHash, userId];
    }

    const result = await query(queryText, params);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Admin user not found' } });
    }

    const updatedUser = result.rows[0];
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        userId: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Failed to update profile' } });
  }
});

export default router;
