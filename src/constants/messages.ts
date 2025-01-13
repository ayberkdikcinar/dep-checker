export const ErrorMessage = {
  NoEmails: 'No emails provided',
  InvalidEmail: 'Invalid email address',
  InvalidRepositoryUrl:
    'Invalid repository URL format. Expected format: [https://example.com/user/repo]',
  InvalidPlatform: (platform: string) =>
    `Invalid platform [${platform}]. Supported Platforms: [github.com, gitlab.com]`,
  TargetFilesNotFound: 'Target files or repository not found.',
  InternalServerError: 'Internal server error',
  ExistsDB:
    'Repository Subscription exists in the collection. No job scheduling will occur.',
  EmailCouldNotBeSent: (email: string, reason?: string) =>
    `Email could not be sent to ${email}. Reason: ${reason}`,
  JobProcessingError: (reason: string) =>
    `Error while processing job. Reason: ${reason}`,
  RedisConnectionError: (err: string) =>
    `Error while connecting to redis. ${err}`,
};

export const SuccessMessage = {
  RepositorySubscriptionCreated: 'Repository subscription created.',
  JobScheduled: 'Job scheduled.',
  QueuesCleared: 'Queues cleared.',
  QueuesCreated: 'Queues created.',
  RepositorySubscriptionDeleted: 'Repository subscription deleted.',
  RepositorySubscriptionUpdated: 'Repository subscription updated.',
  QueuesInitialized: 'Queues initialization completed.',
  EmailSent: (to: string) => `Email sent to: ${to}`,
};
