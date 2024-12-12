import { JobQueueService } from '../services/jobQueueService';
import { processEntryJob } from './processors/entryProcessor';
import { processMailJob } from './processors/mailProcessor';
import { logger } from '../lib/config/logger';
import { mailQueue, repositoryEntryQueue } from '../lib/constants/queueConsts';

export const initializeQueues = (queueService: JobQueueService) => {
  queueService.createQueue(repositoryEntryQueue, processEntryJob);
  queueService.createQueue(mailQueue, processMailJob);
  logger.info('Queues are initialized successfully');
};
