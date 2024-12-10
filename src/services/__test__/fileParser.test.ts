import { FileParserService } from '../fileParser';
import { RepoFile } from '../../types/RepoFile';
import { PackageInfo } from '../../types/PackageInfo';

describe('FileParserService', () => {
  let fileParserService: FileParserService;

  beforeEach(() => {
    fileParserService = new FileParserService();
  });

  describe('parseFileContent', () => {
    it('should parse composer.json file content', () => {
      const file: RepoFile = {
        name: 'composer.json',
        content: Buffer.from(
          JSON.stringify({
            require: {
              package1: '1.0.0',
            },
            'require-dev': {
              package2: '2.0.0',
            },
          }),
        ).toString('base64'),
      };

      const expected: PackageInfo[] = [
        { name: 'package1', version: '1.0.0', registry: 'packagist' },
        { name: 'package2', version: '2.0.0', registry: 'packagist' },
      ];

      const result = fileParserService.parseFileContent(file);
      expect(result).toEqual(expected);
    });

    it('should parse package.json file content', () => {
      const file: RepoFile = {
        name: 'package.json',
        content: Buffer.from(
          JSON.stringify({
            dependencies: {
              package1: '1.0.0',
            },
            devDependencies: {
              package2: '2.0.0',
            },
          }),
        ).toString('base64'),
      };

      const expected: PackageInfo[] = [
        { name: 'package1', version: '1.0.0', registry: 'npm' },
        { name: 'package2', version: '2.0.0', registry: 'npm' },
      ];

      const result = fileParserService.parseFileContent(file);
      expect(result).toEqual(expected);
    });

    it('should return null for unsupported file types', () => {
      const file: RepoFile = {
        name: 'unsupported.json',
        content: Buffer.from('{}').toString('base64'),
      };

      const result = fileParserService.parseFileContent(file);
      expect(result).toBeNull();
    });
  });

  describe('parseComposerJson', () => {
    it('should parse composer.json content', () => {
      const content = JSON.stringify({
        require: {
          package1: '1.0.0',
        },
        'require-dev': {
          package2: '2.0.0',
        },
      });

      const expected: PackageInfo[] = [
        { name: 'package1', version: '1.0.0', registry: 'packagist' },
        { name: 'package2', version: '2.0.0', registry: 'packagist' },
      ];

      const result = fileParserService['parseComposerJson'](content);
      expect(result).toEqual(expected);
    });
  });

  describe('parsePackageJson', () => {
    it('should parse package.json content', () => {
      const content = JSON.stringify({
        dependencies: {
          package1: '1.0.0',
        },
        devDependencies: {
          package2: '2.0.0',
        },
      });

      const expected: PackageInfo[] = [
        { name: 'package1', version: '1.0.0', registry: 'npm' },
        { name: 'package2', version: '2.0.0', registry: 'npm' },
      ];

      const result = fileParserService['parsePackageJson'](content);
      expect(result).toEqual(expected);
    });
  });
});
