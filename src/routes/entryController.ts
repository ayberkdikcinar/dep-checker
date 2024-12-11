import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../errors';
import { EntryPayload } from '../types';
import { extractInfoFromUrl } from '../lib/utils/extractUrl';
import { ErrorMessage } from '../lib/constants/errorMessage';
import { EntryService } from '../services/entryService';
import { scheduleEntryJob } from '../services/scheduler';
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
      await scheduleEntryJob(newEntry, new Date());
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
