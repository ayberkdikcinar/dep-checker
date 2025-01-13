import { Job } from 'bull';
import { EmailService } from '../../services/emailService';
import { EmailNotificationPayload } from '../../types';
import { prisma } from '../../database/prisma/client';
import { logger } from '../../config/logger';

export async function processMailJob(job: Job<EmailNotificationPayload>) {
  const emailService = EmailService.getInstance();
  try {
    await emailService.sendEmail(job.data);
  } catch (error) {
    logger.error(`Email Job Failed for job id ${job.data.id}. Error: ${error}`);
    try {
      await job.retry();
      logger.info(`Retrying job id ${job.data.id}`);
    } catch (retryError) {
      logger.error(
        `Email Job Failed for job id ${job.data.id}. Error: ${retryError}`,
      );
    }
  }
}
