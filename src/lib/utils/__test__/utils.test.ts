import { extractInfoFromUrl } from '../extractUrl';
import { UrlInfo } from '../../../types/UrlInfo';
import { versionCompare } from '../versionCompare';
import { sanitizeVersion } from '../sanitizeVersion';

describe('extractInfoFromUrl', () => {
  it('should extract info from valid URL', () => {
    const url = 'https://github.com/user/repo';
    const expected: UrlInfo = {
      platform: 'github.com',
      owner: 'user',
      repo: 'repo',
    };
    expect(extractInfoFromUrl(url)).toEqual(expected);
  });

  it('should return null for invalid URL that does not have owner and repo', () => {
    const url = 'https://github.com';
    expect(extractInfoFromUrl(url)).toBeNull();
  });

  it('should return null for invalid URL with multiple consecutive slashes', () => {
    const url = 'https://github.com//user/repo';
    expect(extractInfoFromUrl(url)).toBeNull();
  });

  it('should handle URL with trailing slash', () => {
    const url = 'https://github.com/user/repo/';
    const expected: UrlInfo = {
      platform: 'github.com',
      owner: 'user',
      repo: 'repo',
    };
    expect(extractInfoFromUrl(url)).toEqual(expected);
  });

  it('should return null for URL without https:// or http://', () => {
    const url = 'github.com/user/repo';
    expect(extractInfoFromUrl(url)).toBeNull();
  });

  it('should return null for extra subdirectories in URLs', () => {
    const url = 'https://github.com/user/repo/s/c';
    expect(extractInfoFromUrl(url)).toBeNull();
  });
});

describe('sanitizeVersion', () => {
  it('should remove leading "v" from version', () => {
    const version = 'v1.0.0';
    const expected = '1.0.0';
    expect(sanitizeVersion(version)).toBe(expected);
  });

  it('should return the same version if no leading "v"', () => {
    const version = '1.0.0';
    const expected = '1.0.0';
    expect(sanitizeVersion(version)).toBe(expected);
  });

  it('should handle empty version string', () => {
    const version = '';
    const expected = '';
    expect(sanitizeVersion(version)).toBe(expected);
  });

  it('should handle version with multiple leading "v"s', () => {
    const version = 'vv1.0.0';
    const expected = '1.0.0';
    expect(sanitizeVersion(version)).toBe(expected);
  });
});

describe('versionCompare', () => {
  it('should return 0 for equal versions', () => {
    const version1 = '1.0.0';
    const version2 = '1.0.0';
    expect(versionCompare(version1, version2)).toBe(0);
  });

  it('should return -1 if first version is less than second version', () => {
    const version1 = '1.0.0';
    const version2 = '1.1.0';
    expect(versionCompare(version1, version2)).toBe(-1);
  });

  it('should return 1 if first version is greater than second version', () => {
    const version1 = '1.1.0';
    const version2 = '1.0.0';
    expect(versionCompare(version1, version2)).toBe(1);
  });

  it('should handle versions with different number of segments', () => {
    const version1 = '1.0';
    const version2 = '1.0.0';
    expect(versionCompare(version1, version2)).toBe(0);
  });

  it('should handle versions with pre-release identifiers', () => {
    const version1 = '1.0.0-alpha';
    const version2 = '1.0.0';
    expect(versionCompare(version1, version2)).toBe(0);
  });

  it('should handle versions with build metadata', () => {
    const version1 = '1.0.0+build1';
    const version2 = '1.0.0+build2';
    expect(versionCompare(version1, version2)).toBe(0);
  });
});
