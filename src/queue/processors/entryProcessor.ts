import { Entry } from '../../models/entry';
import { Job } from 'bull';
import { scheduleJob } from '../scheduler';
import { PlatformFactory } from '../../lib/apis/platform/platformFactory';
import { DeprecatedPackageFinder } from '../../services/deprecatedPackageFinder';
import { logger } from '../../lib/config/logger';
import {
  DetailedVersionCheckResult,
  EmailNotificationPayload,
} from '../../types';
import { ErrorMessage } from '../../lib/constants/errorMessage';
import {
  mailQueue,
  repositoryEntryQueue,
} from '../../lib/constants/queueConsts';

export async function processEntryJob(job: Job<Entry>) {
  try {
    const deprecatedPackageFinder = new DeprecatedPackageFinder();
    const apiService = PlatformFactory.getPlatformApi(job.data.platform);
    if (!apiService) {
      logger.error(ErrorMessage.INVALID_PLATFORM);
      return;
    }

    const files = await deprecatedPackageFinder.readFileFromRepository(
      apiService,
      job.data,
    );

    let outdatedPackages: DetailedVersionCheckResult[] = [];
    let infoMsg = '';

    if (!files.length) {
      logger.warn(ErrorMessage.TARGET_NOT_FOUND);
      infoMsg = ErrorMessage.TARGET_NOT_FOUND;
    } else {
      const packages = await deprecatedPackageFinder.parseFile(files);
      outdatedPackages =
        await deprecatedPackageFinder.getOutdatedPackages(packages);
    }

    const emailPayloads: EmailNotificationPayload[] = job.data.emails.map(
      (email) => ({
        info: infoMsg,
        outdatedPackages,
        repoName: `${job.data.platform}/${job.data.owner}/${job.data.repo}`,
        subject: 'Outdated Packages Notification',
        to: email,
      }),
    );
    await Promise.all(
      emailPayloads.map((payload) =>
        scheduleJob<EmailNotificationPayload>(mailQueue, payload),
      ),
    );

    await scheduleJob<Entry>(repositoryEntryQueue, job.data, true);
  } catch (error) {
    logger.error(`Error while processing job: ${JSON.stringify(error)}`);
  }
}
