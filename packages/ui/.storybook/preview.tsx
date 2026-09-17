import type { Preview } from '@storybook/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createAppTheme } from '../src/theme/createAppTheme';

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Color mode',
      toolbar: { icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  initialGlobals: { theme: 'light' },
  decorators: [
    (Story, { globals }) => (
      <ThemeProvider theme={createAppTheme(globals.theme === 'dark' ? 'dark' : 'light')}>
        <CssBaseline />
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: { matchers: { color: /(background|color)$/i, date: /Date$/i } },
  },
};

export default preview;
