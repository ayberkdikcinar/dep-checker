import { CustomError } from './customError';

export class DuplicationError extends CustomError {
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
