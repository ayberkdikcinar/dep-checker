import { RepoFile } from '../../types/RepoFile';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeFileData(data: Record<string, any>): RepoFile {
  return {
    name: data.name || data.file_name,
    content: data.content,
  };
}
