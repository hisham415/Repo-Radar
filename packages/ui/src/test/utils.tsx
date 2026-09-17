import type { Repo } from '@repo-radar/core';
import { ThemeProvider } from '@mui/material';
import { render, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';
import { createAppTheme } from '../theme/createAppTheme';

export const sampleRepo: Repo = {
  id: 1,
  name: 'react',
  fullName: 'facebook/react',
  description: 'The library for web and native user interfaces.',
  url: 'https://github.com/facebook/react',
  language: 'JavaScript',
  stars: 230_000,
  openIssues: 912,
  forks: 47_000,
  lastCommitAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  owner: {
    login: 'facebook',
    avatarUrl: 'https://avatars.githubusercontent.com/u/69631',
    url: 'https://github.com/facebook',
  },
};

export const sampleIdentity = {
  fullName: sampleRepo.fullName,
  name: sampleRepo.name,
  ownerLogin: sampleRepo.owner.login,
  url: sampleRepo.url,
};

const theme = createAppTheme('light');

// `wrapper` (rather than wrapping the element) keeps the provider in place across `rerender`.
export function renderWithTheme(ui: ReactElement, options?: RenderOptions) {
  return render(ui, {
    wrapper: ({ children }: { children: ReactNode }) => (
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    ),
    ...options,
  });
}
