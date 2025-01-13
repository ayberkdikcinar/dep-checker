import { EntryService } from '../repositorySubscriptionService';
import { EntryCollection } from '../../data/collections/entryCollection';
import { EntryPayload } from '../../types';
import { Entry } from '../../models/entry';

jest.mock('../../data/collections/entryCollection');
jest.mock('../deprecatedPackageFinder');
jest.mock('../../lib/apis/platform/platformFactory');

describe('EntryService', () => {
  let entryService: EntryService;
  let mockEntryCollection: jest.Mocked<EntryCollection>;

  beforeEach(() => {
    mockEntryCollection = {
      add: jest.fn(),
    } as unknown as jest.Mocked<EntryCollection>;

    (EntryCollection.getInstance as jest.Mock).mockReturnValue(
      mockEntryCollection,
    );
    entryService = new EntryService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createEntry', () => {
    it('should create a new entry and return it', async () => {
      const entryPayload: EntryPayload = {
        platform: 'github',
        repo: 'test-repo',
        owner: 'test-owner',
        emails: ['test@example.com'],
      };
      const newEntry: Entry = {
        id: 'generated-id',
        createdAt: new Date(),
        ...entryPayload,
      };

      mockEntryCollection.add.mockResolvedValue(newEntry);

      const result = await entryService.createEntry(entryPayload);

      expect(result).toEqual(newEntry);
      expect(mockEntryCollection.add).toHaveBeenCalledWith(
        expect.objectContaining(entryPayload),
      );
    });

    it('should return null if entry already exists', async () => {
      const entryPayload: EntryPayload = {
        platform: 'github',
        repo: 'test-repo',
        owner: 'test-owner',
        emails: ['test@example.com'],
      };

      mockEntryCollection.add.mockResolvedValue(null);

      const result = await entryService.createEntry(entryPayload);

      expect(result).toBeNull();
      expect(mockEntryCollection.add).toHaveBeenCalledWith(
        expect.objectContaining(entryPayload),
      );
    });
  });
});
