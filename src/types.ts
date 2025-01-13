import { JobId, JobStatus } from 'bull';
import { AxiosInstance } from 'axios';

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
  id: number;
  to: string;
  subject: string;
  repoName: string;
  info?: string;
  body: DetailedVersionCheckResult[];
}

export interface PlatformApi {
  baseApiUrl: string;
  client: AxiosInstance;
  fetchFileContent: (attrs: FileRequestAttrs) => Promise<RepoFile>;
}

export interface RepoFile {
  name: string;
  content: string;
}
export interface FileRequestAttrs {
  owner: string;
  repo: string;
  filePath: string;
  branch?: string;
}

export interface PackageRelease {
  version_normalized?: string;
  version: string;
}

export interface PackageResponse {
  name: string;
  versions: Versions;
}

export interface Versions {
  [version: string]: PackageRelease;
}

export interface PackagistPackageResponse {
  package: PackageResponse;
}

export interface NpmPackageResponse extends PackageResponse {
  ['dist-tags']: { [key: string]: string };
}

export interface RepositorySubscriptionPayload {
  emails: string[];
  platform: string;
  name: string;
  owner: string;
}

export interface NotificationJob {
  id: number;
  email: string;
  repositorySubscriptionId: number;
  createdAt: Date;
  updatedAt: Date;
  status: 'PENDING' | 'FAILED' | 'COMPLETED';
}

export interface RepositorySubscription {
  id: number;
  platform: string;
  name: string;
  owner: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  notificationJobs: NotificationJob[];
}
