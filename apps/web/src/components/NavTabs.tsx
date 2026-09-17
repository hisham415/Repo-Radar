import { Badge, Tab, Tabs } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { selectTrackedCount, useAppSelector } from '@repo-radar/store';
import { routes } from '../app/routes';

export function NavTabs() {
  const { pathname } = useLocation();
  const trackedCount = useAppSelector(selectTrackedCount);
  const current = pathname.startsWith(routes.tracked) ? routes.tracked : routes.search;

  return (
    <Tabs value={current} aria-label="Main navigation" textColor="inherit">
      <Tab label="Search" value={routes.search} to={routes.search} component={Link} />
      <Tab
        value={routes.tracked}
        to={routes.tracked}
        component={Link}
        label={
          <Badge
            badgeContent={trackedCount}
            color="primary"
            max={99}
            sx={{ pr: trackedCount ? 2 : 0 }}
          >
            Tracked
          </Badge>
        }
      />
    </Tabs>
  );
}
