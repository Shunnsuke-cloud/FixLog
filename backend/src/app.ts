import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import healthRouter from './routes/health';
import authRouter from './routes/auth';
import postsRouter from './routes/posts';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/', (_request, response) => {
    response.json({
      success: true,
      data: {
        name: 'FixLog API',
        version: '1.0.0',
      },
    });
  });

  app.use('/health', healthRouter);
  app.use('/auth', authRouter);
  app.use('/posts', postsRouter);

  app.use((_request, response) => {
    response.status(404).json({
      success: false,
      error: 'Not Found',
      code: 'NOT_FOUND',
    });
  });

  return app;
}
