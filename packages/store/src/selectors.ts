import { createSelector } from '@reduxjs/toolkit';
import type { RepoId } from '@repo-radar/core';
import type { RootState } from './rootReducer';
import { trackedReposAdapter } from './slices/trackedReposSlice';

const trackedSelectors = trackedReposAdapter.getSelectors((state: RootState) => state.trackedRepos);

export const selectTrackedRepos = trackedSelectors.selectAll;
export const selectTrackedRepoIds = trackedSelectors.selectIds;
export const selectTrackedCount = trackedSelectors.selectTotal;

export const selectIsTracked = (id: RepoId) => (state: RootState) =>
  trackedSelectors.selectById(state, id) !== undefined;

export const selectTrackedFullNames = createSelector([selectTrackedRepos], (repos) =>
  repos.map((repo) => repo.fullName),
);
