import { CustomHTTPError } from './customHTTPError';

export class NotFoundError extends CustomHTTPError {
  statusCode = 404;

  constructor(public message: string) {
    super(message);
  }
  serializeErrors = () => {
    return [
      {
        message: this.message,
      },
    ];
  };
}
