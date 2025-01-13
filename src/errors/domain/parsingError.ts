export class ParsingError extends Error {
  constructor(
    public message: string,
    public filePath: string,
  ) {
    super(message);
    this.name = 'ParsingError';
  }
}
