import { JobId, JobStatus } from 'bull';

export type Registry = 'npm' | 'packagist';

export interface EntryPayload {
  platform: string;
  repo: string;
  owner: string;
  emails: string[];
}

export interface JobLog {
  id: JobId;
  queueName: string;
  error?: string;
  data?: unknown;
  status: JobStatus;
  processedAt: number;
  finishedAt: number;
}

export interface PackageInfo {
  name: string;
  version: string;
  registry: string;
}
export interface Dependencies {
  [key: string]: string;
}

export interface PackageJSON {
  dependencies: Dependencies;
  devDependencies: Dependencies;
}

export interface ComposerJSON {
  require: Dependencies;
  'require-dev': Dependencies;
}

export interface VersionCheckResult {
  upToDate: boolean;
  latestVersion: string;
}

export interface DetailedVersionCheckResult extends VersionCheckResult {
  name: string;
  version: string;
}

export interface UrlInfo {
  platform: string;
  owner: string;
  repo: string;
}

export interface EmailNotificationPayload {
  to: string;
  subject: string;
  repoName: string;
  info?: string;
  outdatedPackages: DetailedVersionCheckResult[];
}
