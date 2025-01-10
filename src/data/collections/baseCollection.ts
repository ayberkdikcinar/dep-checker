import fs from 'fs';
import { logger } from '../../config/logger';
import { DataModel } from '../../models/entry';

interface FileError extends Error {
  code: string;
}

export abstract class BaseCollection<T extends DataModel> {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  protected async readFile(): Promise<T[]> {
    try {
      const data = await fs.promises.readFile(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      const fileErr = error as FileError;
      if (fileErr.code === 'ENOENT') {
        await this.writeFile([]);
        return [];
      }
      logger.error(`Error while reading ${this.filePath}. ${error}`);
      return [];
    }
  }

  protected async writeFile(data: T[]): Promise<void> {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      await fs.promises.writeFile(this.filePath, jsonData, 'utf-8');
    } catch (error) {
      logger.error(`Error while writing to ${this.filePath}: ${error}`);
    }
  }

  async getById(id: string): Promise<T | undefined> {
    try {
      const entries = await this.readFile();
      return entries.find((entry) => entry.id === id);
    } catch (error) {
      logger.error(`Error getting entry by ID: ${error}`);
    }
  }

  async getAll(): Promise<T[]> {
    try {
      return await this.readFile();
    } catch (error) {
      logger.error(`Error getting all entries: ${error}`);
      return [];
    }
  }

  abstract add(data: T): Promise<T | null>;
}
