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
