import { randomBytes } from 'crypto';

export const genId = () => {
  return randomBytes(8).toString('hex');
};
