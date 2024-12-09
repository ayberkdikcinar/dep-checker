import { RepoFile } from '../types/RepoFile';
import {
  ComposerJSON,
  Dependencies,
  PackageInfo,
  PackageJSON,
} from '../types/PackageInfo';
import { sanitizeVersion } from '../lib/utils/sanitizeVersion';
class FileParserService {
  parseFileContent(file: RepoFile): PackageInfo[] | null {
    const decodedContent = Buffer.from(file.content, 'base64').toString();

    switch (file.name) {
      case 'composer.json':
        return this.parseComposerJson(decodedContent);
      case 'package.json':
        return this.parsePackageJson(decodedContent);
      default:
        return null;
    }
  }

  private parseComposerJson(content: string): PackageInfo[] {
    const parsedJson = JSON.parse(content) as ComposerJSON;
    const dependencies = parsedJson.require;
    const devDependencies = parsedJson['require-dev'];
    return this.extractPackages(
      { ...dependencies, ...devDependencies },
      'packagist',
    );
  }

  private parsePackageJson(content: string): PackageInfo[] {
    const parsedJson = JSON.parse(content) as PackageJSON;
    const { dependencies, devDependencies } = parsedJson;
    return this.extractPackages({ ...dependencies, ...devDependencies }, 'npm');
  }
  private extractPackages(
    dependencies: Dependencies,
    registry: string,
  ): PackageInfo[] {
    const allPackages = [...Object.entries(dependencies)];

    return allPackages.map(([name, version]) => ({
      name,
      version: sanitizeVersion(version),
      registry,
    }));
  }
}

export { FileParserService };
