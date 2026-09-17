import { useState } from 'react';
import { Button, CircularProgress, Snackbar, Tooltip } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import {
  refreshAllTrackedRepos,
  selectIsCoreRateLimited,
  selectTrackedCount,
  useAppDispatch,
  useAppSelector,
} from '@repo-radar/store';

export function RefreshAllButton() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(selectTrackedCount);
  const isRateLimited = useAppSelector(selectIsCoreRateLimited);
  const [isRunning, setIsRunning] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleClick = async () => {
    setIsRunning(true);
    try {
      const { refreshed, skipped } = await dispatch(refreshAllTrackedRepos()).unwrap();
      setMessage(
        skipped > 0
          ? `Refreshed ${refreshed}, skipped ${skipped} (rate limit reached).`
          : `Refreshed ${refreshed} ${refreshed === 1 ? 'repository' : 'repositories'}.`,
      );
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <Tooltip
        title={isRateLimited ? 'GitHub API rate limit reached' : 'Refresh all tracked repos'}
      >
        <span>
          <Button
            variant="contained"
            onClick={handleClick}
            disabled={isRunning || isRateLimited || count === 0}
            startIcon={
              isRunning ? <CircularProgress size={16} color="inherit" /> : <RefreshRoundedIcon />
            }
          >
            {isRunning ? 'Refreshing…' : 'Refresh all'}
          </Button>
        </span>
      </Tooltip>
      <Snackbar
        open={message !== null}
        autoHideDuration={4000}
        onClose={() => setMessage(null)}
        message={message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </>
  );
}
