import { Grid2 as Grid } from '@mui/material';
import type { ReactNode } from 'react';

interface RepoGridProps {
  children: ReactNode;
}

export function RepoGrid({ children }: RepoGridProps) {
  return (
    <Grid container spacing={2}>
      {children}
    </Grid>
  );
}

export function RepoGridItem({ children }: RepoGridProps) {
  return (
    <Grid size={{ xs: 12, sm: 6, lg: 4 }} sx={{ display: 'flex' }}>
      {children}
    </Grid>
  );
}
