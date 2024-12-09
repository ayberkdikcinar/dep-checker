import { RegistryFactory } from '../lib/apis/registry/registryFactory';
import { versionCompare } from '../lib/utils/versionCompare';
import { PackageInfo } from '../types/PackageInfo';
class VersionCheckerService {
  async checkPackageVersion(
    packageInfo: PackageInfo,
  ): Promise<{ upToDate: boolean; latestVersion: string }> {
    const { name, version, registry } = packageInfo;
    const targetRegistry = RegistryFactory.getRegistry(registry);
    if (!targetRegistry) {
      return { latestVersion: 'unknown', upToDate: false };
    }
    const latestVersion = await targetRegistry.getLatestPackageRelease(name);
    if (latestVersion === 'unknown')
      return { latestVersion: latestVersion, upToDate: false };

    return {
      latestVersion,
      upToDate: versionCompare(version, latestVersion) === 0,
    };
  }

  async checkAllPackages(packages: PackageInfo[]): Promise<
    {
      upToDate: boolean;
      latestVersion: string;
      name: string;
      version: string;
    }[]
  > {
    const results = await Promise.all(
      packages.map(async (packageInfo) => {
        const result = await this.checkPackageVersion(packageInfo);
        return { ...packageInfo, ...result };
      }),
    );

    return results.filter((result) => !result.upToDate);
  }
}

export { VersionCheckerService };
