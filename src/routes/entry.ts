import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { createEntry } from '../handlers/entry';
import { extractInfoFromUrl } from '../lib/utils/parsers';
import { BadRequestError } from '../errors/badRequestError';
import { ErrorMessage } from '../lib/constants/errorMessage';
const router = Router();

router.post(
  '/entries',
  [
    body('repositoryUrl').notEmpty().isString(),
    body('emails')
      .isArray()
      .custom((emails: unknown[]) => {
        for (const email of emails) {
          if (typeof email !== 'string') {
            throw new Error('Invalid email address in array');
          }
          if (!/\S+@\S+\.\S+/.test(email)) {
            throw new Error('Invalid email address in array');
          }
        }

        return true;
      }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    /* const entry: Entry = {
    registry: req.body.registry,
    email: req.body.email,
  };*/
    try {
      const { repositoryUrl, emails } = req.body;
      const info = extractInfoFromUrl(repositoryUrl);
      if (!info) {
        throw new BadRequestError(ErrorMessage.INVALID_URL);
      }
      const response = await createEntry(info);
      res.json(response);
      return;
    } catch (error) {
      next(error);
    }
  },

  ///repo,
  //emailler
  //next_notification_date
);

export { router as entryRouter };
