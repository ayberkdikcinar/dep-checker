import { BaseRegistry } from './baseRegistry';
import { NpmRegistry } from './npm';
import { PackagistRegistry } from './packagist';

export class RegistryFactory {
  static getRegistry(registry: string): BaseRegistry | null {
    if (registry === 'npm') {
      return new NpmRegistry();
    }
    if (registry === 'packagist') {
      return new PackagistRegistry();
    }
    return null;
  }
}
