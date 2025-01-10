import fs from 'fs';
import Redis from 'ioredis';
import jsonfile from 'jsonfile';
import Queue, { JobStatus, QueueOptions } from 'bull';
import { logger } from '../config/logger';
import { JobLog } from '../types';
import { resolvePath } from '../utils/resolvePath';
import { QueueMessage } from '../constants/queueConsts';

export class JobQueueService {
  private static instance: JobQueueService;
  private queues: { [key: string]: Queue.Queue };
  private logFilePath: string;
  private queueOptions: QueueOptions;

  private constructor() {
    this.queueOptions = {
      redis: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD!,
      },
    };
    this.queues = {};
    this.logFilePath = resolvePath('/logs');
  }

  public static getInstance(): JobQueueService {
    if (!JobQueueService.instance) {
      JobQueueService.instance = new JobQueueService();
    }
    return JobQueueService.instance;
  }

  public createQueue(
    queueName: string,
    processFunction: (job: Queue.Job) => Promise<void>,
  ) {
    const queue = new Queue(queueName, this.queueOptions);

    queue.process(async (job) => {
      await processFunction(job);
    });

    queue.on('completed', (job) => {
      logger.info(QueueMessage.queueJobCompleted(queueName, job.id.toString()));
      this.logJobToFile(job, queueName, 'completed');
    });

    queue.on('failed', (job, err) => {
      logger.error(
        QueueMessage.queueJobFailed(queueName, job.id.toString(), err.message),
      );
      this.logJobToFile(job, queueName, 'failed', err.message);
    });

    queue.on('error', (err) => {
      logger.error(QueueMessage.queueError(queueName, err.message));
    });

    this.queues[queueName] = queue;
  }

  public getQueue(queueName: string): Queue.Queue {
    const queue = this.queues[queueName];
    if (!queue) {
      throw new Error(QueueMessage.queueNotExist(queueName));
    }
    return queue;
  }

  public getQueues() {
    return this.queues;
  }

  private logJobToFile(
    job: Queue.Job,
    queueName: string,
    status: JobStatus,
    error: string = '',
  ) {
    const fullFilePath = `${this.logFilePath}/${queueName}.log`;
    if (!fs.existsSync(fullFilePath)) {
      fs.writeFileSync(fullFilePath, '');
    }

    const jobLog: JobLog = {
      data: job.data,
      id: job.id,
      status,
      queueName,
      error,
      processedAt: job.processedOn || 0,
      finishedAt: job.finishedOn || 0,
    };

    jsonfile.writeFile(fullFilePath, jobLog, { flag: 'a' }, (err) => {
      if (err) logger.error(err);
    });
  }

  public async addJobToQueue<T>(queueName: string, data: T, delay?: number) {
    const queue = this.getQueue(queueName);
    await queue.add(data, { delay });
    logger.info(QueueMessage.queueJobAdded(queueName));
  }

  public async clearAllQueues() {
    try {
      for (const queueName in this.queues) {
        const queue = this.queues[queueName];
        await queue.empty();
        logger.info(QueueMessage.queueJobsCleared(queueName));
      }
    } catch (err) {
      logger.error('Error while clearing queues: ', err);
    }
  }

  public async checkRedisConnection() {
    const redisOptions = this.queueOptions.redis as {
      port: number;
      host: string;
      password: string;
    };
    const redis = new Redis({ ...redisOptions });

    redis.on('error', (err) => {
      throw new Error(`Connection error for Redis: ${err}`);
    });
    await redis.ping();
  }
}
