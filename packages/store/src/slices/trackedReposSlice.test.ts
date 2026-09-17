import { makeRepo } from '../test/fixtures';
import {
  allReposUntracked,
  repoTracked,
  repoUntracked,
  trackedReposAdapter,
  trackedReposSlice,
} from './trackedReposSlice';

const { selectAll, selectTotal } = trackedReposAdapter.getSelectors();

describe('trackedReposSlice', () => {
  const reduce = trackedReposSlice.reducer;

  it('tracks a repo, keeping only persisted identity fields', () => {
    const state = reduce(undefined, repoTracked(makeRepo({ id: 7, full_name: 'a/b', name: 'b' })));
    const [tracked] = selectAll(state);
    expect(tracked).toMatchObject({ id: 7, fullName: 'a/b', name: 'b', ownerLogin: 'facebook' });
    expect(tracked).not.toHaveProperty('stars');
  });

  it('ignores duplicate tracks', () => {
    let state = reduce(undefined, repoTracked(makeRepo({ id: 1 })));
    state = reduce(state, repoTracked(makeRepo({ id: 1 })));
    expect(selectTotal(state)).toBe(1);
  });

  it('untracks by id', () => {
    let state = reduce(undefined, repoTracked(makeRepo({ id: 1 })));
    state = reduce(state, repoTracked(makeRepo({ id: 2, full_name: 'x/y' })));
    state = reduce(state, repoUntracked(1));
    expect(selectAll(state).map((r) => r.id)).toEqual([2]);
  });

  it('clears everything', () => {
    let state = reduce(undefined, repoTracked(makeRepo({ id: 1 })));
    state = reduce(state, allReposUntracked());
    expect(selectTotal(state)).toBe(0);
  });
});
