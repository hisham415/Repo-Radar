export const GITHUB_API_BASE_URL = 'https://api.github.com';
export const GITHUB_API_VERSION = '2022-11-28';

export const SEARCH_DEBOUNCE_MS = 400;
export const SEARCH_PER_PAGE = 12;
export const SEARCH_MIN_QUERY_LENGTH = 2;
// GitHub's search API never returns results beyond the first 1000 matches.
export const GITHUB_SEARCH_MAX_RESULTS = 1000;

export const REFRESH_ALL_STAGGER_MS = 150;

export const STORAGE_KEYS = {
  trackedRepos: 'repo-radar:tracked-repos',
  auth: 'repo-radar:auth',
  settings: 'repo-radar:settings',
} as const;

export const STORAGE_SCHEMA_VERSION = 1;
