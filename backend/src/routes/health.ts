import { Router, Request, Response } from 'express';

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
