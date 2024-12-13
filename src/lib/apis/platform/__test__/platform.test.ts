import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { GitHubPlatformApi } from '../github';
import { GitLabPlatformApi } from '../gitlab';
import { RepoFile, FileRequestAttrs } from '../../../types';
import { NotFoundError } from '../../../../errors';

describe('PlatformTests', () => {
  let mockAxios: MockAdapter;
  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.reset();
  });
  describe('GitHubPlatformApi', () => {
    let api: GitHubPlatformApi;

    beforeEach(() => {
      api = new GitHubPlatformApi('test-token');
    });

    it('sets the authorization header if a token is provided', () => {
      const headers = api.client.defaults.headers;
      expect(headers['Authorization']).toBe('Bearer test-token');
    });

    it('does not set the authorization header if no token is provided', () => {
      const apiWithoutToken = new GitHubPlatformApi();
      const headers = apiWithoutToken.client.defaults.headers;
      expect(headers['Authorization']).toBeUndefined();
    });

    it('fetches file content for a specific branch', async () => {
      const fileAttrs: FileRequestAttrs = {
        owner: 'test-owner',
        repo: 'test-repo',
        filePath: 'test-file.js',
        branch: 'main',
      };

      const mockResponse = { name: 'test-file.js', content: 'test-content' };

      mockAxios
        .onGet(
          `/repos/${fileAttrs.owner}/${fileAttrs.repo}/contents/${fileAttrs.filePath}`,
          {
            params: { ref: fileAttrs.branch },
          },
        )
        .reply(200, mockResponse);

      const result = await api.fetchFileContent(fileAttrs);

      expect(result).toEqual<RepoFile>({
        name: 'test-file.js',
        content: 'test-content',
      });
    });

    it('fetches file content without a branch specified', async () => {
      const fileAttrs: FileRequestAttrs = {
        owner: 'test-owner',
        repo: 'test-repo',
        filePath: 'test-file.js',
      };

      const mockResponse = { name: 'test-file.js', content: 'test-content' };

      mockAxios
        .onGet(
          `/repos/${fileAttrs.owner}/${fileAttrs.repo}/contents/${fileAttrs.filePath}`,
        )
        .reply(200, mockResponse);

      const result = await api.fetchFileContent(fileAttrs);

      expect(result).toEqual<RepoFile>({
        name: 'test-file.js',
        content: 'test-content',
      });
    });

    it('throws NotFoundError if the file is not found', async () => {
      const fileAttrs: FileRequestAttrs = {
        owner: 'test-owner',
        repo: 'test-repo',
        filePath: 'nonexistent-file.js',
        branch: 'main',
      };

      mockAxios
        .onGet(
          `/repos/${fileAttrs.owner}/${fileAttrs.repo}/contents/${fileAttrs.filePath}`,
          {
            params: { ref: fileAttrs.branch },
          },
        )
        .reply(404, {});

      await expect(api.fetchFileContent(fileAttrs)).rejects.toThrow(
        NotFoundError,
      );
      await expect(api.fetchFileContent(fileAttrs)).rejects.toThrow(
        'Error fetching repository file',
      );
    });
  });
  describe('GitLabPlatformApi', () => {
    let api: GitLabPlatformApi;

    beforeEach(() => {
      api = new GitLabPlatformApi('test-token');
    });

    it('retrieves project details including the default branch', async () => {
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

    it('throws an error if the project is not found', async () => {
      const owner = 'test-owner';
      const repo = 'test-repo';

      mockAxios.onGet(`/projects/${owner}%2F${repo}`).reply(404, {});

      await expect(api.fetchProjectDetails(owner, repo)).rejects.toThrow(
        'Error fetching project info',
      );
    });

    it('fetches file content for a specific branch', async () => {
      const fileAttrs: FileRequestAttrs = {
        owner: 'test-owner',
        repo: 'test-repo',
        filePath: 'test-file.js',
        branch: 'main',
      };

      const mockResponse = {
        file_name: 'test-file.js',
        content: 'test-content',
      };

      mockAxios
        .onGet(
          `/projects/${fileAttrs.owner}%2F${fileAttrs.repo}/repository/files/${fileAttrs.filePath}?ref=${fileAttrs.branch}`,
        )
        .reply(200, mockResponse);

      const result = await api.fetchFileContent(fileAttrs);

      expect(result).toEqual<RepoFile>({
        name: 'test-file.js',
        content: 'test-content',
      });
    });

    it('fetches file content using the default branch when no branch is specified', async () => {
      const fileAttrs: FileRequestAttrs = {
        owner: 'test-owner',
        repo: 'test-repo',
        filePath: 'test-file.js',
      };

      const mockProjectDetails = { default_branch: 'main' };
      const mockResponse = {
        file_name: 'test-file.js',
        content: 'test-content',
      };

      mockAxios
        .onGet(`/projects/${fileAttrs.owner}%2F${fileAttrs.repo}`)
        .reply(200, mockProjectDetails);
      mockAxios
        .onGet(
          `/projects/${fileAttrs.owner}%2F${fileAttrs.repo}/repository/files/${fileAttrs.filePath}?ref=${mockProjectDetails.default_branch}`,
        )
        .reply(200, mockResponse);

      const result = await api.fetchFileContent(fileAttrs);

      expect(result).toEqual<RepoFile>({
        name: 'test-file.js',
        content: 'test-content',
      });
    });

    it('throws an error if the file content fetch fails', async () => {
      const fileAttrs: FileRequestAttrs = {
        owner: 'test-owner',
        repo: 'test-repo',
        filePath: 'nonexistent-file.js',
        branch: 'main',
      };

      mockAxios
        .onGet(
          `/projects/${fileAttrs.owner}%2F${fileAttrs.repo}/repository/files/${fileAttrs.filePath}?ref=${fileAttrs.branch}`,
        )
        .reply(404, {});

      await expect(api.fetchFileContent(fileAttrs)).rejects.toThrow(
        'Error fetching repository file',
      );
    });
  });
});
