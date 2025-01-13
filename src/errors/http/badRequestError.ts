import { CustomHTTPError } from './customHTTPError';

export class BadRequestError extends CustomHTTPError {
  statusCode = 400;

  constructor(public message: string) {
    super('Invalid data.');
  }

  serializeErrors = () => {
    return [
      {
        message: this.message,
      },
    ];
  };
}
