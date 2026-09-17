import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface AuthState {
  token: string | null;
}

const initialState: AuthState = { token: null };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      const trimmed = action.payload.trim();
      state.token = trimmed.length > 0 ? trimmed : null;
    },
    clearToken(state) {
      state.token = null;
    },
  },
  selectors: {
    selectToken: (state) => state.token,
    selectIsAuthenticated: (state) => state.token !== null,
  },
});

export const { setToken, clearToken } = authSlice.actions;
export const { selectToken, selectIsAuthenticated } = authSlice.selectors;
