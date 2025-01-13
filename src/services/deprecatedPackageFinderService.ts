import { UrlInfo, PackageInfo, RepoFile } from '../types';
import { FileParserService } from './fileParserService';
import { VersionCheckerService } from './versionCheckerService';
import { PlatformFactory } from './external/platform/platformFactory';
import { PlatformError } from '../errors/domain';
import { ErrorMessage } from '../constants/messages';

const FilesToLook = ['composer.json', 'package.json'];

export class DeprecatedPackageFinderService {
  private fileParserService: FileParserService;
  private versionCheckerService: VersionCheckerService;

  constructor() {
    this.fileParserService = new FileParserService();
    this.versionCheckerService = new VersionCheckerService();
  }

  async findDeprecatedPackages(urlInfo: UrlInfo) {
    const fileResponses = await this.readFileFromRepository({
      owner: urlInfo.owner,
      platform: urlInfo.platform,
      repo: urlInfo.repo,
    });
    const packageList = await this.parseFile(fileResponses);
    return await this.versionCheckerService.getOutdatedPackages(packageList);
  }

  private async readFileFromRepository(urlInfo: UrlInfo): Promise<RepoFile[]> {
    const platformApi = PlatformFactory.getPlatformApi(urlInfo.platform);
    if (!platformApi) {
      throw new PlatformError(ErrorMessage.InvalidPlatform(urlInfo.platform));
    }
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

  private async parseFile(fileResponses: RepoFile[]): Promise<PackageInfo[]> {
    let packageList: PackageInfo[] = [];
    for (const file of fileResponses) {
      const parsed = this.fileParserService.parseFileContent(file);
      if (parsed) {
        packageList = [...packageList, ...parsed];
      }
    }
    return packageList;
  }
}
