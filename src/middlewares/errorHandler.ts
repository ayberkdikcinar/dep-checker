import { Request, Response, NextFunction } from 'express';
import { CustomHTTPError } from '../errors/http';
import { logger } from '../config/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomHTTPError) {
    logger.warn(err.serializeErrors());
    res.status(err.statusCode).json({
      errors: err.serializeErrors(),
    });
    return;
  }
  logger.error(err);
  res.status(500).json({
    errors: [{ message: 'Something went wrong' }],
  });
  return;
};
