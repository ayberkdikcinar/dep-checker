import { join, resolve } from 'path';

const projectRoot = resolve(__dirname, '../../../');

export function resolvePath(relativePath: string): string {
  return join(projectRoot, relativePath);
}
