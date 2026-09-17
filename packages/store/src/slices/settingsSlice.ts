import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ThemeMode } from '@repo-radar/core';

export interface SettingsState {
  themeMode: ThemeMode;
}

const initialState: SettingsState = { themeMode: 'light' };

export const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.themeMode = action.payload;
    },
    toggleThemeMode(state) {
      state.themeMode = state.themeMode === 'light' ? 'dark' : 'light';
    },
  },
  selectors: {
    selectThemeMode: (state) => state.themeMode,
  },
});

export const { setThemeMode, toggleThemeMode } = settingsSlice.actions;
export const { selectThemeMode } = settingsSlice.selectors;
