import { logger } from '../config/logger';
import { mailQueue, repositoryEntryQueue } from '../constants/queueConsts';
import { ErrorMessage, SuccessMessage } from '../constants/messages';
import Queue from 'bull';
import Redis from 'ioredis';

import { JobQueueManagerService } from '../services/jobQueueManagerService';
import { processRepositorySubscriptionJob } from './processors/repositorySubscriptionJobProcessor';
import { processMailJob } from './processors/mailJobProcessor';

export const setupQueues = async () => {
  const queueServiceInstance = JobQueueManagerService.getInstance();

  const queueOptions = {
    redis: {
      host: process.env.REDIS_HOST!,
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD!,
    },
  };
  const redisOptions = queueOptions.redis as {
    port: number;
    host: string;
    password: string;
  };
  const redis = new Redis({ ...redisOptions });

  redis.on('error', (err) => {
    throw new Error(ErrorMessage.RedisConnectionError(err.message));
  });

  await redis.ping();

  const repositoryQueue = new Queue(repositoryEntryQueue, queueOptions);
  const emailQueue = new Queue(mailQueue, queueOptions);

  logger.info(SuccessMessage.QueuesCreated);

  await repositoryQueue.empty();
  await emailQueue.empty();

  logger.info(SuccessMessage.QueuesCleared);
  queueServiceInstance.processQueueWithLogging(
    repositoryQueue,
    processRepositorySubscriptionJob,
  );
  queueServiceInstance.processQueueWithLogging(emailQueue, processMailJob);

  logger.info(SuccessMessage.QueuesInitialized);
};
