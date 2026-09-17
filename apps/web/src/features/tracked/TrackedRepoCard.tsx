import type { TrackedRepo } from '@repo-radar/core';
import { repoUntracked, useAppDispatch, useGetRepoQuery } from '@repo-radar/store';
import { RepoCard } from '@repo-radar/ui';
import { toUserMessage } from '../../lib/toUserMessage';

interface TrackedRepoCardProps {
  tracked: TrackedRepo;
}

export function TrackedRepoCard({ tracked }: TrackedRepoCardProps) {
  const dispatch = useAppDispatch();
  const { data, error, isLoading, isFetching, isError, refetch } = useGetRepoQuery(
    tracked.fullName,
  );

  return (
    <RepoCard
      identity={tracked}
      repo={data}
      isTracked
      isLoading={isLoading}
      isRefreshing={isFetching && !isLoading}
      errorMessage={isError ? toUserMessage(error) : null}
      onToggleTrack={() => dispatch(repoUntracked(tracked.id))}
      onRefresh={refetch}
      onRetry={refetch}
    />
  );
}
