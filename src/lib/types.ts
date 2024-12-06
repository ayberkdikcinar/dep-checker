import { AxiosInstance } from 'axios';
import { RepoFile } from '../types/RepoFile';
export interface ApiService {
  baseApiUrl: string;
  client: AxiosInstance;
  fetchFileContent: (attrs: FileRequestAttrs) => Promise<RepoFile>;
}

export interface FileRequestAttrs {
  owner: string;
  repo: string;
  filePath: string;
  branch?: string;
}
