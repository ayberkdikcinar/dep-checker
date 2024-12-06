import { GitHubApiService } from './github';
import { GitLabApiService } from './gitlab';
import { ErrorMessage } from '../constants/errorMessage';
import { ApiService } from '../types';
import { BadRequestError } from '../../errors/badRequestError';
export class ApiServiceFactory {
  static getApiService(platform: string, token?: string): ApiService {
    if (platform === 'github.com') {
      return new GitHubApiService(token);
    }
    if (platform === 'gitlab.com') {
      return new GitLabApiService(token);
    }
    throw new BadRequestError(ErrorMessage.INVALID_PLATFORM);
  }
}
