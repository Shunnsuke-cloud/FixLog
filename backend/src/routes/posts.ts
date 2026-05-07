import { Router } from 'express';
import type { Request, Response } from 'express-serve-static-core';
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

// Comments list for a post
router.get('/:id/comments', async (req: Request, res: Response) => {
  const postId = Number(req.params.id);
  const comments = await prisma.comment.findMany({
    where: { postId },
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  });
  res.json({ success: true, data: comments });
});

// Create a comment on a post
router.post('/:id/comments', requireAuth, async (req: AuthRequest, res: Response) => {
  const postId = Number(req.params.id);
  const { content } = req.body;
  if (!content || typeof content !== 'string') return res.status(400).json({ success: false, error: 'Missing content' });

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });

  const comment = await prisma.comment.create({
    data: { content, postId, userId: req.user!.id },
    include: { user: true },
  });

  res.status(201).json({ success: true, data: comment });
});

// Delete a comment (author only)
router.delete('/:id/comments/:commentId', requireAuth, async (req: AuthRequest, res: Response) => {
  const commentId = Number(req.params.commentId);
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) return res.status(404).json({ success: false, error: 'Comment not found' });
  if (comment.userId !== req.user!.id) return res.status(403).json({ success: false, error: 'Forbidden' });

  await prisma.comment.delete({ where: { id: commentId } });
  res.json({ success: true, data: null });
});

// Edit a comment (author only)
router.put('/:id/comments/:commentId', requireAuth, async (req: AuthRequest, res: Response) => {
  const commentId = Number(req.params.commentId);
  const { content } = req.body;
  if (!content || typeof content !== 'string') return res.status(400).json({ success: false, error: 'Missing content' });

  const existing = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!existing) return res.status(404).json({ success: false, error: 'Comment not found' });
  if (existing.userId !== req.user!.id) return res.status(403).json({ success: false, error: 'Forbidden' });

  const updated = await prisma.comment.update({ where: { id: commentId }, data: { content } , include: { user: true } });
  res.json({ success: true, data: updated });
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
