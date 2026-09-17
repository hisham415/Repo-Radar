import { parseRateLimitHeaders } from './rateLimitHeaders';

describe('parseRateLimitHeaders', () => {
  it('parses GitHub rate-limit headers into epoch milliseconds', () => {
    const headers = new Headers({
      'x-ratelimit-limit': '60',
      'x-ratelimit-remaining': '42',
      'x-ratelimit-reset': '1700000000',
    });
    expect(parseRateLimitHeaders(headers)).toEqual({
      resource: 'core',
      limit: 60,
      remaining: 42,
      resetAt: 1_700_000_000_000,
    });
  });

  it('identifies the search bucket from x-ratelimit-resource', () => {
    const headers = new Headers({
      'x-ratelimit-limit': '10',
      'x-ratelimit-remaining': '9',
      'x-ratelimit-reset': '1700000000',
      'x-ratelimit-resource': 'search',
    });
    expect(parseRateLimitHeaders(headers)?.resource).toBe('search');
  });

  it('returns null when any header is missing or malformed', () => {
    expect(parseRateLimitHeaders(new Headers({ 'x-ratelimit-limit': '60' }))).toBeNull();
    expect(parseRateLimitHeaders(undefined)).toBeNull();
  });
});
