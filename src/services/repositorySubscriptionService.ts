import {
  RepositorySubscriptionPayload,
  RepositorySubscription,
} from '../types';
import { prisma } from '../database/prisma/client';
import { Prisma } from '@prisma/client';
import { scheduleJob } from '../queues/scheduler';
import { repositoryEntryQueue } from '../constants/queueConsts';

export class RepositorySubscriptionService {
  async createRepositorySubscription(
    repositorySubscriptionPayload: RepositorySubscriptionPayload,
  ): Promise<null> {
    try {
      await prisma.$transaction(async (prisma) => {
        const newSubscription = (await prisma.repositorySubscription.create({
          data: {
            platform: repositorySubscriptionPayload.platform,
            owner: repositorySubscriptionPayload.owner,
            name: repositorySubscriptionPayload.name,
          },
        })) as RepositorySubscription;

        const notificationJobs = repositorySubscriptionPayload.emails.map(
          (email) => ({
            email: email,
            repositorySubscriptionId: newSubscription.id,
          }),
        );

        await prisma.notificationJob.createMany({
          data: notificationJobs,
        });

        await scheduleJob<RepositorySubscription>(
          repositoryEntryQueue,
          newSubscription,
          true,
        );
      });

      return null;
    } catch (e) {
      console.error('Error occurred in createRepositorySubscription:', e);

      throw new Error(
        'An error occurred while creating the repository subscription.',
      );
    }
  }
}
