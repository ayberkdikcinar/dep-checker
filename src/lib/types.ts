import { AxiosInstance } from 'axios';
import { RepoFile } from '../types';
export interface PlatformApi {
  baseApiUrl: string;
  client: AxiosInstance;
  fetchFileContent: (attrs: FileRequestAttrs) => Promise<RepoFile>;
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
