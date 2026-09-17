import { AppBar, Box, Container, Stack, Toolbar, Typography } from '@mui/material';
import RadarRoundedIcon from '@mui/icons-material/RadarRounded';
import type { ReactNode } from 'react';

export const BOTTOM_NAV_HEIGHT = 64;

// Keeps the h1 in the accessibility tree on very narrow screens where there's no room to show it.
const srOnly = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
} as const;

interface AppShellProps {
  title?: string;
  nav?: ReactNode;
  bottomNav?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
}

// Header tabs on md+; on smaller screens navigation moves to a fixed bottom bar.
export function AppShell({
  title = 'Repo Radar',
  nav,
  bottomNav,
  actions,
  children,
}: AppShellProps) {
  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ gap: { xs: 1, sm: 2 }, minHeight: { xs: 56, sm: 64 } }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mr: { xs: 0, md: 2 } }}>
            <RadarRoundedIcon color="primary" />
            <Typography
              variant="h6"
              component="h1"
              noWrap
              sx={{ '@media (max-width: 359px)': srOnly }}
            >
              {title}
            </Typography>
          </Stack>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }}>{nav}</Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' } }} />
          <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1 }}>
            {actions}
          </Stack>
        </Toolbar>
      </AppBar>
      <Container
        component="main"
        maxWidth="lg"
        sx={{
          flexGrow: 1,
          py: { xs: 2, sm: 3 },
          px: { xs: 2, sm: 3 },
          pb: bottomNav
            ? { xs: `calc(${BOTTOM_NAV_HEIGHT}px + 16px + env(safe-area-inset-bottom))`, md: 3 }
            : undefined,
        }}
      >
        {children}
      </Container>
      {bottomNav && <Box sx={{ display: { xs: 'block', md: 'none' } }}>{bottomNav}</Box>}
    </Box>
  );
}
