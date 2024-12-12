import { Job } from 'bull';
import { EmailService } from '../../services/emailService';
import { EmailNotificationPayload } from '../../types';
import { logger } from '../../lib/config/logger';

export async function processMailJob(job: Job<EmailNotificationPayload>) {
  try {
    const emailService = EmailService.getInstance();
    await emailService.sendEmail(job.data);
    logger.info(`Mail sent to: ${job.data.to}`);
  } catch (error) {
    logger.error(
      `Mail could not send to: ${job.data.to}, reason:${JSON.stringify(error)}`,
    );
  }
}
