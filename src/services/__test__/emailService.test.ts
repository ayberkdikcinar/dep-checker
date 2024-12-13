import { EmailService } from '../emailService';
import * as nodemailer from 'nodemailer';
import { DetailedVersionCheckResult } from '../../types';
import dotenv from 'dotenv';

dotenv.config();
jest.mock('nodemailer');
describe('EmailService', () => {
  const sendMailMock: jest.Mock = jest.fn();
  const createTransportMock = nodemailer.createTransport as jest.Mock;
  createTransportMock.mockReturnValue({
    sendMail: jest.fn().mockImplementation((mailOptions) => {
      sendMailMock(mailOptions);
    }),
  });

  const emailService: EmailService = EmailService.getInstance();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send an email with the correct options', async () => {
    const to = 'test@example.com';
    const subject = 'Test Subject';
    const repoName = 'test-repo';
    const outdatedPackages: DetailedVersionCheckResult[] = [
      {
        name: 'package1',
        version: '1.0.0',
        latestVersion: '1.1.0',
        upToDate: false,
      },
    ];

    await emailService.sendEmail({ to, subject, repoName, outdatedPackages });

    expect(sendMailMock).toHaveBeenCalledWith({
      from: process.env.EMAIL_ADDRESS,
      to,
      subject,
      html: expect.stringContaining('Outdated Packages for test-repo'),
    });
  });
});
