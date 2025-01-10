import axios, { AxiosInstance } from 'axios';

export abstract class BaseRegistry {
  protected client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({ baseURL: baseURL });
  }
  abstract getLatestPackageRelease(packageName: string): Promise<string>;
}
