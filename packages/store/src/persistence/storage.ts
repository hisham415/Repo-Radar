import {
  isTrackedRepoList,
  isThemeMode,
  isNullableString,
  loadFromStorage,
  saveToStorage,
  STORAGE_KEYS,
  STORAGE_SCHEMA_VERSION,
  type StorageAdapter,
  type ThemeMode,
  type TrackedRepo,
} from '@repo-radar/core';
import { trackedReposAdapter } from '../slices/trackedReposSlice';
import type { PersistedState } from './types';

export function loadPersistedState(adapter?: StorageAdapter): PersistedState {
  const tracked = loadFromStorage<TrackedRepo[]>(
    STORAGE_KEYS.trackedRepos,
    STORAGE_SCHEMA_VERSION,
    isTrackedRepoList,
    adapter,
  );
  const token = loadFromStorage<string | null>(
    STORAGE_KEYS.auth,
    STORAGE_SCHEMA_VERSION,
    isNullableString,
    adapter,
  );
  const themeMode = loadFromStorage<ThemeMode>(
    STORAGE_KEYS.settings,
    STORAGE_SCHEMA_VERSION,
    isThemeMode,
    adapter,
  );

  const state: PersistedState = {};
  if (tracked)
    state.trackedRepos = trackedReposAdapter.setAll(trackedReposAdapter.getInitialState(), tracked);
  if (token !== null) state.auth = { token };
  if (themeMode) state.settings = { themeMode };
  return state;
}

export const persistTrackedRepos = (repos: TrackedRepo[], adapter?: StorageAdapter) =>
  saveToStorage(STORAGE_KEYS.trackedRepos, STORAGE_SCHEMA_VERSION, repos, adapter);

export const persistToken = (token: string | null, adapter?: StorageAdapter) =>
  saveToStorage(STORAGE_KEYS.auth, STORAGE_SCHEMA_VERSION, token, adapter);

export const persistThemeMode = (mode: ThemeMode, adapter?: StorageAdapter) =>
  saveToStorage(STORAGE_KEYS.settings, STORAGE_SCHEMA_VERSION, mode, adapter);
