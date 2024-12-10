import nodemailer from 'nodemailer';
import { DetailedVersionCheckResult } from '../types/PackageInfo';

export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      port: 465,
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(
    to: string,
    subject: string,
    repoName: string,
    outdatedPackages: DetailedVersionCheckResult[],
  ) {
    const htmlBody = this.generateHtmlBody(repoName, outdatedPackages);

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to,
      subject,
      html: htmlBody,
    };

    await this.transporter.sendMail(mailOptions);
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
