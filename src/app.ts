import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import expressWinston from 'express-winston';
import { entryRouter } from './routes/entryRouter';
import { logger } from './config/logger';
import { errorHandler } from './middlewares/errorHandler';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(
  expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: 'HTTP {{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorize: true,
  }),
);

app.use(json());

app.use(entryRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Healthy!');
  return;
});

setupSwagger(app);

app.all('*', (req: Request, res: Response) => {
  throw new Error('Route not found');
});

app.use(errorHandler);

export { app };
