import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors';
import { EntryPayload } from '../types';
import { extractInfoFromUrl } from '../utils/extractUrl';
import { ErrorMessage } from '../constants/errorMessage';
import { EntryService } from '../services/entryService';
import { scheduleJob } from '../queue/scheduler';
import { Entry } from '../models/entry';
import { repositoryEntryQueue } from '../constants/queueConsts';
async function processEntry(req: Request, res: Response, next: NextFunction) {
  try {
    const entryService = new EntryService();
    const { repositoryUrl, emails } = req.body;

    const info = extractInfoFromUrl(repositoryUrl);
    if (!info) {
      throw new BadRequestError(ErrorMessage.INVALID_URL);
    }

    const newEntryPayload: EntryPayload = {
      owner: info.owner,
      platform: info.platform,
      repo: info.repo,
      emails,
    };

    const newEntry = await entryService.createEntry(newEntryPayload);
    if (newEntry) {
      await scheduleJob<Entry>(repositoryEntryQueue, newEntry, true);
    }
    const outdatedPackages =
      await entryService.findOutdatedPackages(newEntryPayload);

    res.json(outdatedPackages);
    return;
  } catch (error) {
    next(error);
  }
}

export { processEntry };
