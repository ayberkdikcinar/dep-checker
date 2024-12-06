import { CustomError } from './customError';

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super('Invalid request parameters.');
  }

  serializeErrors = () => {
    return [
      {
        message: this.message,
      },
    ];
  };
}
