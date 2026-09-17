import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { createAppStore, type AppStore } from '@repo-radar/store';
import type { GitHubRepoDto } from '@repo-radar/core';
import { AppProviders } from '../app/AppProviders';

export function renderApp(
  ui: ReactElement,
  { route = '/', store }: { route?: string; store?: AppStore } = {},
) {
  const appStore = store ?? createAppStore({ enableRefetchListeners: false });
  return {
    store: appStore,
    ...render(
      <AppProviders store={appStore}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AppProviders>,
    ),
  };
}

export function makeRepoDto(overrides: Partial<GitHubRepoDto> = {}): GitHubRepoDto {
  return {
    id: 1,
    name: 'react',
    full_name: 'facebook/react',
    description: 'UI library',
    html_url: 'https://github.com/facebook/react',
    stargazers_count: 1000,
    open_issues_count: 5,
    forks_count: 10,
    language: 'JavaScript',
    pushed_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    owner: {
      login: 'facebook',
      avatar_url: 'https://avatars.githubusercontent.com/u/1',
      html_url: 'https://github.com/facebook',
    },
    ...overrides,
  };
}
