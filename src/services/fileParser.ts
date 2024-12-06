import { RepoFile } from '../types/RepoFile';
import {
  ComposerJSON,
  Dependencies,
  PackageInfo,
  PackageJSON,
} from '../types/PackageInfo';
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
    return this.extractPackages({ ...dependencies, ...devDependencies });
  }

  private parsePackageJson(content: string): PackageInfo[] {
    const parsedJson = JSON.parse(content) as PackageJSON;
    const { dependencies, devDependencies } = parsedJson;
    return this.extractPackages({ ...dependencies, ...devDependencies });
  }
  private extractPackages(dependencies: Dependencies): PackageInfo[] {
    const allPackages = [...Object.entries(dependencies)];

    return allPackages.map(([name, version]) => ({
      name,
      version,
    }));
  }
}

export { FileParserService };
