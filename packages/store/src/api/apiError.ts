import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { GitHubErrorDto } from '@repo-radar/core';

export type ApiErrorKind = 'rate-limit' | 'not-found' | 'unauthorized' | 'network' | 'unknown';

export interface ApiError {
  kind: ApiErrorKind;
  status: number | null;
  message: string;
  resetAt: number | null;
}

function readMessage(data: unknown): string | null {
  if (typeof data === 'object' && data !== null && 'message' in data) {
    const message = (data as GitHubErrorDto).message;
    return typeof message === 'string' ? message : null;
  }
  return null;
}

export function toApiError(error: FetchBaseQueryError, resetAt: number | null = null): ApiError {
  if (typeof error.status === 'number') {
    const message = readMessage(error.data) ?? `Request failed with status ${error.status}`;
    const isRateLimit =
      error.status === 429 || (error.status === 403 && /rate limit/i.test(message));

    if (isRateLimit) return { kind: 'rate-limit', status: error.status, message, resetAt };
    if (error.status === 404) return { kind: 'not-found', status: 404, message, resetAt: null };
    if (error.status === 401) return { kind: 'unauthorized', status: 401, message, resetAt: null };
    return { kind: 'unknown', status: error.status, message, resetAt: null };
  }

  if (error.status === 'FETCH_ERROR' || error.status === 'TIMEOUT_ERROR') {
    return {
      kind: 'network',
      status: null,
      message: 'Network error. Check your connection and try again.',
      resetAt: null,
    };
  }

  return {
    kind: 'unknown',
    status: null,
    message: error.error ?? 'Something went wrong.',
    resetAt: null,
  };
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'kind' in value &&
    'message' in value &&
    typeof (value as ApiError).message === 'string'
  );
}
