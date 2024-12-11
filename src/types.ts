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
  message?: string;
  data: unknown;
  status: JobStatus;
  processedDate: number;
  finishedDate: number;
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

export interface RepoFile {
  name: string;
  content: string;
}

export interface UrlInfo {
  platform: string;
  owner: string;
  repo: string;
}
