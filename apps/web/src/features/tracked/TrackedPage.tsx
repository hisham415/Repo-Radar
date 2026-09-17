import { Box, Stack, Typography } from '@mui/material';
import BookmarkBorderRoundedIcon from '@mui/icons-material/BookmarkBorderRounded';
import { useNavigate } from 'react-router-dom';
import { selectTrackedRepos, useAppSelector } from '@repo-radar/store';
import { EmptyState, RepoGrid, RepoGridItem } from '@repo-radar/ui';
import { routes } from '../../app/routes';
import { RefreshAllButton } from './RefreshAllButton';
import { TrackedRepoCard } from './TrackedRepoCard';
import { TrackedStarsChart } from './TrackedStarsChart';

export default function TrackedPage() {
  const tracked = useAppSelector(selectTrackedRepos);
  const navigate = useNavigate();

  if (tracked.length === 0) {
    return (
      <EmptyState
        icon={<BookmarkBorderRoundedIcon fontSize="inherit" />}
        title="No tracked repositories yet"
        description="Search for repositories and track the ones you want to keep an eye on."
        actionLabel="Go to search"
        onAction={() => navigate(routes.search)}
      />
    );
  }

  return (
    <Stack spacing={{ xs: 2, sm: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={1}
      >
        <Box>
          <Typography variant="h5">Tracked repositories</Typography>
          <Typography variant="body2" color="text.secondary">
            {tracked.length} {tracked.length === 1 ? 'repository' : 'repositories'}
          </Typography>
        </Box>
        <RefreshAllButton />
      </Stack>

      <TrackedStarsChart tracked={tracked} />

      <RepoGrid>
        {tracked.map((repo) => (
          <RepoGridItem key={repo.id}>
            <TrackedRepoCard tracked={repo} />
          </RepoGridItem>
        ))}
      </RepoGrid>
    </Stack>
  );
}
