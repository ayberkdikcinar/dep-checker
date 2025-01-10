import { UrlInfo, PackageInfo } from '../types';
import { FilesToLook } from '../constants/filesToLook';
import { FileParserService } from './fileParserService';
import { VersionCheckerService } from './versionCheckerService';
import { PlatformApi, RepoFile } from '../types';
export class DeprecatedPackageFinder {
  private fileParserService: FileParserService;
  private versionCheckerService: VersionCheckerService;

  constructor() {
    this.fileParserService = new FileParserService();
    this.versionCheckerService = new VersionCheckerService();
  }

  async readFileFromRepository(
    platformApi: PlatformApi,
    urlInfo: UrlInfo,
  ): Promise<RepoFile[]> {
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

  async parseFile(fileResponses: RepoFile[]): Promise<PackageInfo[]> {
    let packageList: PackageInfo[] = [];
    for (const file of fileResponses) {
      const parsed = this.fileParserService.parseFileContent(file);
      if (parsed) {
        packageList = [...packageList, ...parsed];
      }
    }
    return packageList;
  }

  async getOutdatedPackages(packageList: PackageInfo[]) {
    return await this.versionCheckerService.getOutdatedPackages(packageList);
  }
}
