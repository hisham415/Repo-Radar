import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import BookmarksRoundedIcon from '@mui/icons-material/BookmarksRounded';
import { useLocation, useNavigate } from 'react-router-dom';
import { selectTrackedCount, useAppSelector } from '@repo-radar/store';
import { BottomNavBar, type BottomNavItem } from '@repo-radar/ui';
import { routes } from '../app/routes';

type Route = (typeof routes)[keyof typeof routes];

export function MobileNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const trackedCount = useAppSelector(selectTrackedCount);
  const current: Route = pathname.startsWith(routes.tracked) ? routes.tracked : routes.search;

  const items: BottomNavItem<Route>[] = [
    { value: routes.search, label: 'Search', icon: <SearchRoundedIcon /> },
    {
      value: routes.tracked,
      label: 'Tracked',
      icon: <BookmarksRoundedIcon />,
      badgeContent: trackedCount || undefined,
    },
  ];

  return <BottomNavBar items={items} value={current} onChange={(next) => navigate(next)} />;
}
