import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SEARCH_DEBOUNCE_MS } from '@repo-radar/core';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

// Query and page live in the URL so refresh, back/forward and sharing all preserve the view.
export function useSearchState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);

  const [input, setInput] = useState(query);
  const debounced = useDebouncedValue(input.trim(), SEARCH_DEBOUNCE_MS);

  useEffect(() => {
    if (debounced === query) return;
    setSearchParams(debounced ? { q: debounced } : {}, { replace: true });
  }, [debounced, query, setSearchParams]);

  const setPage = useCallback(
    (next: number) => {
      setSearchParams(next > 1 ? { q: query, page: String(next) } : { q: query });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [query, setSearchParams],
  );

  return { input, setInput, query, page, setPage, isTyping: input.trim() !== query };
}
