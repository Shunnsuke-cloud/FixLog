import { Router } from 'express';
import type { Response } from 'express-serve-static-core';
import prisma from '../services/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get current user profile
router.get('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, email: true, username: true, profile: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });
  res.json({ success: true, data: user });
});

// Update current user profile
router.put('/me', requireAuth, async (req: AuthRequest, res: Response) => {
  const { username, profile } = req.body;
  if (!username || typeof username !== 'string') return res.status(400).json({ success: false, error: 'Invalid username' });

  // Check if username is already taken by another user
  const existing = await prisma.user.findFirst({
    where: { username, NOT: { id: req.user!.id } },
  });
  if (existing) return res.status(409).json({ success: false, error: 'Username already taken' });

  const updated = await prisma.user.update({
    where: { id: req.user!.id },
    data: { username, profile: profile ?? null },
    select: { id: true, email: true, username: true, profile: true, createdAt: true },
  });

  res.json({ success: true, data: updated });
});

export default router;
