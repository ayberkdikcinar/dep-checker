import { GitHubPlatformApi } from './github';
import { GitLabPlatformApi } from './gitlab';
import { PlatformApi } from '../../types';

export class PlatformFactory {
  static getPlatformApi(platform: string, token?: string): PlatformApi | null {
    if (platform === 'github.com') {
      return new GitHubPlatformApi(token);
    }
    if (platform === 'gitlab.com') {
      return new GitLabPlatformApi(token);
    }
    return null;
  }
}
