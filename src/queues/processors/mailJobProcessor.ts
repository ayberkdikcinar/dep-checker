import { Job } from 'bull';
import { EmailService } from '../../services/emailService';
import { EmailNotificationPayload } from '../../types';
import { prisma } from '../../database/prisma/client';

export async function processMailJob(job: Job<EmailNotificationPayload>) {
  const emailService = EmailService.getInstance();
  await emailService.sendEmail(job.data);
  await prisma.notificationJob.update({
    where: { id: 1 },
    data: { status: 'COMPLETED' },
  });
}
