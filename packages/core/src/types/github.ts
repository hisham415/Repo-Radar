export interface GitHubOwnerDto {
  login: string;
  avatar_url: string;
  html_url: string;
}

export interface GitHubRepoDto {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  open_issues_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
  updated_at: string;
  owner: GitHubOwnerDto;
}

export interface GitHubSearchResponseDto {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepoDto[];
}

export interface GitHubErrorDto {
  message: string;
  documentation_url?: string;
}
