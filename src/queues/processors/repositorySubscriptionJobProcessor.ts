import { Job } from 'bull';
import { scheduleJob } from '../scheduler';
import { DeprecatedPackageFinderService } from '../../services/deprecatedPackageFinderService';
import { logger } from '../../config/logger';
import { EmailNotificationPayload, RepositorySubscription } from '../../types';
import { appConfig } from '../../config/appConfig';
import { mailQueue, repositoryEntryQueue } from '../../constants/queueConsts';
import { prisma } from '../../database/prisma/client';
import { ErrorMessage } from '../../constants/messages';

export async function processRepositorySubscriptionJob(
  job: Job<RepositorySubscription>,
) {
  try {
    const { owner, platform, name, id } = job.data;
    const deprecatedPackageFinder = new DeprecatedPackageFinderService();
    const packages = await deprecatedPackageFinder.findDeprecatedPackages({
      owner,
      platform,
      repo: name,
    });

    const notificationJobs = await prisma.notificationJob.findMany({
      where: { repositorySubscriptionId: id },
    });

    const emailPayloads: EmailNotificationPayload[] = notificationJobs.map(
      (notificationJob) => ({
        info: '',
        body: packages,
        repoName: `${platform}/${owner}/${name}`,
        subject: appConfig.mailSubject,
        to: notificationJob.email,
      }),
    );

    await Promise.all(
      emailPayloads.map((payload) =>
        scheduleJob<EmailNotificationPayload>(mailQueue, payload),
      ),
    );

    await scheduleJob<RepositorySubscription>(
      repositoryEntryQueue,
      job.data,
      true,
    );
  } catch (error) {
    logger.error(ErrorMessage.JobProcessingError(JSON.stringify(error)));
  }
}
