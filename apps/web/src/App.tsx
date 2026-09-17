import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LinearProgress } from '@mui/material';
import { AppShell } from '@repo-radar/ui';
import { routes } from './app/routes';
import { MobileNav } from './components/MobileNav';
import { NavTabs } from './components/NavTabs';
import { RateLimitBadge } from './features/rate-limit/RateLimitBadge';
import { TokenSettings } from './features/settings/TokenSettings';
import { ThemeModeToggle } from './features/theme/ThemeModeToggle';

const SearchPage = lazy(() => import('./features/search/SearchPage'));
const TrackedPage = lazy(() => import('./features/tracked/TrackedPage'));

export function App() {
  return (
    <AppShell
      nav={<NavTabs />}
      bottomNav={<MobileNav />}
      actions={
        <>
          <RateLimitBadge />
          <TokenSettings />
          <ThemeModeToggle />
        </>
      }
    >
      <Suspense fallback={<LinearProgress aria-label="Loading page" />}>
        <Routes>
          <Route path={routes.search} element={<SearchPage />} />
          <Route path={routes.tracked} element={<TrackedPage />} />
          <Route path="*" element={<Navigate to={routes.search} replace />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
}
