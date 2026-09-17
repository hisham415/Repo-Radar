import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import type { StorageAdapter } from '@repo-radar/core';
import { clearToken, setToken } from '../slices/authSlice';
import { setThemeMode, toggleThemeMode } from '../slices/settingsSlice';
import {
  allReposUntracked,
  repoTracked,
  repoUntracked,
  trackedReposAdapter,
} from '../slices/trackedReposSlice';
import type { RootState } from '../rootReducer';
import { persistThemeMode, persistToken, persistTrackedRepos } from './storage';

const { selectAll: selectAllTracked } = trackedReposAdapter.getSelectors(
  (state: RootState) => state.trackedRepos,
);

export function createPersistenceMiddleware(adapter?: StorageAdapter) {
  const listener = createListenerMiddleware<RootState>();

  listener.startListening({
    matcher: isAnyOf(repoTracked, repoUntracked, allReposUntracked),
    effect: (_action, { getState }) => {
      persistTrackedRepos(selectAllTracked(getState()), adapter);
    },
  });

  listener.startListening({
    matcher: isAnyOf(setToken, clearToken),
    effect: (_action, { getState }) => {
      persistToken(getState().auth.token, adapter);
    },
  });

  listener.startListening({
    matcher: isAnyOf(setThemeMode, toggleThemeMode),
    effect: (_action, { getState }) => {
      persistThemeMode(getState().settings.themeMode, adapter);
    },
  });

  return listener.middleware;
}
