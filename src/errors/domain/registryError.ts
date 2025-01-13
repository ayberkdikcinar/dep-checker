export class RegistryError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'RegistryError';
  }
}
