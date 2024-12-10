import { BadRequestError } from '../errors/badRequestError';
import { ErrorMessage } from '../lib/constants/errorMessage';
import { DeprecatedPackageFinder } from '../services/deprecatedPackageFinder';
import { PlatformFactory } from '../lib/apis/platform/platformFactory';
import { EntryCollection } from '../services/dataService';
import { scheduleEmailJob } from '../services/scheduler';
import { Entry, EntryPayload } from '../types/Entry';
import { genId } from '../lib/utils/genId';

async function createEntry(entryPayload: EntryPayload) {
  const apiService = PlatformFactory.getPlatformApi(entryPayload.platform);
  if (!apiService) throw new BadRequestError(ErrorMessage.INVALID_PLATFORM);

  const entryCollection = new EntryCollection();

  const newEntry: Entry = {
    createdAt: new Date(),
    id: genId(),
    ...entryPayload,
  };

  const deprecatedPackageFinder = new DeprecatedPackageFinder();
  const files = await deprecatedPackageFinder.readFileFromRepository(
    apiService,
    entryPayload,
  );

  if (!files.length)
    throw new BadRequestError(ErrorMessage.TARGET_FILE_NOT_FOUND);

  await entryCollection.add(newEntry);

  await scheduleEmailJob(newEntry);

  const packages = await deprecatedPackageFinder.parseFile(files);
  return await deprecatedPackageFinder.checkPackageVersions(packages);
}

export const entryHandler = { createEntry };
