import express, { Request, Response } from 'express';
import { json } from 'body-parser';
const app = express();

app.use(json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hi there!');
});

app.all('*', (req: Request, res: Response) => {
  throw new Error('Route not found');
});

export { app };
