import { UrlInfo } from '../../types/UrlInfo';

function extractInfoFromUrl(url: string): UrlInfo | null {
  const sanitizedUrl = url
    .replace('https://', '')
    .replace(/\/+/g, '/')
    .replace(/\/$/, '');

  const parts = sanitizedUrl.split('/');
  if (parts.length < 3) {
    return null;
  }
  const repo = parts[parts.length - 1];
  const owner = parts[parts.length - 2];
  const platform = parts[parts.length - 3];
  return { platform, owner, repo };
}

export { extractInfoFromUrl };
