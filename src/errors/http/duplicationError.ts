import { CustomHTTPError } from './customHTTPError';

export class DuplicationError extends CustomHTTPError {
  statusCode = 409;

  constructor(public message: string) {
    super('Duplicated');
  }

  serializeErrors = () => {
    return [
      {
        message: this.message,
      },
    ];
  };
}
