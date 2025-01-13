import { RegistryFactory } from './external/registry/registryFactory';
import { versionCompare } from '../utils/versionCompare';
import {
  DetailedVersionCheckResult,
  PackageInfo,
  VersionCheckResult,
} from '../types';
import { RegistryError } from '../errors/domain/registryError';

export class VersionCheckerService {
  private async getLatestVersion(
    packageInfo: PackageInfo,
  ): Promise<string | null> {
    const { name, registry } = packageInfo;
    const targetRegistry = RegistryFactory.getRegistry(registry);
    if (!targetRegistry) {
      throw new RegistryError(`Registry ${registry} is not supported.`);
    }
    return await targetRegistry.getLatestPackageRelease(name);
  }

  async checkPackageVersion(
    packageInfo: PackageInfo,
  ): Promise<VersionCheckResult> {
    const { version } = packageInfo;
    const latestVersion = await this.getLatestVersion(packageInfo);
    if (!latestVersion) {
      return { latestVersion: 'unknown', upToDate: false };
    }
    return {
      latestVersion,
      upToDate: versionCompare(version, latestVersion) === 0,
    };
  }

  async getOutdatedPackages(
    packages: PackageInfo[],
  ): Promise<DetailedVersionCheckResult[]> {
    const results = await Promise.all(
      packages.map(async (packageInfo) => {
        const result = await this.checkPackageVersion(packageInfo);
        return { ...packageInfo, ...result };
      }),
    );

    return results.filter(
      (result) => !result.upToDate && result.latestVersion !== 'unknown',
    );
  }
}
