import {
  RepositorySubscriptionPayload,
  RepositorySubscription,
} from '../types';
import { prisma } from '../database/prisma/client';
import { scheduleJob } from '../queues/scheduler';
import { repositoryEntryQueue } from '../constants/queueConsts';
import { logger } from '../config/logger';

export class RepositorySubscriptionService {
  async createRepositorySubscription(
    repositorySubscriptionPayload: RepositorySubscriptionPayload,
  ): Promise<null> {
    try {
      const { emails, owner, name, platform } = repositorySubscriptionPayload;
      const slug = this.generateSlug(owner, name, platform);
      const existingSubscription =
        await prisma.repositorySubscription.findUnique({
          where: {
            slug: slug,
          },
        });

      if (!existingSubscription) {
        await prisma.$transaction(async (prisma) => {
          const newSubscription = (await prisma.repositorySubscription.create({
            data: {
              platform,
              owner,
              name,
              slug,
            },
          })) as RepositorySubscription;

          const notificationJobs = emails.map((email) => ({
            email: email,
            repositorySubscriptionId: newSubscription.id,
          }));

          await prisma.notificationJob.createMany({
            data: notificationJobs,
          });

          await scheduleJob<RepositorySubscription>(
            repositoryEntryQueue,
            newSubscription,
            true,
          );
        });
      } else {
        const notificationJobs = emails.map((email) => ({
          email: email,
          repositorySubscriptionId: existingSubscription.id,
        }));

        for (const job of notificationJobs) {
          await prisma.notificationJob.upsert({
            where: {
              email_repositorySubscriptionId: {
                email: job.email,
                repositorySubscriptionId: job.repositorySubscriptionId,
              },
            },
            update: {},
            create: job,
          });
        }
      }

      return null;
    } catch (e) {
      logger.error('Error occurred in createRepositorySubscription:', e);
      throw new Error(
        'An error occurred while creating the repository subscription.',
      );
    }
  }

  private generateSlug(owner: string, name: string, platform: string): string {
    const toSlug = (input: string) =>
      input
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

    return `${toSlug(platform)}-${toSlug(owner)}-${toSlug(name)}}`;
  }
}
