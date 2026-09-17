import { createEntityAdapter, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { toTrackedRepo, type Repo, type RepoId, type TrackedRepo } from '@repo-radar/core';

export const trackedReposAdapter = createEntityAdapter<TrackedRepo>({
  sortComparer: (a, b) => b.trackedAt.localeCompare(a.trackedAt),
});

const initialState = trackedReposAdapter.getInitialState();
export type TrackedReposState = typeof initialState;

export const trackedReposSlice = createSlice({
  name: 'trackedRepos',
  initialState,
  reducers: {
    repoTracked(state, action: PayloadAction<Repo>) {
      if (state.entities[action.payload.id]) return;
      trackedReposAdapter.addOne(state, toTrackedRepo(action.payload));
    },
    repoUntracked(state, action: PayloadAction<RepoId>) {
      trackedReposAdapter.removeOne(state, action.payload);
    },
    allReposUntracked(state) {
      trackedReposAdapter.removeAll(state);
    },
  },
});

export const { repoTracked, repoUntracked, allReposUntracked } = trackedReposSlice.actions;
