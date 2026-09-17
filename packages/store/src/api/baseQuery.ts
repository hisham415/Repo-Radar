import { fetchBaseQuery, type BaseQueryFn, type FetchArgs } from '@reduxjs/toolkit/query';
import { GITHUB_API_BASE_URL, GITHUB_API_VERSION } from '@repo-radar/core';
import type { AuthState } from '../slices/authSlice';
import { rateLimitReceived } from '../slices/rateLimitSlice';
import { toApiError, type ApiError } from './apiError';
import { parseRateLimitHeaders } from './rateLimitHeaders';

// Only the slice of state this layer needs; avoids a circular dependency on RootState.
interface StateWithAuth {
  auth: AuthState;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: GITHUB_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set('Accept', 'application/vnd.github+json');
    headers.set('X-GitHub-Api-Version', GITHUB_API_VERSION);
    const token = (getState() as StateWithAuth).auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

export const githubBaseQuery: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  const rateLimit = parseRateLimitHeaders(result.meta?.response?.headers);
  if (rateLimit) api.dispatch(rateLimitReceived(rateLimit));

  if (result.error) {
    return { error: toApiError(result.error, rateLimit?.resetAt ?? null) };
  }
  return { data: result.data };
};
