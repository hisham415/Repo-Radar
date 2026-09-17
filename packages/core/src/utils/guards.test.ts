import { isThemeMode, isTrackedRepo, isTrackedRepoList } from './guards';

const valid = {
  id: 1,
  fullName: 'a/b',
  name: 'b',
  ownerLogin: 'a',
  url: 'https://github.com/a/b',
  trackedAt: '2026-01-01T00:00:00Z',
};

describe('isTrackedRepo', () => {
  it('accepts a well-formed tracked repo', () => {
    expect(isTrackedRepo(valid)).toBe(true);
  });

  it('rejects missing or mistyped fields', () => {
    expect(isTrackedRepo({ ...valid, id: '1' })).toBe(false);
    expect(isTrackedRepo({ ...valid, url: undefined })).toBe(false);
    expect(isTrackedRepo(null)).toBe(false);
  });
});

describe('isTrackedRepoList', () => {
  it('validates every element', () => {
    expect(isTrackedRepoList([valid, valid])).toBe(true);
    expect(isTrackedRepoList([valid, {}])).toBe(false);
    expect(isTrackedRepoList('nope')).toBe(false);
  });
});

describe('isThemeMode', () => {
  it('accepts only light/dark', () => {
    expect(isThemeMode('light')).toBe(true);
    expect(isThemeMode('dark')).toBe(true);
    expect(isThemeMode('system')).toBe(false);
  });
});
