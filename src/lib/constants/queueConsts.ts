export const QueueMessage = {
  queueJobAdded: (queueName: string) => `Job added. Queue: <${queueName}>`,
  queueJobCompleted: (queueName: string, jobId: string) =>
    `Job completed. Queue: <${queueName}>, Job ID: ${jobId}`,
  queueJobFailed: (queueName: string, jobId: string, error: string) =>
    `Job failed. Queue: <${queueName}>, Job ID: ${jobId} reason: ${error}`,
  queueError: (queueName: string, error: string) =>
    `Error. Queue: <${queueName}>, reason: ${error}`,
  queueJobsCleared: (queueName: string) =>
    `Jobs cleared. Queue: <${queueName}>`,
  queueNotExist: (queueName: string) =>
    `Queue not exist with name <${queueName}>`,
  queueInitialized: 'Queue initializated successfully.',
};

export const repositoryEntryQueue = 'repositoryEntryQueue';
export const mailQueue = 'mailQueue';
