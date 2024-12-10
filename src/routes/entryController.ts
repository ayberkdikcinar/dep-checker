import { entryHandler } from '../handlers/entry';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors';
import { EntryPayload } from '../types/Entry';
import { extractInfoFromUrl } from '../lib/utils/extractUrl';
import { ErrorMessage } from '../lib/constants/errorMessage';
async function createEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const { repositoryUrl, emails } = req.body;

    const info = extractInfoFromUrl(repositoryUrl);
    if (!info) {
      throw new BadRequestError(ErrorMessage.INVALID_URL);
    }
    const newEntry: EntryPayload = {
      owner: info.owner,
      platform: info.platform,
      repo: info.repo,
      emails,
    };

    const response = await entryHandler.createEntry(newEntry);
    res.json(response);
    return;
  } catch (error) {
    next(error);
  }
}

export { createEntry };
