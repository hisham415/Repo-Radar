import { useCallback } from 'react';
import type { Repo } from '@repo-radar/core';
import {
  repoTracked,
  repoUntracked,
  selectIsTracked,
  useAppDispatch,
  useAppSelector,
} from '@repo-radar/store';

export function useTrackToggle(repo: Repo) {
  const dispatch = useAppDispatch();
  const isTracked = useAppSelector(selectIsTracked(repo.id));

  const toggle = useCallback(() => {
    dispatch(isTracked ? repoUntracked(repo.id) : repoTracked(repo));
  }, [dispatch, isTracked, repo]);

  return { isTracked, toggle };
}
