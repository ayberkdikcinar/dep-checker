import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { createEntry } from '../handlers/entry';
import { extractInfoFromUrl } from '../lib/utils/parsers';
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
  async (req: Request, res: Response) => {
    /* const entry: Entry = {
    registry: req.body.registry,
    email: req.body.email,
  };*/
    const { repositoryUrl, emails } = req.body;
    const info = extractInfoFromUrl(repositoryUrl);
    if (!info) {
      res.send('url is not in the correct format');
      return;
    }
    const response = await createEntry(info);
    res.json(response);
    return;
  },
);

export { router as entryRouter };
