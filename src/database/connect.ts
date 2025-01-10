import sqlite3 from 'sqlite3';
import { resolvePath } from '../utils/resolvePath';
import { logger } from '../config/logger';
const sql3 = sqlite3.verbose();

const db = new sql3.Database(
  resolvePath('src/database/data.db'),
  sqlite3.OPEN_READWRITE,
  (err) => {
    if (err) logger.error(err.message);
  },
);

export { db };
