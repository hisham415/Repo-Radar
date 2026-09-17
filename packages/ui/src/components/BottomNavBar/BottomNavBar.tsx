import { Badge, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import type { ReactElement } from 'react';
import { BOTTOM_NAV_HEIGHT } from '../AppShell/AppShell';

export interface BottomNavItem<V extends string = string> {
  value: V;
  label: string;
  icon: ReactElement;
  badgeContent?: number;
}

interface BottomNavBarProps<V extends string> {
  items: BottomNavItem<V>[];
  value: V;
  onChange: (value: V) => void;
}

export function BottomNavBar<V extends string>({ items, value, onChange }: BottomNavBarProps<V>) {
  return (
    <Paper
      component="nav"
      aria-label="Main navigation"
      elevation={0}
      square
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        borderTop: 1,
        borderColor: 'divider',
        pb: 'env(safe-area-inset-bottom)',
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, next: V) => onChange(next)}
        sx={{ height: BOTTOM_NAV_HEIGHT, bgcolor: 'background.paper' }}
      >
        {items.map((item) => (
          <BottomNavigationAction
            key={item.value}
            value={item.value}
            label={item.label}
            icon={
              <Badge badgeContent={item.badgeContent} color="primary" max={99}>
                {item.icon}
              </Badge>
            }
            sx={{ '& .MuiBottomNavigationAction-label': { fontWeight: 500 } }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
