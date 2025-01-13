export class PlatformError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'PlatformError';
  }
}
