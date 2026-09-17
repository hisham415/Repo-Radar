import type { GitHubRepoDto, Repo } from '@repo-radar/core';
import { toRepo } from '@repo-radar/core';
import type { StorageAdapter } from '@repo-radar/core';

export function createMemoryStorage(): StorageAdapter & { store: Map<string, string> } {
  const store = new Map<string, string>();
  return {
    store,
    getItem: (key) => store.get(key) ?? null,
    setItem: (key, value) => void store.set(key, value),
    removeItem: (key) => void store.delete(key),
  };
}

export function makeRepoDto(overrides: Partial<GitHubRepoDto> = {}): GitHubRepoDto {
  return {
    id: 1,
    name: 'react',
    full_name: 'facebook/react',
    description: 'UI library',
    html_url: 'https://github.com/facebook/react',
    stargazers_count: 100,
    open_issues_count: 5,
    forks_count: 10,
    language: 'JavaScript',
    pushed_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    owner: {
      login: 'facebook',
      avatar_url: 'https://avatars.githubusercontent.com/u/1',
      html_url: 'https://github.com/facebook',
    },
    ...overrides,
  };
}

export function makeRepo(overrides: Partial<GitHubRepoDto> = {}): Repo {
  return toRepo(makeRepoDto(overrides));
}

export const rateLimitHeaders = (remaining: number, resetSec = 1_800_000_000) => ({
  'x-ratelimit-limit': '60',
  'x-ratelimit-remaining': String(remaining),
  'x-ratelimit-reset': String(resetSec),
});
