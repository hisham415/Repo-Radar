import { Box, Stack, Typography } from '@mui/material';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import {
  GITHUB_SEARCH_MAX_RESULTS,
  SEARCH_MIN_QUERY_LENGTH,
  SEARCH_PER_PAGE,
} from '@repo-radar/core';
import {
  selectIsSearchRateLimited,
  useAppSelector,
  useSearchRepositoriesQuery,
} from '@repo-radar/store';
import {
  EmptyState,
  ErrorBanner,
  RepoGrid,
  RepoGridItem,
  RepoPagination,
  SearchBar,
} from '@repo-radar/ui';
import { toUserMessage } from '../../lib/toUserMessage';
import { SearchResultCard, SearchResultCardSkeleton } from './SearchResultCard';
import { useSearchState } from './useSearchState';

export default function SearchPage() {
  const { input, setInput, query, page, setPage, isTyping } = useSearchState();
  const isSearchRateLimited = useAppSelector(selectIsSearchRateLimited);

  const skip = query.length < SEARCH_MIN_QUERY_LENGTH;
  // `data` keeps the previous page on screen while the next one loads; `currentData` is page-accurate.
  const { data, currentData, error, isLoading, isFetching, isError, refetch } =
    useSearchRepositoriesQuery({ query, page }, { skip });

  const items = data?.items ?? [];
  const total = Math.min(data?.totalCount ?? 0, GITHUB_SEARCH_MAX_RESULTS);
  const pageCount = Math.ceil(total / SEARCH_PER_PAGE);
  const from = (page - 1) * SEARCH_PER_PAGE + 1;
  const to = Math.min(page * SEARCH_PER_PAGE, total);
  const showSkeleton = isLoading && !data;
  const isSwitchingPage = isFetching && !currentData;

  return (
    <Stack spacing={{ xs: 2, sm: 3 }}>
      <Box>
        <Typography variant="h5" gutterBottom>
          Search repositories
        </Typography>
        <SearchBar value={input} onChange={setInput} isLoading={isFetching || isTyping} autoFocus />
      </Box>

      {skip && (
        <EmptyState
          icon={<TravelExploreRoundedIcon fontSize="inherit" />}
          title="Find repositories to track"
          description={`Type at least ${SEARCH_MIN_QUERY_LENGTH} characters to search GitHub.`}
        />
      )}

      {!skip && isError && items.length === 0 && (
        <ErrorBanner
          title="Search failed"
          message={toUserMessage(error)}
          onRetry={refetch}
          retryDisabled={isSearchRateLimited}
        />
      )}

      {!skip && !isLoading && !isError && data && items.length === 0 && (
        <EmptyState
          icon={<SearchOffRoundedIcon fontSize="inherit" />}
          title="No repositories found"
          description={`Nothing matched “${query}”. Try a different query.`}
        />
      )}

      {!skip && (showSkeleton || items.length > 0) && (
        <Stack spacing={2}>
          {data && (
            <Typography variant="body2" color="text.secondary" aria-live="polite">
              {data.totalCount.toLocaleString()} results
              {data.totalCount > GITHUB_SEARCH_MAX_RESULTS &&
                ` · showing the top ${GITHUB_SEARCH_MAX_RESULTS.toLocaleString()}`}
            </Typography>
          )}
          <Box
            aria-busy={isSwitchingPage}
            sx={{
              opacity: isSwitchingPage ? 0.55 : 1,
              pointerEvents: isSwitchingPage ? 'none' : 'auto',
              transition: 'opacity 150ms',
            }}
          >
            <RepoGrid>
              {showSkeleton
                ? Array.from({ length: SEARCH_PER_PAGE / 2 }, (_, i) => (
                    <RepoGridItem key={`skeleton-${i}`}>
                      <SearchResultCardSkeleton />
                    </RepoGridItem>
                  ))
                : items.map((repo) => (
                    <RepoGridItem key={repo.id}>
                      <SearchResultCard repo={repo} />
                    </RepoGridItem>
                  ))}
            </RepoGrid>
          </Box>
          {isError && items.length > 0 && (
            <ErrorBanner
              message={toUserMessage(error)}
              onRetry={refetch}
              retryDisabled={isSearchRateLimited}
            />
          )}
          {data && (
            <RepoPagination
              page={page}
              pageCount={pageCount}
              from={from}
              to={to}
              total={total}
              disabled={isFetching || isSearchRateLimited}
              onChange={setPage}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
}
