import { createAsyncThunk } from '@reduxjs/toolkit';
import { REFRESH_ALL_STAGGER_MS } from '@repo-radar/core';
import { githubApi } from '../api/githubApi';
import type { RootState } from '../rootReducer';
import { selectTrackedFullNames } from '../selectors';
import { selectIsCoreRateLimited } from '../slices/rateLimitSlice';

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export interface RefreshAllResult {
  refreshed: number;
  skipped: number;
}

// Sequential + staggered so a large tracked list doesn't burst the GitHub rate limit;
// stops early once the limit is exhausted so remaining repos keep their cached data.
export const refreshAllTrackedRepos = createAsyncThunk<
  RefreshAllResult,
  void,
  { state: RootState }
>('trackedRepos/refreshAll', async (_, { dispatch, getState }) => {
  const fullNames = selectTrackedFullNames(getState());
  let refreshed = 0;

  for (const [index, fullName] of fullNames.entries()) {
    if (selectIsCoreRateLimited(getState())) {
      return { refreshed, skipped: fullNames.length - refreshed };
    }
    if (index > 0) await wait(REFRESH_ALL_STAGGER_MS);
    await dispatch(githubApi.endpoints.getRepo.initiate(fullName, { forceRefetch: true }));
    refreshed += 1;
  }

  return { refreshed, skipped: 0 };
});
