import type { RateLimitInfo, RateLimitResource } from '@repo-radar/core';

function readNumericHeader(headers: Headers, name: string): number | null {
  const raw = headers.get(name);
  if (raw === null || raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function readResource(headers: Headers): RateLimitResource {
  return headers.get('x-ratelimit-resource') === 'search' ? 'search' : 'core';
}

export function parseRateLimitHeaders(headers: Headers | undefined): RateLimitInfo | null {
  if (!headers) return null;
  const limit = readNumericHeader(headers, 'x-ratelimit-limit');
  const remaining = readNumericHeader(headers, 'x-ratelimit-remaining');
  const resetSec = readNumericHeader(headers, 'x-ratelimit-reset');
  if (limit === null || remaining === null || resetSec === null) return null;
  return { resource: readResource(headers), limit, remaining, resetAt: resetSec * 1000 };
}
