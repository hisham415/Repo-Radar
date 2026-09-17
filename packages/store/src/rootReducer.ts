import { combineReducers } from '@reduxjs/toolkit';
import { githubApi } from './api/githubApi';
import { authSlice } from './slices/authSlice';
import { rateLimitSlice } from './slices/rateLimitSlice';
import { settingsSlice } from './slices/settingsSlice';
import { trackedReposSlice } from './slices/trackedReposSlice';

export const rootReducer = combineReducers({
  [githubApi.reducerPath]: githubApi.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
  [rateLimitSlice.reducerPath]: rateLimitSlice.reducer,
  [settingsSlice.reducerPath]: settingsSlice.reducer,
  [trackedReposSlice.reducerPath]: trackedReposSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
