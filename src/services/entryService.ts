import { ErrorMessage } from '../lib/constants/errorMessage';
import { EntryCollection } from '../collections/entryCollection';
import { Entry } from '../models/entry';
import { genId } from '../lib/utils/genId';
import { DetailedVersionCheckResult, EntryPayload } from '../types';
import { NotFoundError } from '../errors';
import { DeprecatedPackageFinder } from './deprecatedPackageFinder';
import { PlatformFactory } from '../lib/apis/platform/platformFactory';

export class EntryService {
  private deprecatedPackageFinder: DeprecatedPackageFinder;
  private entryCollection: EntryCollection;

  constructor() {
    this.deprecatedPackageFinder = new DeprecatedPackageFinder();
    this.entryCollection = EntryCollection.getInstance();
  }

  async createEntry(entryPayload: EntryPayload): Promise<Entry | null> {
    const newEntry: Entry = {
      createdAt: new Date(),
      id: genId(),
      ...entryPayload,
    };

    return await this.entryCollection.add(newEntry);
  }

  async findOutdatedPackages(
    entry: EntryPayload,
  ): Promise<DetailedVersionCheckResult[]> {
    const apiService = PlatformFactory.getPlatformApi(entry.platform);
    if (!apiService) throw new NotFoundError(ErrorMessage.INVALID_PLATFORM);

    const files = await this.deprecatedPackageFinder.readFileFromRepository(
      apiService,
      entry,
    );
    if (!files.length) throw new NotFoundError(ErrorMessage.TARGET_NOT_FOUND);

    const packages = await this.deprecatedPackageFinder.parseFile(files);
    return await this.deprecatedPackageFinder.getOutdatedPackages(packages);
  }
}
