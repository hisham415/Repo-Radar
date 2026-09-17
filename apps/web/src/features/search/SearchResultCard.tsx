import type { Repo } from '@repo-radar/core';
import { RepoCard } from '@repo-radar/ui';
import { useTrackToggle } from '../../hooks/useTrackToggle';

interface SearchResultCardProps {
  repo: Repo;
}

export function SearchResultCard({ repo }: SearchResultCardProps) {
  const { isTracked, toggle } = useTrackToggle(repo);
  return (
    <RepoCard
      identity={{
        fullName: repo.fullName,
        name: repo.name,
        ownerLogin: repo.owner.login,
        url: repo.url,
      }}
      repo={repo}
      isTracked={isTracked}
      onToggleTrack={toggle}
    />
  );
}

export function SearchResultCardSkeleton() {
  return (
    <RepoCard
      identity={{ fullName: '', name: '', ownerLogin: '', url: '#' }}
      isTracked={false}
      isLoading
      onToggleTrack={() => undefined}
    />
  );
}
