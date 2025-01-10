import { logger } from '../../config/logger';
import { BaseCollection } from './baseCollection';
import { Entry } from '../../models/entry';
import { ErrorMessage } from '../../constants/errorMessage';

export class EntryCollection extends BaseCollection<Entry> {
  private static instance: EntryCollection;

  private constructor() {
    super('src/data/entries.json');
  }

  public static getInstance(): EntryCollection {
    if (!EntryCollection.instance) {
      EntryCollection.instance = new EntryCollection();
    }
    return EntryCollection.instance;
  }

  async add(data: Entry): Promise<Entry | null> {
    try {
      const entries = await this.getAll();
      if (await this.entryExists(data)) {
        logger.warn(ErrorMessage.ENTRY_EXISTS_DB);
        return null;
      }
      entries.push(data);
      await this.writeFile(entries);
      return data;
    } catch (error) {
      logger.warn(error);
      return null;
    }
  }

  async entryExists(newEntry: Entry): Promise<boolean> {
    const entries = await this.readFile();
    return entries.some(
      (entry) =>
        entry.owner === newEntry.owner &&
        entry.repo === newEntry.repo &&
        entry.platform === newEntry.platform,
    );
  }
}
