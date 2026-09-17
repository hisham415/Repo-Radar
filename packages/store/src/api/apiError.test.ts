import { toApiError } from './apiError';

describe('toApiError', () => {
  it('classifies 429 as rate-limit and carries resetAt', () => {
    const err = toApiError({ status: 429, data: { message: 'slow down' } }, 123);
    expect(err).toEqual({ kind: 'rate-limit', status: 429, message: 'slow down', resetAt: 123 });
  });

  it('classifies 403 with a rate-limit message as rate-limit', () => {
    const err = toApiError({ status: 403, data: { message: 'API rate limit exceeded' } });
    expect(err.kind).toBe('rate-limit');
  });

  it('classifies 403 without a rate-limit message as unknown', () => {
    expect(toApiError({ status: 403, data: { message: 'Forbidden' } }).kind).toBe('unknown');
  });

  it('classifies 404 and 401', () => {
    expect(toApiError({ status: 404, data: {} }).kind).toBe('not-found');
    expect(toApiError({ status: 401, data: {} }).kind).toBe('unauthorized');
  });

  it('classifies fetch failures as network errors', () => {
    expect(toApiError({ status: 'FETCH_ERROR', error: 'boom' }).kind).toBe('network');
  });

  it('falls back to a status message when the body has none', () => {
    expect(toApiError({ status: 500, data: null }).message).toBe('Request failed with status 500');
  });
});
