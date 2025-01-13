import { UrlInfo } from '../types';

function parseRepositoryUrl(url: string): UrlInfo | null {
  const sanitizedUrl = url.replace(/\/$/, '');
  const regex = /^(https:\/\/(?:www\.)?([^/]+)\/([^/]+)\/([^/]+))$/;
  const match = sanitizedUrl.match(regex);
  if (!match) return null;
  return { platform: match[2], owner: match[3], repo: match[4] };
}

export { parseRepositoryUrl };
