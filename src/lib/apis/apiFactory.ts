import { GitHubApiService } from './github';
import { GitLabApiService } from './gitlab';
import { ApiService } from '../types';

export class ApiServiceFactory {
  static getApiService(platform: string, token?: string): ApiService | null {
    if (platform === 'github.com') {
      return new GitHubApiService(token);
    }
    if (platform === 'gitlab.com') {
      return new GitLabApiService(token);
    }
    return null;
  }
}
