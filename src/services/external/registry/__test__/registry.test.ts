import { NpmRegistry } from '../npm';
import { PackagistRegistry } from '../packagist';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('NpmRegistry', () => {
  let mockAxios: MockAdapter;
  let npmRegistry: NpmRegistry;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    npmRegistry = new NpmRegistry();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should return the latest package release', async () => {
    const packageName = 'test-package';
    const mockResponse = {
      'dist-tags': {
        latest: '1.0.0',
      },
    };

    mockAxios.onGet(`/${packageName}`).reply(200, mockResponse);

    const latestVersion =
      await npmRegistry.getLatestPackageRelease(packageName);

    expect(latestVersion).toBe('1.0.0');
  });

  it('should return "unknown" if the API call fails', async () => {
    const packageName = 'test-package';

    mockAxios.onGet(`/${packageName}`).reply(404);

    const latestVersion =
      await npmRegistry.getLatestPackageRelease(packageName);

    expect(latestVersion).toBe('unknown');
  });
});

describe('PackagistRegistry', () => {
  let mockAxios: MockAdapter;
  let packagistRegistry: PackagistRegistry;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    packagistRegistry = new PackagistRegistry();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  it('should return the latest package release', async () => {
    const packageName = 'test-package';
    const mockResponse = {
      package: {
        versions: {
          '1.0.0': { version: '1.0.0', version_normalized: '1.0.0' },
          '2.0.0': { version: '2.0.0', version_normalized: '2.0.0' },
        },
      },
    };

    mockAxios.onGet(`/${packageName}.json`).reply(200, mockResponse);

    const latestVersion =
      await packagistRegistry.getLatestPackageRelease(packageName);

    expect(latestVersion).toBe('2.0.0');
  });

  it('should return "unknown" if the API call fails', async () => {
    const packageName = 'test-package';

    mockAxios.onGet(`/${packageName}.json`).reply(404);

    const latestVersion =
      await packagistRegistry.getLatestPackageRelease(packageName);

    expect(latestVersion).toBe('unknown');
  });

  it('should return "unknown" if no versions are found', async () => {
    const packageName = 'test-package';
    const mockResponse = {
      package: {
        versions: {},
      },
    };

    mockAxios.onGet(`/${packageName}.json`).reply(200, mockResponse);

    const latestVersion =
      await packagistRegistry.getLatestPackageRelease(packageName);

    expect(latestVersion).toBe('unknown');
  });
});
