import { UrlInfo } from '../types/UrlInfo';
import { BadRequestError } from '../errors/badRequestError';
import { ErrorMessage } from '../lib/constants/errorMessage';

import { DeprecatedPackageFinder } from '../services/deprecatedPackageFinder';
import { PlatformFactory } from '../lib/apis/platform/platformFactory';
async function createEntry(urlInfo: UrlInfo) {
  const apiService = PlatformFactory.getPlatformApi(urlInfo.platform);
  if (!apiService) throw new BadRequestError(ErrorMessage.INVALID_PLATFORM);

  const deprecatedPackageFinder = new DeprecatedPackageFinder();
  const files = await deprecatedPackageFinder.readFileFromRepository(
    apiService,
    urlInfo,
  );

  if (!files.length)
    throw new BadRequestError(ErrorMessage.TARGET_FILE_NOT_FOUND);

  const packages = await deprecatedPackageFinder.parseFile(files);
  return await deprecatedPackageFinder.checkPackageVersions(packages);
}

export { createEntry };
