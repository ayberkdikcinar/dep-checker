import fs from 'fs';
import { resolvePath } from './resolvePath';
import { logger } from '../config/logger';

export const emptyJSONFile = async (filePath: string) => {
  try {
    const resolvedPath = resolvePath(filePath);
    await fs.promises.writeFile(resolvedPath, '[]', 'utf-8');
    logger.info(`File '${filePath}' reset with []`);
  } catch (error) {
    logger.error(
      `Error while resetting file ${filePath}: ${JSON.stringify(error)}`,
    );
  }
};
