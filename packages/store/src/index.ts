export {
  githubApi,
  useSearchRepositoriesQuery,
  useGetRepoQuery,
  useLazyGetRepoQuery,
} from './api/githubApi';
export type { SearchRepositoriesArgs } from './api/githubApi';
export { isApiError, toApiError } from './api/apiError';
export type { ApiError, ApiErrorKind } from './api/apiError';

export { setToken, clearToken, selectToken, selectIsAuthenticated } from './slices/authSlice';
export type { AuthState } from './slices/authSlice';
export {
  selectCoreRateLimit,
  selectSearchRateLimit,
  selectIsCoreRateLimited,
  selectIsSearchRateLimited,
} from './slices/rateLimitSlice';
export { setThemeMode, toggleThemeMode, selectThemeMode } from './slices/settingsSlice';
export { repoTracked, repoUntracked, allReposUntracked } from './slices/trackedReposSlice';

export {
  selectTrackedRepos,
  selectTrackedRepoIds,
  selectTrackedCount,
  selectTrackedFullNames,
  selectIsTracked,
} from './selectors';

export { refreshAllTrackedRepos } from './thunks/refreshAllTrackedRepos';
export type { RefreshAllResult } from './thunks/refreshAllTrackedRepos';

export { createAppStore } from './store';
export type { AppStore, AppDispatch, RootState, CreateStoreOptions } from './store';
export type { PersistedState } from './persistence/types';
export { useAppDispatch, useAppSelector, useAppStore } from './hooks';
