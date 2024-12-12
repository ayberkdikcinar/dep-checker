import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { GitLabPlatformApi } from '../gitlab';
import { RepoFile, FileRequestAttrs } from '../../../types';

describe('GitLabPlatformApi', () => {
  let mockAxios: MockAdapter;
  let api: GitLabPlatformApi;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    api = new GitLabPlatformApi('test-token');
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('fetchProjectDetails', () => {
    it('should fetch project details and return the default branch', async () => {
      const owner = 'test-owner';
      const repo = 'test-repo';
      const mockResponse = { default_branch: 'main' };

      mockAxios.onGet(`/projects/${owner}%2F${repo}`).reply(200, mockResponse);

      const result = await api.fetchProjectDetails(owner, repo);

      expect(result).toEqual(mockResponse);
      expect(mockAxios.history.get[0].headers?.Authorization).toBe(
        'Bearer test-token',
      );
    });

    it('should throw an error if the API call fails', async () => {
      const owner = 'test-owner';
      const repo = 'test-repo';

      mockAxios.onGet(`/projects/${owner}%2F${repo}`).reply(404, {});

      await expect(api.fetchProjectDetails(owner, repo)).rejects.toThrow(
        'Error fetching project info',
      );
    });
  });

  describe('fetchFileContent', () => {
    it('should fetch file content using the specified branch', async () => {
      const attrs: FileRequestAttrs = {
        owner: 'test-owner',
        repo: 'test-repo',
        filePath: 'test-file.js',
        branch: 'main',
      };
      const mockResponse = {
        file_name: 'test-file.js',
        content: 'console.log("Hello, world!");',
      };

      mockAxios
        .onGet(
          `/projects/${attrs.owner}%2F${attrs.repo}/repository/files/${attrs.filePath}?ref=${attrs.branch}`,
        )
        .reply(200, mockResponse);

      const result = await api.fetchFileContent(attrs);

      expect(result).toEqual<RepoFile>({
        name: 'test-file.js',
        content: 'console.log("Hello, world!");',
      });
    });

    it('should fetch the default branch if no branch is specified', async () => {
      const attrs: FileRequestAttrs = {
        owner: 'test-owner',
        repo: 'test-repo',
        filePath: 'test-file.js',
      };
      const mockProjectDetails = { default_branch: 'main' };
      const mockResponse = {
        file_name: 'test-file.js',
        content: 'console.log("Hello, world!");',
      };

      mockAxios
        .onGet(`/projects/${attrs.owner}%2F${attrs.repo}`)
        .reply(200, mockProjectDetails);
      mockAxios
        .onGet(
          `/projects/${attrs.owner}%2F${attrs.repo}/repository/files/${attrs.filePath}?ref=${mockProjectDetails.default_branch}`,
        )
        .reply(200, mockResponse);

      const result = await api.fetchFileContent(attrs);

      expect(result).toEqual<RepoFile>({
        name: 'test-file.js',
        content: 'console.log("Hello, world!");',
      });
    });

    it('should throw an error if the file API call fails', async () => {
      const attrs: FileRequestAttrs = {
        owner: 'test-owner',
        repo: 'test-repo',
        filePath: 'nonexistent-file.js',
        branch: 'main',
      };

      mockAxios
        .onGet(
          `/projects/${attrs.owner}%2F${attrs.repo}/repository/files/${attrs.filePath}?ref=${attrs.branch}`,
        )
        .reply(404, {});

      await expect(api.fetchFileContent(attrs)).rejects.toThrow(
        'Error fetching repository file',
      );
    });
  });
});
