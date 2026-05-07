import { Router } from 'express';
import type { Request, Response } from 'express-serve-static-core';

const healthRouter = Router();

healthRouter.get('/', (_request: Request, response: Response) => {
  response.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'FixLog API',
      timestamp: new Date().toISOString(),
    },
  });
});

export default healthRouter;
