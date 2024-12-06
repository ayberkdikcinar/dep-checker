import axios, { AxiosInstance } from 'axios';
import { BaseUrl } from '../constants/endpoints';
import { RepoFile } from '../../types/RepoFile';
import { FileRequestAttrs, ApiService } from '../types';
export class GitHubApiService implements ApiService {
  readonly baseApiUrl: string = BaseUrl.githubApi;
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

  async fetchFileContent(attrs: FileRequestAttrs): Promise<RepoFile> {
    try {
      const { owner, repo, filePath, branch } = attrs;
      const response = await this.client.get(
        `/repos/${owner}/${repo}/contents/${filePath}`,
        {
          params: {
            ref: branch,
          },
        },
      );
      const repoFile: RepoFile = {
        name: response.data.name,
        content: response.data.content,
      };
      return repoFile;
    } catch (error) {
      throw new Error(`GitHub API Error: ${error}`);
    }
  }
}
