import nodemailer, { Transporter } from 'nodemailer';
import { DetailedVersionCheckResult, EmailNotificationPayload } from '../types';
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

  async sendEmail(payload: EmailNotificationPayload) {
    const { outdatedPackages, repoName, subject, to, info } = payload;
    const htmlBody = this.generateHtmlBody(repoName, outdatedPackages, info);
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
    info?: string,
  ): string {
    if (outdatedPackages.length === 0 && !info) {
      return `
        <h3>Outdated Packages for ${repoName}</h3>
        <p>Good news! There are no outdated packages in the repository.</p>
      `;
    }

    if (outdatedPackages.length === 0 && info) {
      return `
        <h3>Outdated Packages for ${repoName}</h3>
      <p>${info}</p>
      `;
    }

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
