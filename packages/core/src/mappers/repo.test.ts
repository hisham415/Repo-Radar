import type { GitHubRepoDto } from '../types/github';
import { toRepo, toRepoSearchResult, toTrackedRepo } from './repo';

const dto: GitHubRepoDto = {
  id: 10270250,
  name: 'react',
  full_name: 'facebook/react',
  description: 'The library for web and native user interfaces.',
  html_url: 'https://github.com/facebook/react',
  stargazers_count: 230000,
  open_issues_count: 900,
  forks_count: 47000,
  language: 'JavaScript',
  pushed_at: '2026-01-09T10:00:00Z',
  updated_at: '2026-01-09T11:00:00Z',
  owner: {
    login: 'facebook',
    avatar_url: 'https://avatars.githubusercontent.com/u/69631',
    html_url: 'https://github.com/facebook',
  },
};

describe('toRepo', () => {
  it('maps a GitHub DTO to the domain model', () => {
    expect(toRepo(dto)).toEqual({
      id: 10270250,
      name: 'react',
      fullName: 'facebook/react',
      description: 'The library for web and native user interfaces.',
      url: 'https://github.com/facebook/react',
      language: 'JavaScript',
      stars: 230000,
      openIssues: 900,
      forks: 47000,
      lastCommitAt: '2026-01-09T10:00:00Z',
      owner: {
        login: 'facebook',
        avatarUrl: 'https://avatars.githubusercontent.com/u/69631',
        url: 'https://github.com/facebook',
      },
    });
  });
});

describe('toRepoSearchResult', () => {
  it('maps the search envelope and items', () => {
    const result = toRepoSearchResult({ total_count: 1, incomplete_results: false, items: [dto] });
    expect(result.totalCount).toBe(1);
    expect(result.incompleteResults).toBe(false);
    expect(result.items[0]?.fullName).toBe('facebook/react');
  });
});

describe('toTrackedRepo', () => {
  it('keeps only the identity fields needed for persistence', () => {
    expect(toTrackedRepo(toRepo(dto), '2026-01-10T00:00:00Z')).toEqual({
      id: 10270250,
      fullName: 'facebook/react',
      name: 'react',
      ownerLogin: 'facebook',
      url: 'https://github.com/facebook/react',
      trackedAt: '2026-01-10T00:00:00Z',
    });
  });
});
