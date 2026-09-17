import { useEffect, useState } from 'react';
import { Chip, Tooltip, useMediaQuery, type Theme } from '@mui/material';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import { formatCountdown, type RateLimitInfo } from '@repo-radar/core';

interface RateLimitIndicatorProps {
  info: RateLimitInfo | null;
  isAuthenticated?: boolean;
}

function useNow(enabled: boolean, intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!enabled) return;
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, intervalMs]);
  return now;
}

export function RateLimitIndicator({ info, isAuthenticated = false }: RateLimitIndicatorProps) {
  const exhausted = info !== null && info.remaining === 0;
  const now = useNow(exhausted);
  const compact = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

  if (!info) {
    return (
      <Tooltip title="GitHub API budget appears after the first request">
        <Chip
          size="small"
          variant="outlined"
          icon={<SpeedRoundedIcon />}
          label={compact ? '—' : 'API —'}
        />
      </Tooltip>
    );
  }

  const ratio = info.remaining / info.limit;
  const color = exhausted ? 'error' : ratio < 0.2 ? 'warning' : 'default';
  const prefix = info.resource === 'search' ? 'Search' : 'API';
  const budget = `${info.remaining}/${info.limit}`;
  const label = exhausted
    ? `${compact ? '' : 'Resets in '}${formatCountdown(info.resetAt, now)}`
    : compact
      ? budget
      : `${prefix} ${budget}`;
  const window = info.resource === 'search' ? 'minute' : 'hour';
  const tooltip = isAuthenticated
    ? `Authenticated GitHub ${prefix.toLowerCase()} requests remaining this ${window}`
    : `Unauthenticated GitHub ${prefix.toLowerCase()} requests remaining this ${window}. Add a token in Settings for higher limits.`;

  return (
    <Tooltip title={tooltip}>
      <Chip
        size="small"
        variant="outlined"
        color={color}
        icon={<SpeedRoundedIcon />}
        label={label}
        aria-live="polite"
      />
    </Tooltip>
  );
}
