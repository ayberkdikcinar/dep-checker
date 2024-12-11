import { EntryService } from '../entryService';
import { EntryCollection } from '../../collections/entryCollection';
import { DeprecatedPackageFinder } from '../deprecatedPackageFinder';
import { PlatformFactory } from '../../lib/apis/platform/platformFactory';
import { NotFoundError } from '../../errors';
import { ErrorMessage } from '../../lib/constants/errorMessage';
import { EntryPayload, DetailedVersionCheckResult } from '../../types';
import { Entry } from '../../models/entry';

jest.mock('../../collections/entryCollection');
jest.mock('../deprecatedPackageFinder');
jest.mock('../../lib/apis/platform/platformFactory');

describe('EntryService', () => {
  let entryService: EntryService;
  let mockEntryCollection: jest.Mocked<EntryCollection>;
  let mockDeprecatedPackageFinder: jest.Mocked<DeprecatedPackageFinder>;

  beforeEach(() => {
    mockEntryCollection =
      EntryCollection.getInstance() as jest.Mocked<EntryCollection>;
    mockDeprecatedPackageFinder =
      new DeprecatedPackageFinder() as jest.Mocked<DeprecatedPackageFinder>;
    entryService = new EntryService();
    (EntryCollection.getInstance as jest.Mock).mockReturnValue(
      mockEntryCollection,
    );
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
  });

  describe('findOutdatedPackages', () => {
    it('should throw NotFoundError if platform API is not found', async () => {
      const entryPayload: EntryPayload = {
        platform: 'unknown',
        repo: 'test-repo',
        owner: 'test-owner',
        emails: ['test@example.com'],
      };

      (PlatformFactory.getPlatformApi as jest.Mock).mockReturnValue(null);

      await expect(
        entryService.findOutdatedPackages(entryPayload),
      ).rejects.toThrow(NotFoundError);
      await expect(
        entryService.findOutdatedPackages(entryPayload),
      ).rejects.toThrow(ErrorMessage.INVALID_PLATFORM);
    });

    it('should throw NotFoundError if no files are found in the repository', async () => {
      const entryPayload: EntryPayload = {
        platform: 'github',
        repo: 'test-repo',
        owner: 'test-owner',
        emails: ['test@example.com'],
      };
      const mockApiService = {};
      (PlatformFactory.getPlatformApi as jest.Mock).mockReturnValue(
        mockApiService,
      );
      mockDeprecatedPackageFinder.readFileFromRepository.mockResolvedValue([]);

      await expect(
        entryService.findOutdatedPackages(entryPayload),
      ).rejects.toThrow(NotFoundError);
      await expect(
        entryService.findOutdatedPackages(entryPayload),
      ).rejects.toThrow(ErrorMessage.TARGET_NOT_FOUND);
    });

    it('should return outdated packages', async () => {
      const entryPayload: EntryPayload = {
        platform: 'github',
        repo: 'test-repo',
        owner: 'test-owner',
        emails: ['test@example.com'],
      };
      const mockApiService = {};
      const mockFiles = ['package.json'];
      const mockPackages = [{ name: 'test-package', version: '1.0.0' }];
      const mockOutdatedPackages: DetailedVersionCheckResult[] = [
        {
          name: 'test-package',
          version: '1.0.0',
          latestVersion: '2.0.0',
          upToDate: false,
        },
      ];

      (PlatformFactory.getPlatformApi as jest.Mock).mockReturnValue(
        mockApiService,
      );
      mockDeprecatedPackageFinder.readFileFromRepository.mockResolvedValue(
        mockFiles,
      );
      mockDeprecatedPackageFinder.parseFile.mockResolvedValue(mockPackages);
      mockDeprecatedPackageFinder.getOutdatedPackages.mockResolvedValue(
        mockOutdatedPackages,
      );

      const result = await entryService.findOutdatedPackages(entryPayload);

      expect(result).toEqual(mockOutdatedPackages);
    });
  });
});
