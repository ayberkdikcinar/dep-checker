import { app } from './app';
import { logger } from './lib/config/logger';

import dotenv from 'dotenv';

dotenv.config();

const start = async () => {
  if (!process.env.REDIS_PORT) throw new Error('REDIS_PORT must be defined.');
  if (!process.env.REDIS_HOST) throw new Error('REDIS_HOST must be defined.');
  if (!process.env.REDIS_PASSWORD)
    throw new Error('REDIS_PASSWORD must be defined.');
  if (!process.env.EMAIL_ADDRESS)
    throw new Error('EMAIL_ADDRESS must be defined.');
  if (!process.env.EMAIL_PASSWORD)
    throw new Error('EMAIL_PASSWORD must be defined.');
  try {
    const port = process.env.PORT || 8000;
    app.listen(port, () => {
      logger.info(`Server started on port :${port}`);
    });
  } catch (err) {
    logger.error(err);
  }
};

start();
