import { http, HttpResponse } from 'msw';
import { GITHUB_API_BASE_URL } from '@repo-radar/core';
import { githubApi } from '../api/githubApi';
import { repoTracked } from '../slices/trackedReposSlice';
import { rateLimitReceived } from '../slices/rateLimitSlice';
import { createAppStore } from '../store';
import { makeRepo, makeRepoDto, rateLimitHeaders } from '../test/fixtures';
import { server } from '../test/setup';
import { refreshAllTrackedRepos } from './refreshAllTrackedRepos';

describe('refreshAllTrackedRepos', () => {
  it('refetches every tracked repo', async () => {
    const hits: string[] = [];
    server.use(
      http.get(`${GITHUB_API_BASE_URL}/repos/:owner/:name`, ({ params }) => {
        const fullName = `${params.owner}/${params.name}`;
        hits.push(fullName);
        return HttpResponse.json(makeRepoDto({ full_name: fullName, stargazers_count: 42 }), {
          headers: rateLimitHeaders(50),
        });
      }),
    );
    const store = createAppStore({ persist: false, enableRefetchListeners: false });
    store.dispatch(repoTracked(makeRepo({ id: 1, full_name: 'a/b' })));
    store.dispatch(repoTracked(makeRepo({ id: 2, full_name: 'c/d' })));

    const result = await store.dispatch(refreshAllTrackedRepos()).unwrap();

    expect(result).toEqual({ refreshed: 2, skipped: 0 });
    expect(hits.sort()).toEqual(['a/b', 'c/d']);
    const cached = githubApi.endpoints.getRepo.select('a/b')(store.getState());
    expect(cached.data?.stars).toBe(42);
  });

  it('stops early when the rate limit is exhausted', async () => {
    const store = createAppStore({ persist: false, enableRefetchListeners: false });
    store.dispatch(repoTracked(makeRepo({ id: 1, full_name: 'a/b' })));
    store.dispatch(
      rateLimitReceived({
        resource: 'core',
        limit: 60,
        remaining: 0,
        resetAt: Date.now() + 60_000,
      }),
    );

    const result = await store.dispatch(refreshAllTrackedRepos()).unwrap();

    expect(result).toEqual({ refreshed: 0, skipped: 1 });
  });
});
