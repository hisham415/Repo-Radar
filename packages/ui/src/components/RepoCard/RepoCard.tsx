import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  Alert,
  Button,
  CircularProgress,
} from '@mui/material';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import BookmarkRemoveOutlinedIcon from '@mui/icons-material/BookmarkRemoveOutlined';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import type { Repo, TrackedRepo } from '@repo-radar/core';
import { RepoStatsRow } from '../RepoStatsRow/RepoStatsRow';

export interface RepoCardProps {
  identity: Pick<TrackedRepo, 'fullName' | 'name' | 'ownerLogin' | 'url'>;
  repo?: Repo;
  isTracked: boolean;
  isLoading?: boolean;
  isRefreshing?: boolean;
  errorMessage?: string | null;
  onToggleTrack: () => void;
  onRefresh?: () => void;
  onRetry?: () => void;
}

export function RepoCard({
  identity,
  repo,
  isTracked,
  isLoading = false,
  isRefreshing = false,
  errorMessage = null,
  onToggleTrack,
  onRefresh,
  onRetry,
}: RepoCardProps) {
  const showSkeleton = isLoading && !repo;

  return (
    <Card
      component="article"
      aria-busy={isLoading || isRefreshing}
      aria-label={identity.fullName}
      sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      <CardHeader
        sx={{ '& .MuiCardHeader-content': { minWidth: 0 } }}
        avatar={
          repo ? (
            <Avatar src={repo.owner.avatarUrl} alt={repo.owner.login} />
          ) : (
            <Skeleton variant="circular" width={40} height={40} />
          )
        }
        title={
          <Link
            href={identity.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="hover"
            color="inherit"
            fontWeight={600}
            noWrap
            display="block"
            title={identity.fullName}
          >
            {identity.name}
          </Link>
        }
        subheader={identity.ownerLogin}
        subheaderTypographyProps={{ noWrap: true }}
        action={
          <Stack direction="row" spacing={0.5}>
            {onRefresh && (
              <Tooltip title="Refresh stats">
                <span>
                  <IconButton
                    size="small"
                    aria-label={`Refresh ${identity.fullName}`}
                    onClick={onRefresh}
                    disabled={isRefreshing || isLoading}
                  >
                    {isRefreshing ? <CircularProgress size={18} /> : <RefreshRoundedIcon />}
                  </IconButton>
                </span>
              </Tooltip>
            )}
            <Tooltip title={isTracked ? 'Untrack' : 'Track'}>
              <IconButton
                size="small"
                color={isTracked ? 'primary' : 'default'}
                aria-pressed={isTracked}
                aria-label={`${isTracked ? 'Untrack' : 'Track'} ${identity.fullName}`}
                onClick={onToggleTrack}
              >
                {isTracked ? <BookmarkRemoveOutlinedIcon /> : <BookmarkAddOutlinedIcon />}
              </IconButton>
            </Tooltip>
          </Stack>
        }
      />
      <CardContent sx={{ flexGrow: 1, pt: 0 }}>
        {showSkeleton ? (
          <Stack spacing={1}>
            <Skeleton width="90%" />
            <Skeleton width="60%" />
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rounded" width={64} height={24} />
              <Skeleton variant="rounded" width={64} height={24} />
              <Skeleton variant="rounded" width={96} height={24} />
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={1.5}>
            {repo && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.5,
                  height: '3em',
                }}
              >
                {repo.description ?? 'No description provided.'}
              </Typography>
            )}
            {repo && <RepoStatsRow stats={repo} />}
            {errorMessage && (
              <Alert
                severity="error"
                variant="outlined"
                action={
                  onRetry && (
                    <Button color="inherit" size="small" onClick={onRetry}>
                      Retry
                    </Button>
                  )
                }
              >
                {errorMessage}
              </Alert>
            )}
          </Stack>
        )}
      </CardContent>
      <CardActions sx={{ pt: 0, px: 2, pb: 1.5, minHeight: 44 }}>
        {repo?.language && (
          <>
            <Box
              component="span"
              sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: 'secondary.main', mr: 1 }}
            />
            <Typography variant="caption" color="text.secondary">
              {repo.language}
            </Typography>
          </>
        )}
      </CardActions>
    </Card>
  );
}
