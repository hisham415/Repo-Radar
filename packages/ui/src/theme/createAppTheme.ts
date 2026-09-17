import { createTheme, type Theme } from '@mui/material/styles';
import type { ThemeMode } from '@repo-radar/core';

export function createAppTheme(mode: ThemeMode): Theme {
  return createTheme({
    palette: {
      mode,
      primary: { main: mode === 'light' ? '#1f6feb' : '#58a6ff' },
      secondary: { main: '#8957e5' },
      background:
        mode === 'light'
          ? { default: '#f6f8fa', paper: '#ffffff' }
          : { default: '#0d1117', paper: '#161b22' },
    },
    shape: { borderRadius: 10 },
    typography: {
      fontFamily: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'].join(
        ',',
      ),
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiCard: { defaultProps: { variant: 'outlined' } },
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiChip: { styleOverrides: { root: { fontWeight: 500 } } },
    },
  });
}
