import { extractInfoFromUrl } from './parsers';
import { UrlInfo } from '../../types/UrlInfo';

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
