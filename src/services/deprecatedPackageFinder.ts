import { UrlInfo } from '../types/UrlInfo';
import { FilesToLook } from '../lib/constants/endpoints';
import { RepoFile } from '../types/RepoFile';
import { FileParserService } from './fileParser';
import { PackageInfo } from '../types/PackageInfo';
import { VersionCheckerService } from './versionChecker';
import { PlatformApi } from '../lib/types';
export class DeprecatedPackageFinder {
  async readFileFromRepository(platformApi: PlatformApi, urlInfo: UrlInfo) {
    const results = await Promise.allSettled(
      FilesToLook.map((file) =>
        platformApi.fetchFileContent({
          owner: urlInfo.owner,
          repo: urlInfo.repo,
          filePath: file,
        }),
      ),
    );
    const fileResponses = results
      .filter((result) => result.status === 'fulfilled')
      .map((res) => res.value);

    return fileResponses;
  }

  async parseFile(fileResponses: RepoFile[]) {
    const fileParserService = new FileParserService();
    let packageList: PackageInfo[] = [];
    for (const file of fileResponses) {
      const parsed = fileParserService.parseFileContent(file);
      if (parsed) {
        packageList = [...packageList, ...parsed];
      }
    }
    return packageList;
  }

  async checkPackageVersions(packageList: PackageInfo[]) {
    const versionCheckService = new VersionCheckerService();
    const respOutdated =
      await versionCheckService.getOutdatedPackages(packageList);
    return respOutdated;
  }
}
