import axios, { AxiosInstance } from 'axios';
import { BaseUrl } from '../../constants/endpoints';
import { RepoFile, FileRequestAttrs, PlatformApi } from '../../types';
import { AxiosError } from 'axios';

export class GitLabPlatformApi implements PlatformApi {
  readonly baseApiUrl: string = BaseUrl.gitlabApi;
  readonly client: AxiosInstance;

  constructor(token?: string) {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    this.client = axios.create({
      baseURL: this.baseApiUrl,
      headers,
    });
  }

  async fetchProjectDetails(
    owner: string,
    repo: string,
  ): Promise<{ default_branch: string }> {
    try {
      const response = await this.client.get(`/projects/${owner}%2F${repo}`);
      return response.data as { default_branch: string };
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Error fetching project info:${axiosError.message}`);
    }
  }

  async fetchFileContent(attrs: FileRequestAttrs): Promise<RepoFile> {
    try {
      const { owner, repo, filePath } = attrs;
      let { branch } = attrs;
      if (!branch) {
        branch = (await this.fetchProjectDetails(owner, repo)).default_branch;
      }
      const response = await this.client.get(
        `/projects/${owner}%2F${repo}/repository/files/${filePath}?ref=${branch}`,
      );
      const repoFile: RepoFile = {
        name: response.data.file_name,
        content: response.data.content,
      };
      return repoFile;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`Error fetching repository file:${axiosError.message}`);
    }
  }
}
