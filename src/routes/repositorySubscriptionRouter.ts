import { Router } from 'express';
import { body } from 'express-validator';
import { processRepositorySubscription } from './repositorySubscriptionController';
import { validateRequest } from '../middlewares/validateRequest';
import { BadRequestError } from '../errors/http';
import { ErrorMessage } from '../constants/messages';

const router = Router();

router.post(
  '/repository-subscriptions',
  [
    body('repositoryUrl').notEmpty().isString(),
    body('emails')
      .notEmpty()
      .isArray()
      .withMessage('Emails must be an array')
      .custom((emails: unknown[]) => {
        for (const email of emails) {
          if (typeof email !== 'string') {
            throw new BadRequestError(ErrorMessage.InvalidEmail);
          }
          if (!/\S+@\S+\.\S+/.test(email)) {
            throw new BadRequestError(ErrorMessage.InvalidEmail);
          }
        }
        return true;
      }),
  ],
  validateRequest,
  processRepositorySubscription,
);

export { router as repositorySubscriptionRouter };
