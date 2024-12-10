import { RegistryFactory } from '../lib/apis/registry/registryFactory';
import { versionCompare } from '../lib/utils/versionCompare';
import {
  DetailedVersionCheckResult,
  PackageInfo,
  VersionCheckResult,
} from '../types/PackageInfo';

class VersionCheckerService {
  private async getLatestVersion(packageInfo: PackageInfo): Promise<string> {
    const { name, registry } = packageInfo;
    const targetRegistry = RegistryFactory.getRegistry(registry);
    if (!targetRegistry) {
      return 'unknown';
    }
    return await targetRegistry.getLatestPackageRelease(name);
  }

  async checkPackageVersion(
    packageInfo: PackageInfo,
  ): Promise<VersionCheckResult> {
    const { version } = packageInfo;
    const latestVersion = await this.getLatestVersion(packageInfo);
    if (latestVersion === 'unknown') {
      return { latestVersion, upToDate: false };
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

export { VersionCheckerService };
