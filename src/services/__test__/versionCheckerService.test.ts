import { VersionCheckerService } from '../versionCheckerService';
import { PackageInfo, VersionCheckResult } from '../../types';
import { RegistryFactory } from '../../apis/registry/registryFactory';
import { BaseRegistry } from '../../apis/registry/baseRegistry';
import { versionCompare } from '../../lib/utils/versionCompare';

jest.mock('../../lib/apis/registry/registryFactory');
jest.mock('../../lib/utils/versionCompare');

describe('VersionCheckerService', () => {
  let versionCheckerService: VersionCheckerService;
  let mockRegistry: jest.Mocked<BaseRegistry>;

  beforeEach(() => {
    versionCheckerService = new VersionCheckerService();
    mockRegistry = {
      getLatestPackageRelease: jest.fn(),
    } as unknown as jest.Mocked<BaseRegistry>;

    (RegistryFactory.getRegistry as jest.Mock).mockReturnValue(mockRegistry);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getLatestVersion', () => {
    it('should return the latest version from the registry', async () => {
      const packageInfo: PackageInfo = {
        name: 'test-package',
        version: '1.0.0',
        registry: 'npm',
      };
      mockRegistry.getLatestPackageRelease.mockResolvedValue('2.0.0');

      const latestVersion =
        await versionCheckerService['getLatestVersion'](packageInfo);

      expect(latestVersion).toBe('2.0.0');
      expect(mockRegistry.getLatestPackageRelease).toHaveBeenCalledWith(
        'test-package',
      );
    });

    it('should return "null" if the registry is not found', async () => {
      const packageInfo: PackageInfo = {
        name: 'test-package',
        version: '1.0.0',
        registry: 'unknown',
      };
      (RegistryFactory.getRegistry as jest.Mock).mockReturnValue(null);

      const latestVersion =
        await versionCheckerService['getLatestVersion'](packageInfo);

      expect(latestVersion).toBe(null);
    });
  });

  describe('checkPackageVersion', () => {
    it('should return upToDate as true if the package version is up to date', async () => {
      const packageInfo: PackageInfo = {
        name: 'test-package',
        version: '1.0.0',
        registry: 'npm',
      };
      mockRegistry.getLatestPackageRelease.mockResolvedValue('1.0.0');
      (versionCompare as jest.Mock).mockReturnValue(0);

      const result: VersionCheckResult =
        await versionCheckerService.checkPackageVersion(packageInfo);

      expect(result).toEqual({ latestVersion: '1.0.0', upToDate: true });
    });

    it('should return upToDate as false if the package version is not up to date', async () => {
      const packageInfo: PackageInfo = {
        name: 'test-package',
        version: '1.0.0',
        registry: 'npm',
      };
      mockRegistry.getLatestPackageRelease.mockResolvedValue('2.0.0');
      (versionCompare as jest.Mock).mockReturnValue(-1);

      const result: VersionCheckResult =
        await versionCheckerService.checkPackageVersion(packageInfo);

      expect(result).toEqual({ latestVersion: '2.0.0', upToDate: false });
    });

    it('should return upToDate as false if the latest version is "unknown"', async () => {
      const packageInfo: PackageInfo = {
        name: 'test-package',
        version: '1.0.0',
        registry: 'npm',
      };
      mockRegistry.getLatestPackageRelease.mockResolvedValue('unknown');

      const result: VersionCheckResult =
        await versionCheckerService.checkPackageVersion(packageInfo);

      expect(result).toEqual({ latestVersion: 'unknown', upToDate: false });
    });
  });

  describe('getOutdatedPackages', () => {
    it('should return only outdated packages', async () => {
      const packages: PackageInfo[] = [
        { name: 'package1', version: '1.0.0', registry: 'npm' },
        { name: 'package2', version: '1.0.0', registry: 'npm' },
      ];

      jest
        .spyOn(versionCheckerService, 'checkPackageVersion')
        .mockResolvedValueOnce({ latestVersion: '2.0.0', upToDate: false })
        .mockResolvedValueOnce({ latestVersion: '1.0.0', upToDate: true });

      const result = await versionCheckerService.getOutdatedPackages(packages);

      expect(result).toEqual([
        {
          name: 'package1',
          version: '1.0.0',
          registry: 'npm',
          latestVersion: '2.0.0',
          upToDate: false,
        },
      ]);
    });
  });
});
