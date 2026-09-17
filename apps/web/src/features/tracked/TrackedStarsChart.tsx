import { useMemo } from 'react';
import type { TrackedRepo } from '@repo-radar/core';
import { githubApi, useAppSelector } from '@repo-radar/store';
import { StarsBarChart, type StarsBarDatum } from '@repo-radar/ui';

interface TrackedStarsChartProps {
  tracked: TrackedRepo[];
}

// Reads star counts straight from the RTK Query cache the cards already populate — no extra requests.
export function TrackedStarsChart({ tracked }: TrackedStarsChartProps) {
  const selectCachedRepos = useMemo(
    () => tracked.map((repo) => githubApi.endpoints.getRepo.select(repo.fullName)),
    [tracked],
  );

  const data = useAppSelector(
    (state): StarsBarDatum[] =>
      selectCachedRepos.flatMap((select, index) => {
        const cached = select(state).data;
        return cached ? [{ label: tracked[index]!.fullName, stars: cached.stars }] : [];
      }),
    { equalityFn: sameData },
  );

  return <StarsBarChart data={data} />;
}

function sameData(a: StarsBarDatum[], b: StarsBarDatum[]) {
  return (
    a.length === b.length && a.every((d, i) => d.label === b[i]!.label && d.stars === b[i]!.stars)
  );
}
