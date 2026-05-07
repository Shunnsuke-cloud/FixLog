import { Router } from 'express';
import type { Request, Response } from 'express-serve-static-core';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../services/prisma';

const router = Router();
const jwtSecret = process.env.JWT_SECRET ?? 'dev-secret-key-do-not-use-in-production';

router.post('/register', async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) return res.status(400).json({ success: false, error: 'Missing fields' });

  const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
  if (existing) return res.status(409).json({ success: false, error: 'User exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, username, password: hashed } });

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
  res.json({ success: true, data: { token, user: { id: user.id, email: user.email, username: user.username } } });
});

router.post('/login', async (req: Request, res: Response) => {
  const { emailOrUsername, password } = req.body;
  if (!emailOrUsername || !password) return res.status(400).json({ success: false, error: 'Missing fields' });

  const user = await prisma.user.findFirst({ where: { OR: [{ email: emailOrUsername }, { username: emailOrUsername }] } });
  if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ success: false, error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '7d' });
  res.json({ success: true, data: { token, user: { id: user.id, email: user.email, username: user.username } } });
});

export default router;
