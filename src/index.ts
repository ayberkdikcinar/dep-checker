import { app } from './app';
import { logger } from './lib/config/logger';
import { initializeQueues } from './queue/initialize';
import dotenv from 'dotenv';
import { JobQueueService } from './services/jobQueueService';
import { emptyJSONFile } from './lib/utils/emptyJSONFile';
dotenv.config();

const start = async () => {
  if (!process.env.REDIS_HOST) throw new Error('REDIS_HOST must be defined.');
  if (!process.env.REDIS_PASSWORD)
    throw new Error('REDIS_PASSWORD must be defined.');
  if (!process.env.EMAIL_ADDRESS)
    throw new Error('EMAIL_ADDRESS must be defined.');
  if (!process.env.EMAIL_PASSWORD)
    throw new Error('EMAIL_PASSWORD must be defined.');
  try {
    const queueService = JobQueueService.getInstance();
    await queueService.checkRedisConnection();
    initializeQueues(queueService);
    // Clear queues & entries.json for better testing
    await queueService.clearAllQueues();
    await emptyJSONFile('src/data/entries.json');
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }

  const port = process.env.PORT || 8000;

  app.listen(port, () => {
    logger.info(`Server started on port: ${port}`);
  });
};

start();
