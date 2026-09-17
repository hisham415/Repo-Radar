import type { GitHubRepoDto, GitHubSearchResponseDto } from '../types/github';
import type { Repo, RepoSearchResult, TrackedRepo } from '../types/domain';

export function toRepo(dto: GitHubRepoDto): Repo {
  return {
    id: dto.id,
    name: dto.name,
    fullName: dto.full_name,
    description: dto.description,
    url: dto.html_url,
    language: dto.language,
    stars: dto.stargazers_count,
    openIssues: dto.open_issues_count,
    forks: dto.forks_count,
    lastCommitAt: dto.pushed_at,
    owner: {
      login: dto.owner.login,
      avatarUrl: dto.owner.avatar_url,
      url: dto.owner.html_url,
    },
  };
}

export function toRepoSearchResult(dto: GitHubSearchResponseDto): RepoSearchResult {
  return {
    totalCount: dto.total_count,
    incompleteResults: dto.incomplete_results,
    items: dto.items.map(toRepo),
  };
}

export function toTrackedRepo(repo: Repo, trackedAt = new Date().toISOString()): TrackedRepo {
  return {
    id: repo.id,
    fullName: repo.fullName,
    name: repo.name,
    ownerLogin: repo.owner.login,
    url: repo.url,
    trackedAt,
  };
}
