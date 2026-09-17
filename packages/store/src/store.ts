import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import type { StorageAdapter } from '@repo-radar/core';
import { githubApi } from './api/githubApi';
import { createPersistenceMiddleware } from './persistence/persistenceMiddleware';
import { loadPersistedState } from './persistence/storage';
import type { PersistedState } from './persistence/types';
import { rootReducer, type RootState } from './rootReducer';

export interface CreateStoreOptions {
  preloadedState?: PersistedState;
  storage?: StorageAdapter;
  persist?: boolean;
  enableRefetchListeners?: boolean;
}

export function createAppStore({
  preloadedState,
  storage,
  persist = true,
  enableRefetchListeners = true,
}: CreateStoreOptions = {}) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState ?? (persist ? loadPersistedState(storage) : undefined),
    middleware: (getDefault) => {
      const middleware = getDefault().concat(githubApi.middleware);
      return persist ? middleware.prepend(createPersistenceMiddleware(storage)) : middleware;
    },
  });

  if (enableRefetchListeners) setupListeners(store.dispatch);
  return store;
}

export type AppStore = ReturnType<typeof createAppStore>;
export type AppDispatch = AppStore['dispatch'];
export type { RootState };
