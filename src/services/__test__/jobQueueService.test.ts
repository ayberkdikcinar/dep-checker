import { JobQueueService } from '../jobQueueManagerService';
import { QueueMessage } from '../../lib/constants/queueConsts';

jest.mock('bull', () => {
  return jest.fn(() => ({
    process: jest.fn((callback) => callback({ id: '1', data: {} })),
    add: jest.fn(),
    on: jest.fn(),
    empty: jest.fn(),
  }));
});
describe('JobQueueService', () => {
  let jobQueueService: JobQueueService;
  let processFunction: jest.Mock;
  const queueName = 'test-queue';

  beforeEach(() => {
    processFunction = jest.fn().mockResolvedValue(undefined);
    jobQueueService = JobQueueService.getInstance();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should process jobs using the provided process function', async () => {
    jobQueueService.createQueue(queueName, processFunction);
    const job = { id: '1', data: {} };
    jobQueueService.addJobToQueue(queueName, job.data);
    expect(processFunction).toHaveBeenCalledWith(job);
  });

  it('should add a job to the queue with the specified delay', async () => {
    jobQueueService.createQueue(queueName, processFunction);
    const data = { id: '1' };
    const delay = 1000;
    await jobQueueService.addJobToQueue(queueName, data, delay);
    expect(jobQueueService['queues'][queueName].add).toHaveBeenCalledWith(
      data,
      { delay },
    );
  });

  it('should throw an error if queue does not exist', () => {
    expect(() => jobQueueService.getQueue('non-existent-queue')).toThrow(
      QueueMessage.queueNotExist('non-existent-queue'),
    );
  });

  it('should clear all queues', async () => {
    jobQueueService.createQueue(queueName, processFunction);
    await jobQueueService.clearAllQueues();
    expect(jobQueueService['queues'][queueName].empty).toHaveBeenCalled();
  });
});
