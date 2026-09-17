import { http, HttpResponse } from 'msw';
import { GITHUB_API_BASE_URL } from '@repo-radar/core';
import { githubApi } from './githubApi';
import { createAppStore } from '../store';
import { selectCoreRateLimit } from '../slices/rateLimitSlice';
import { setToken } from '../slices/authSlice';
import { makeRepoDto, rateLimitHeaders } from '../test/fixtures';
import { server } from '../test/setup';

const repoUrl = `${GITHUB_API_BASE_URL}/repos/facebook/react`;
const searchUrl = `${GITHUB_API_BASE_URL}/search/repositories`;

describe('githubApi', () => {
  it('fetches and maps a repo, recording rate-limit headers', async () => {
    server.use(
      http.get(repoUrl, () =>
        HttpResponse.json(makeRepoDto({ stargazers_count: 999 }), {
          headers: rateLimitHeaders(59),
        }),
      ),
    );
    const store = createAppStore({ persist: false, enableRefetchListeners: false });

    const result = await store.dispatch(githubApi.endpoints.getRepo.initiate('facebook/react'));

    expect(result.data?.stars).toBe(999);
    expect(result.data?.fullName).toBe('facebook/react');
    expect(selectCoreRateLimit(store.getState())).toEqual({
      resource: 'core',
      limit: 60,
      remaining: 59,
      resetAt: 1_800_000_000_000,
    });
  });

  it('sends the bearer token when one is set', async () => {
    let authHeader: string | null = null;
    server.use(
      http.get(repoUrl, ({ request }) => {
        authHeader = request.headers.get('authorization');
        return HttpResponse.json(makeRepoDto());
      }),
    );
    const store = createAppStore({ persist: false, enableRefetchListeners: false });
    store.dispatch(setToken('ghp_test'));

    await store.dispatch(githubApi.endpoints.getRepo.initiate('facebook/react'));

    expect(authHeader).toBe('Bearer ghp_test');
  });

  it('normalizes a 403 rate-limit response into a typed ApiError with resetAt', async () => {
    server.use(
      http.get(repoUrl, () =>
        HttpResponse.json(
          { message: 'API rate limit exceeded for 1.2.3.4' },
          { status: 403, headers: rateLimitHeaders(0, 1_900_000_000) },
        ),
      ),
    );
    const store = createAppStore({ persist: false, enableRefetchListeners: false });

    const result = await store.dispatch(githubApi.endpoints.getRepo.initiate('facebook/react'));

    expect(result.error).toMatchObject({
      kind: 'rate-limit',
      status: 403,
      resetAt: 1_900_000_000_000,
    });
  });

  it('maps search results and forwards paging params', async () => {
    let url: URL | null = null;
    server.use(
      http.get(searchUrl, ({ request }) => {
        url = new URL(request.url);
        return HttpResponse.json({
          total_count: 1,
          incomplete_results: false,
          items: [makeRepoDto()],
        });
      }),
    );
    const store = createAppStore({ persist: false, enableRefetchListeners: false });

    const result = await store.dispatch(
      githubApi.endpoints.searchRepositories.initiate({ query: 'react', page: 2, perPage: 10 }),
    );

    expect(result.data?.totalCount).toBe(1);
    expect(result.data?.items[0]?.name).toBe('react');
    expect(url!.searchParams.get('q')).toBe('react');
    expect(url!.searchParams.get('page')).toBe('2');
    expect(url!.searchParams.get('per_page')).toBe('10');
  });
});
