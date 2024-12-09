import { BaseUrl } from '../../constants/endpoints';
import { NpmPackageResponse } from '../../types';
import { BaseRegistry } from './baseRegistry';

export class NpmRegistry extends BaseRegistry {
  constructor() {
    super(BaseUrl.npm);
  }

  async getLatestPackageRelease(packageName: string): Promise<string> {
    try {
      const response = await this.client.get(`/${packageName}`);
      const packageMetadata = response.data as NpmPackageResponse;
      return packageMetadata['dist-tags'].latest;
    } catch (error) {
      return 'unknown';
    }
  }
}
