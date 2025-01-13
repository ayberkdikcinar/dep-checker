import fs from 'fs';
import jsonfile from 'jsonfile';
import Queue, { JobStatus } from 'bull';
import { logger } from '../config/logger';
import { JobLog } from '../types';
import { resolvePath } from '../utils/resolvePath';
import { QueueMessage } from '../constants/queueConsts';

export class JobQueueManagerService {
  private static instance: JobQueueManagerService;
  private queues: { [key: string]: Queue.Queue };
  private logFilePath: string;

  private constructor() {
    this.queues = {};
    this.logFilePath = resolvePath('/logs');
  }

  public static getInstance(): JobQueueManagerService {
    if (!JobQueueManagerService.instance) {
      JobQueueManagerService.instance = new JobQueueManagerService();
    }
    return JobQueueManagerService.instance;
  }

  public processQueueWithLogging(
    queue: Queue.Queue<unknown>,
    processFunction: (job: Queue.Job) => Promise<void>,
  ) {
    queue.process(async (job) => {
      await processFunction(job);
    });

    queue.on('completed', (job) => {
      logger.info(
        QueueMessage.queueJobCompleted(queue.name, job.id.toString()),
      );
    });

    queue.on('failed', (job, err) => {
      logger.error(
        QueueMessage.queueJobFailed(queue.name, job.id.toString(), err.message),
      );
      this.logJobToFile(job, queue.name, 'failed', err.message);
    });

    queue.on('error', (err) => {
      logger.error(QueueMessage.queueError(queue.name, err.message));
    });

    this.queues[queue.name] = queue;
  }

  public getQueue(queueName: string): Queue.Queue {
    const queue = this.queues[queueName];
    if (!queue) {
      throw new Error(QueueMessage.queueNotExist(queueName));
    }
    return queue;
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

  public async addJobToQueueWithDelay<T>(
    queueName: string,
    data: T,
    delay?: number,
  ) {
    const queue = this.getQueue(queueName);
    await queue.add(data, { delay });
    logger.info(QueueMessage.queueJobAdded(queueName));
  }
}
