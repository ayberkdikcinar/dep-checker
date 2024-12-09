function sanitizeVersion(version: string): string {
  const versions = version.split('|');
  return versions[versions.length - 1].replace(/[^0-9.]/g, '');
}

export { sanitizeVersion };
