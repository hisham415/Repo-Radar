import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { GITHUB_API_BASE_URL, SEARCH_PER_PAGE, STORAGE_KEYS } from '@repo-radar/core';
import { App } from '../App';
import { server } from '../test/setup';
import { makeRepoDto, renderApp } from '../test/utils';

const SEARCH = `${GITHUB_API_BASE_URL}/search/repositories`;
const REPO = `${GITHUB_API_BASE_URL}/repos/:owner/:name`;

const reactDto = makeRepoDto();
const vueDto = makeRepoDto({
  id: 2,
  name: 'vue',
  full_name: 'vuejs/vue',
  stargazers_count: 500,
  owner: { login: 'vuejs', avatar_url: '', html_url: 'https://github.com/vuejs' },
});

function mockSearch(items = [reactDto, vueDto]) {
  const calls: string[] = [];
  server.use(
    http.get(SEARCH, ({ request }) => {
      calls.push(new URL(request.url).searchParams.get('q') ?? '');
      return HttpResponse.json({ total_count: items.length, incomplete_results: false, items });
    }),
  );
  return calls;
}

describe('Repo Radar', () => {
  it('debounces search so only the final query hits the API', async () => {
    const calls = mockSearch();
    const user = userEvent.setup();
    renderApp(<App />);

    await user.type(
      await screen.findByRole('searchbox', { name: /search repositories/i }),
      'react',
    );

    await screen.findByRole('link', { name: 'react' });
    expect(calls).toEqual(['react']);
  });

  it('paginates with numbered pages, syncs the page to the URL, and keeps results visible while switching', async () => {
    const requestedPages: string[] = [];
    server.use(
      http.get(SEARCH, ({ request }) => {
        const url = new URL(request.url);
        requestedPages.push(url.searchParams.get('page') ?? '1');
        const page = Number(url.searchParams.get('page') ?? '1');
        const items = Array.from({ length: SEARCH_PER_PAGE }, (_, i) =>
          makeRepoDto({
            id: page * 1000 + i,
            name: `repo-p${page}-${i}`,
            full_name: `org/repo-p${page}-${i}`,
          }),
        );
        return HttpResponse.json({ total_count: 50, incomplete_results: false, items });
      }),
    );
    const user = userEvent.setup();
    renderApp(<App />, { route: '/?q=react' });

    await screen.findByRole('link', { name: 'repo-p1-0' });
    expect(screen.getByText(/showing 1–12 of 50/i)).toBeInTheDocument();

    const pagination = screen.getByRole('navigation', { name: /pagination/i });
    expect(within(pagination).getAllByRole('button', { name: /go to page/i })).toHaveLength(4);

    await user.click(within(pagination).getByRole('button', { name: 'Go to page 2' }));

    await screen.findByRole('link', { name: 'repo-p2-0' });
    expect(screen.getByText(/showing 13–24 of 50/i)).toBeInTheDocument();
    expect(requestedPages).toEqual(['1', '2']);
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it('restores query and page from the URL on load', async () => {
    let requested: URL | null = null;
    server.use(
      http.get(SEARCH, ({ request }) => {
        requested = new URL(request.url);
        return HttpResponse.json({
          total_count: 100,
          incomplete_results: false,
          items: [reactDto],
        });
      }),
    );
    renderApp(<App />, { route: '/?q=redux&page=3' });

    await screen.findByRole('link', { name: 'react' });
    expect(requested!.searchParams.get('q')).toBe('redux');
    expect(requested!.searchParams.get('page')).toBe('3');
    expect(screen.getByRole('searchbox')).toHaveValue('redux');
    expect(screen.getByRole('button', { name: 'page 3' })).toHaveAttribute('aria-current', 'page');
  });

  it('tracks a repo from search, shows it on the tracked page with live stats and a chart, and persists it', async () => {
    mockSearch();
    server.use(
      http.get(REPO, ({ params }) =>
        HttpResponse.json(
          makeRepoDto({ full_name: `${params.owner}/${params.name}`, stargazers_count: 4242 }),
        ),
      ),
    );
    const user = userEvent.setup();
    const { store } = renderApp(<App />);

    await user.type(
      await screen.findByRole('searchbox', { name: /search repositories/i }),
      'react',
    );
    await user.click(await screen.findByRole('button', { name: 'Track facebook/react' }));

    expect(screen.getByRole('button', { name: 'Untrack facebook/react' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await user.click(screen.getByRole('tab', { name: /tracked/i }));
    await screen.findByRole('heading', { name: /tracked repositories/i });

    const card = screen.getByRole('article', { name: 'facebook/react' });
    await waitFor(() => expect(within(card).getByText('4.2K')).toBeInTheDocument());
    expect(screen.getByText(/stars per repository/i)).toBeInTheDocument();

    const persisted = JSON.parse(window.localStorage.getItem(STORAGE_KEYS.trackedRepos)!);
    expect(persisted.data).toHaveLength(1);
    expect(persisted.data[0].fullName).toBe('facebook/react');
    expect(store.getState().trackedRepos.ids).toEqual([1]);
  });

  it('shows an isolated error on one tracked repo while others load fine', async () => {
    server.use(
      http.get(REPO, ({ params }) => {
        if (params.name === 'vue') {
          return HttpResponse.json({ message: 'Not Found' }, { status: 404 });
        }
        return HttpResponse.json(makeRepoDto({ full_name: `${params.owner}/${params.name}` }));
      }),
    );
    window.localStorage.setItem(
      STORAGE_KEYS.trackedRepos,
      JSON.stringify({
        version: 1,
        data: [
          {
            id: 1,
            fullName: 'facebook/react',
            name: 'react',
            ownerLogin: 'facebook',
            url: 'x',
            trackedAt: 'b',
          },
          {
            id: 2,
            fullName: 'vuejs/vue',
            name: 'vue',
            ownerLogin: 'vuejs',
            url: 'y',
            trackedAt: 'a',
          },
        ],
      }),
    );

    renderApp(<App />, { route: '/tracked' });

    const reactCard = await screen.findByRole('article', { name: 'facebook/react' });
    const vueCard = await screen.findByRole('article', { name: 'vuejs/vue' });

    await waitFor(() => expect(within(reactCard).getByText('1K')).toBeInTheDocument());
    await waitFor(() =>
      expect(within(vueCard).getByRole('alert')).toHaveTextContent(/repository not found/i),
    );
    expect(within(reactCard).queryByRole('alert')).not.toBeInTheDocument();
  });

  it('refreshes a single repo on demand', async () => {
    let stars = 100;
    server.use(http.get(REPO, () => HttpResponse.json(makeRepoDto({ stargazers_count: stars }))));
    window.localStorage.setItem(
      STORAGE_KEYS.trackedRepos,
      JSON.stringify({
        version: 1,
        data: [
          {
            id: 1,
            fullName: 'facebook/react',
            name: 'react',
            ownerLogin: 'facebook',
            url: 'x',
            trackedAt: 'a',
          },
        ],
      }),
    );
    const user = userEvent.setup();
    renderApp(<App />, { route: '/tracked' });

    const card = await screen.findByRole('article', { name: 'facebook/react' });
    await waitFor(() => expect(within(card).getByText('100')).toBeInTheDocument());

    stars = 250;
    await user.click(within(card).getByRole('button', { name: 'Refresh facebook/react' }));

    await waitFor(() => expect(within(card).getByText('250')).toBeInTheDocument());
  });

  it('surfaces a rate-limit error with guidance', async () => {
    server.use(
      http.get(SEARCH, () =>
        HttpResponse.json(
          { message: 'API rate limit exceeded' },
          {
            status: 403,
            headers: {
              'x-ratelimit-limit': '10',
              'x-ratelimit-remaining': '0',
              'x-ratelimit-reset': String(Math.floor(Date.now() / 1000) + 60),
              'x-ratelimit-resource': 'search',
            },
          },
        ),
      ),
    );
    const user = userEvent.setup();
    renderApp(<App />);

    await user.type(
      await screen.findByRole('searchbox', { name: /search repositories/i }),
      'react',
    );

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/rate limit reached/i);
    expect(within(alert).getByRole('button', { name: 'Retry' })).toBeDisabled();
  });
});
