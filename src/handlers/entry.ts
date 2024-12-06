import { UrlInfo } from '../types/UrlInfo';
import { ApiServiceFactory } from '../lib/apis/apiFactory';
import { FilesToLook } from '../lib/constants/endpoints';
import { FileParserService } from '../services/fileParser';
import { PackageInfo } from '../types/PackageInfo';
import { logger } from '../lib/config/logger';
async function createEntry(urlInfo: UrlInfo) {
  const apiService = ApiServiceFactory.getApiService(urlInfo.platform);
  const results = await Promise.allSettled(
    FilesToLook.map((file) =>
      apiService.fetchFileContent({
        owner: urlInfo.owner,
        repo: urlInfo.repo,
        filePath: file,
      }),
    ),
  );
  logger.info(results);
  const fileResponses = results
    .filter((result) => result.status === 'fulfilled')
    .map((res) => res.value);

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

export { createEntry };
