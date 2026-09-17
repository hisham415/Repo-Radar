import type { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { selectThemeMode, useAppSelector, type AppStore } from '@repo-radar/store';
import { AppThemeProvider } from '@repo-radar/ui';
import { store as defaultStore } from './store';
import { ErrorBoundary } from '../components/ErrorBoundary';

interface AppProvidersProps {
  children: ReactNode;
  store?: AppStore;
}

function ThemedApp({ children }: { children: ReactNode }) {
  const mode = useAppSelector(selectThemeMode);
  return <AppThemeProvider mode={mode}>{children}</AppThemeProvider>;
}

export function AppProviders({ children, store = defaultStore }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <ThemedApp>
        <ErrorBoundary>{children}</ErrorBoundary>
      </ThemedApp>
    </Provider>
  );
}
