import { Router } from 'express';
import { body } from 'express-validator';
import { createEntry } from './entryController';
import { validateRequest } from '../middlewares/validateRequest';
const router = Router();

router.post(
  '/entries',
  [
    body('repositoryUrl').notEmpty().isString(),
    body('emails')
      .notEmpty()
      .isArray()
      .withMessage('Emails must be an array')
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
  validateRequest,
  createEntry,
);

export { router as entryRouter };
