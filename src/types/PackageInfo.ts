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
