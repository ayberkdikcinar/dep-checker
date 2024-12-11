import nodemailer, { Transporter } from 'nodemailer';
import { DetailedVersionCheckResult } from '../types';
import { logger } from '../lib/config/logger';
export class EmailService {
  private static instance: EmailService;
  private transporter: Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport({
      port: 465,
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail(
    to: string,
    subject: string,
    repoName: string,
    outdatedPackages: DetailedVersionCheckResult[],
  ) {
    const htmlBody = this.generateHtmlBody(repoName, outdatedPackages);
    logger.info(`Sending email to ${to} with subject: ${subject}`);
    try {
      const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to,
        subject,
        html: htmlBody,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      logger.error(
        `Failed to send email to ${to} with subject: ${subject} Reason: ${error}`,
      );
    }
  }

  private generateHtmlBody(
    repoName: string,
    outdatedPackages: DetailedVersionCheckResult[],
  ): string {
    const rows = outdatedPackages
      .map(
        (pkg) => `
      <tr>
        <td>${pkg.name}</td>
        <td>${pkg.version}</td>
        <td>${pkg.latestVersion}</td>
      </tr>`,
      )
      .join('');

    return `
      <h3>Outdated Packages for ${repoName}</h3>
      <table border="1" cellpadding="5" cellspacing="0">
        <thead>
          <tr>
            <th>Name</th>
            <th>Current Version</th>
            <th>Latest Version</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    `;
  }
}
