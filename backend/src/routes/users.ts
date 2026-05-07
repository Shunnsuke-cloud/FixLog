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

// Search users by username or email
router.get('/search', async (req: any, res: Response) => {
  const q = (req.query.q as string) ?? '';
  if (!q || q.trim().length === 0) {
    return res.json({ success: true, data: [] });
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { username: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, username: true, email: true, profile: true, createdAt: true },
    take: 20,
  });

  res.json({ success: true, data: users });
});

// Get user profile by username
router.get('/profile/:username', async (req: any, res: Response) => {
  const { username } = req.params;
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });

  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  const { password, ...userWithoutPassword } = user;
  res.json({ success: true, data: userWithoutPassword });
});

// Get user's posts
router.get('/posts/:username', async (req: any, res: Response) => {
  const { username } = req.params;
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) return res.status(404).json({ success: false, error: 'User not found' });

  const posts = await prisma.post.findMany({
    where: { userId: user.id },
    include: { user: true, environment: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: posts });
});

// Follow a user
router.post('/:userId/follow', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.userId);
  if (userId === req.user!.id) return res.status(400).json({ success: false, error: 'Cannot follow yourself' });

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) return res.status(404).json({ success: false, error: 'User not found' });

  // Check if already following
  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: req.user!.id, followingId: userId } },
  });
  if (existing) return res.status(409).json({ success: false, error: 'Already following' });

  await prisma.follow.create({
    data: { followerId: req.user!.id, followingId: userId },
  });

  res.json({ success: true, data: null });
});

// Unfollow a user
router.delete('/:userId/follow', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.userId);
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: req.user!.id, followingId: userId } },
  });
  if (!follow) return res.status(404).json({ success: false, error: 'Not following' });

  await prisma.follow.delete({
    where: { followerId_followingId: { followerId: req.user!.id, followingId: userId } },
  });

  res.json({ success: true, data: null });
});

// Check if current user is following a user
router.get('/:userId/following', requireAuth, async (req: AuthRequest, res: Response) => {
  const userId = Number(req.params.userId);
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: req.user!.id, followingId: userId } },
  });

  res.json({ success: true, data: { isFollowing: !!follow } });
});

export default router;
