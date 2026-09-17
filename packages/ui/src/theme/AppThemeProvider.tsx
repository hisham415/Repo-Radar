import { useMemo, type ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { ThemeMode } from '@repo-radar/core';
import { createAppTheme } from './createAppTheme';

interface AppThemeProviderProps {
  mode: ThemeMode;
  children: ReactNode;
}

export function AppThemeProvider({ mode, children }: AppThemeProviderProps) {
  const theme = useMemo(() => createAppTheme(mode), [mode]);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
