import { STORAGE_KEYS } from '@repo-radar/core';
import { setToken } from '../slices/authSlice';
import { toggleThemeMode } from '../slices/settingsSlice';
import { repoTracked, repoUntracked } from '../slices/trackedReposSlice';
import { selectTrackedRepos } from '../selectors';
import { createAppStore } from '../store';
import { createMemoryStorage, makeRepo } from '../test/fixtures';

describe('persistence', () => {
  it('writes tracked repos, token and theme to storage on change', () => {
    const storage = createMemoryStorage();
    const store = createAppStore({ storage, enableRefetchListeners: false });

    store.dispatch(repoTracked(makeRepo({ id: 1 })));
    store.dispatch(setToken('tok'));
    store.dispatch(toggleThemeMode());

    expect(JSON.parse(storage.store.get(STORAGE_KEYS.trackedRepos)!).data).toHaveLength(1);
    expect(JSON.parse(storage.store.get(STORAGE_KEYS.auth)!).data).toBe('tok');
    expect(JSON.parse(storage.store.get(STORAGE_KEYS.settings)!).data).toBe('dark');
  });

  it('rehydrates a fresh store from the same storage', () => {
    const storage = createMemoryStorage();
    const first = createAppStore({ storage, enableRefetchListeners: false });
    first.dispatch(repoTracked(makeRepo({ id: 1, full_name: 'a/b' })));
    first.dispatch(repoTracked(makeRepo({ id: 2, full_name: 'c/d' })));
    first.dispatch(repoUntracked(1));
    first.dispatch(setToken('tok'));
    first.dispatch(toggleThemeMode());

    const second = createAppStore({ storage, enableRefetchListeners: false });
    const state = second.getState();

    expect(selectTrackedRepos(state).map((r) => r.fullName)).toEqual(['c/d']);
    expect(state.auth.token).toBe('tok');
    expect(state.settings.themeMode).toBe('dark');
  });

  it('ignores corrupt persisted data and starts clean', () => {
    const storage = createMemoryStorage();
    storage.setItem(STORAGE_KEYS.trackedRepos, JSON.stringify({ version: 1, data: [{ bad: 1 }] }));

    const store = createAppStore({ storage, enableRefetchListeners: false });

    expect(selectTrackedRepos(store.getState())).toEqual([]);
    expect(storage.store.has(STORAGE_KEYS.trackedRepos)).toBe(false);
  });
});
