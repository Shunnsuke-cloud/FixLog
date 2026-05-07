import { Router } from 'express';
import prisma from '../services/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (_req, res) => {
  const posts = await prisma.post.findMany({ include: { user: true, environment: true } });
  res.json({ success: true, data: posts });
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const post = await prisma.post.findUnique({ where: { id }, include: { user: true, environment: true, comments: true } });
  if (!post) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: post });
});

router.post('/', requireAuth, async (req: AuthRequest, res) => {
  const { title, description, solution, environment } = req.body;
  if (!title || !description) return res.status(400).json({ success: false, error: 'Missing fields' });

  const envData = environment ? { create: environment } : undefined;

  const post = await prisma.post.create({ data: { title, description, solution: solution ?? '', userId: req.user!.id, environment: envData } });
  res.status(201).json({ success: true, data: post });
});

router.put('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ success: false, error: 'Not found' });
  if (existing.userId !== req.user!.id) return res.status(403).json({ success: false, error: 'Forbidden' });

  const { title, description, solution } = req.body;
  const updated = await prisma.post.update({ where: { id }, data: { title, description, solution } });
  res.json({ success: true, data: updated });
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res) => {
  const id = Number(req.params.id);
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ success: false, error: 'Not found' });
  if (existing.userId !== req.user!.id) return res.status(403).json({ success: false, error: 'Forbidden' });

  await prisma.post.delete({ where: { id } });
  res.json({ success: true, data: null });
});

export default router;
