import { BaseUrl } from '../../constants/endpoints';
import {
  PackageRelease,
  PackagistPackageResponse,
  Versions,
} from '../../types';
import { BaseRegistry } from './baseRegistry';
import { versionCompare } from '../../utils/versionCompare';
export class PackagistRegistry extends BaseRegistry {
  private developmentalTags: string[] = [
    'alpha',
    'beta',
    'dev',
    'develop',
    'development',
    'master',
    'rc',
    'untagged',
    'wip',
  ];

  constructor() {
    super(BaseUrl.packagist);
  }

  async getLatestPackageRelease(packageName: string): Promise<string> {
    try {
      const response = await this.client.get(`/${packageName}.json`);
      const packageMetadata = response.data as PackagistPackageResponse;
      return this.resolveLatestRelease(packageMetadata.package.versions);
    } catch (error) {
      return 'unknown';
    }
  }

  private resolveLatestRelease(versions: Versions): string {
    if (Object.keys(versions).length === 0) return 'unknown';
    const latestVersion = Object.values(versions)
      .filter(
        (release) => !this.isDevelopmentalRelease(release.version_normalized!),
      )
      .reduce(this.findLatestVersion, null);

    return latestVersion?.version_normalized || 'unknown';
  }

  private findLatestVersion = (
    latest: PackageRelease | null,
    current: PackageRelease,
  ): PackageRelease => {
    if (
      !latest ||
      versionCompare(current.version_normalized!, latest.version_normalized!) >
        0
    ) {
      return current;
    }
    return latest;
  };

  private isDevelopmentalRelease(version: string): boolean {
    return this.developmentalTags.some((tag) =>
      version.toLowerCase().includes(tag.toLowerCase()),
    );
  }
}
