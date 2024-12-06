import { PackageInfo } from '../types/PackageInfo';
import axios from 'axios';
class VersionCheckerService {
  async checkPackageVersion(
    packageInfo: PackageInfo,
  ): Promise<{ upToDate: boolean; latestVersion: string }> {
    const { name, version, registry } = packageInfo;
    let registryUrl = '';
    if (registry === 'npm') {
      registryUrl = `https://registry.npmjs.org/${name}`;
    }
    if (registry === 'packagist') {
      registryUrl = `https://packagist.org/packages/${name}.json`;
    }
    try {
      const response = await axios.get(registryUrl);
      const latestVersion = response.data['dist-tags'].latest;
      return {
        latestVersion,
        upToDate: latestVersion === version,
      };
    } catch (error) {
      console.error(`Failed to fetch package info for ${name}:`, error);
      return { latestVersion: version, upToDate: false };
    }
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
