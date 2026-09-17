import {
  selectCoreRateLimit,
  selectIsAuthenticated,
  selectSearchRateLimit,
  useAppSelector,
} from '@repo-radar/store';
import { RateLimitIndicator } from '@repo-radar/ui';

// Core (60/h) is the budget that matters for tracked repos; fall back to search until it's known.
export function RateLimitBadge() {
  const core = useAppSelector(selectCoreRateLimit);
  const search = useAppSelector(selectSearchRateLimit);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  return <RateLimitIndicator info={core ?? search} isAuthenticated={isAuthenticated} />;
}
