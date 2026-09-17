import { authSlice, clearToken, selectIsAuthenticated, selectToken, setToken } from './authSlice';

describe('authSlice', () => {
  const reduce = authSlice.reducer;

  it('stores a trimmed token', () => {
    const state = reduce(undefined, setToken('  ghp_abc  '));
    expect(state.token).toBe('ghp_abc');
  });

  it('treats an empty token as null', () => {
    const state = reduce({ token: 'x' }, setToken('   '));
    expect(state.token).toBeNull();
  });

  it('clears the token', () => {
    expect(reduce({ token: 'x' }, clearToken()).token).toBeNull();
  });

  it('exposes selectors', () => {
    const root = { auth: { token: 'x' } };
    expect(selectToken(root)).toBe('x');
    expect(selectIsAuthenticated(root)).toBe(true);
    expect(selectIsAuthenticated({ auth: { token: null } })).toBe(false);
  });
});
