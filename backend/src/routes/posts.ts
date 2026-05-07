import { Router, Request, Response } from 'express';
import prisma from '../services/prisma';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const posts = await prisma.post.findMany({ include: { user: true, environment: true } });
  res.json({ success: true, data: posts });
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const post = await prisma.post.findUnique({ where: { id }, include: { user: true, environment: true, comments: true } });
  if (!post) return res.status(404).json({ success: false, error: 'Not found' });
  res.json({ success: true, data: post });
});

router.post('/', requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, description, solution, environment } = req.body;
  if (!title || !description) return res.status(400).json({ success: false, error: 'Missing fields' });

  const post = await prisma.$transaction(async (transaction) => {
    const environmentRecord = environment
      ? await transaction.environmentInfo.create({
          data: {
            language: environment.language,
            framework: environment.framework ?? null,
            os: environment.os,
            osVersion: environment.osVersion ?? null,
            nodeVersion: environment.nodeVersion ?? null,
            npmVersion: environment.npmVersion ?? null,
          },
        })
      : null;

    return transaction.post.create({
      data: {
        title,
        description,
        solution: solution ?? '',
        userId: req.user!.id,
        environmentId: environmentRecord?.id ?? null,
      },
      include: { environment: true, user: true },
    });
  });

  res.status(201).json({ success: true, data: post });
});

router.put('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ success: false, error: 'Not found' });
  if (existing.userId !== req.user!.id) return res.status(403).json({ success: false, error: 'Forbidden' });

  const { title, description, solution } = req.body;
  const updated = await prisma.post.update({ where: { id }, data: { title, description, solution } });
  res.json({ success: true, data: updated });
});

router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  const id = Number(req.params.id);
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return res.status(404).json({ success: false, error: 'Not found' });
  if (existing.userId !== req.user!.id) return res.status(403).json({ success: false, error: 'Forbidden' });

  await prisma.post.delete({ where: { id } });
  res.json({ success: true, data: null });
});

export default router;
