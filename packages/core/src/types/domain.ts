export type RepoId = number;

export interface RepoOwner {
  login: string;
  avatarUrl: string;
  url: string;
}

export interface RepoStats {
  stars: number;
  openIssues: number;
  forks: number;
  lastCommitAt: string;
}

export interface Repo extends RepoStats {
  id: RepoId;
  name: string;
  fullName: string;
  description: string | null;
  url: string;
  language: string | null;
  owner: RepoOwner;
}

export interface RepoSearchResult {
  totalCount: number;
  incompleteResults: boolean;
  items: Repo[];
}

export interface TrackedRepo {
  id: RepoId;
  fullName: string;
  name: string;
  ownerLogin: string;
  url: string;
  trackedAt: string;
}

export type RateLimitResource = 'core' | 'search';

export interface RateLimitInfo {
  resource: RateLimitResource;
  limit: number;
  remaining: number;
  resetAt: number;
}

export type ThemeMode = 'light' | 'dark';
