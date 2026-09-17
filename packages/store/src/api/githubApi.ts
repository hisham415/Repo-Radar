import { createApi } from '@reduxjs/toolkit/query/react';
import {
  SEARCH_PER_PAGE,
  toRepo,
  toRepoSearchResult,
  type GitHubRepoDto,
  type GitHubSearchResponseDto,
  type Repo,
  type RepoSearchResult,
} from '@repo-radar/core';
import { githubBaseQuery } from './baseQuery';

export interface SearchRepositoriesArgs {
  query: string;
  page?: number;
  perPage?: number;
}

export const githubApi = createApi({
  reducerPath: 'githubApi',
  baseQuery: githubBaseQuery,
  tagTypes: ['Repo'],
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    searchRepositories: builder.query<RepoSearchResult, SearchRepositoriesArgs>({
      query: ({ query, page = 1, perPage = SEARCH_PER_PAGE }) => ({
        url: '/search/repositories',
        params: { q: query, page, per_page: perPage, sort: 'stars', order: 'desc' },
      }),
      transformResponse: (dto: GitHubSearchResponseDto) => toRepoSearchResult(dto),
    }),
    getRepo: builder.query<Repo, string>({
      query: (fullName) => `/repos/${fullName}`,
      transformResponse: (dto: GitHubRepoDto) => toRepo(dto),
      providesTags: (_result, _error, fullName) => [{ type: 'Repo', id: fullName }],
    }),
  }),
});

export const {
  useSearchRepositoriesQuery,
  useLazySearchRepositoriesQuery,
  useGetRepoQuery,
  useLazyGetRepoQuery,
} = githubApi;
