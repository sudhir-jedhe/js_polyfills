/**
 * Pagination and infinite scroll.
 *
 * Two server strategies, and they are not interchangeable:
 *
 *   OFFSET  ?page=2&page_size=20
 *           Simple, jump to any page, shows a total count.
 *           Breaks under writes: if a row is inserted while you page, an
 *           item shifts across the boundary and you see it twice (or miss
 *           it). Also gets slow at high offsets — the DB still scans them.
 *
 *   CURSOR  ?cursor=eyJpZCI6MTIzfQ&limit=20
 *           Stable under concurrent writes, and fast at any depth.
 *           No page numbers and usually no total. Correct for feeds.
 *
 * Rule of thumb: admin tables -> offset. Infinite feeds -> cursor.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import { useApi } from './useApi.js';

/* ------------------------------------------------------------------ *
 * Offset pagination
 * ------------------------------------------------------------------ */

export function usePagination(fetchPage, { pageSize = 20, initialPage = 1 } = {}) {
  const [page, setPage] = useState(initialPage);

  const { data, error, isLoading, isFetching, refetch } = useApi(
    ({ signal }) => fetchPage({ page, pageSize, signal }),
    [page, pageSize]
  );

  const totalPages = data ? Math.ceil(data.total / pageSize) : 0;

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    page,
    pageSize,
    totalPages,
    isLoading,
    isFetching,
    error,

    hasPrevious: page > 1,
    hasNext: page < totalPages,

    next: useCallback(() => setPage((p) => p + 1), []),
    previous: useCallback(() => setPage((p) => Math.max(1, p - 1)), []),
    goTo: useCallback((n) => setPage(Math.max(1, n)), []),
    refetch,
  };
}

/* ------------------------------------------------------------------ *
 * Cursor pagination / infinite list
 * ------------------------------------------------------------------ */

export function useInfiniteList(fetchPage, { limit = 20 } = {}) {
  const [pages, setPages] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Guards against a double-fire from a fast scroll or StrictMode double-mount.
  const loadingRef = useRef(false);

  /**
   * Why these live in refs and not just in the dependency array.
   *
   * `fetchPage` is an ARGUMENT to this hook, and callers write it inline:
   *
   *     useInfiniteList(({ cursor }) => users.feed({ cursor }))
   *
   * That is a new function on every render. Listing it as a dependency of
   * useCallback would hand back a new `loadMore` every render too — the
   * memoisation would be doing literally nothing, at the cost of looking
   * like it was.
   *
   * The same is true of `cursor` and `hasMore`: they change on every page
   * load, which is exactly when we do NOT want the callback identity to
   * churn, because it is handed to an IntersectionObserver effect.
   *
   * Refs hold the latest value without participating in dependencies, so
   * `loadMore` is genuinely stable for the life of the component.
   */
  const fetchPageRef = useRef(fetchPage);
  const cursorRef = useRef(cursor);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    fetchPageRef.current = fetchPage;
    cursorRef.current = cursor;
    hasMoreRef.current = hasMore;
  });

  const loadMore = useCallback(
    async (reset = false) => {
      if (loadingRef.current) return;
      if (!reset && !hasMoreRef.current) return;

      loadingRef.current = true;
      reset ? setIsLoading(true) : setIsLoadingMore(true);
      setError(null);

      try {
        const page = await fetchPageRef.current({
          cursor: reset ? null : cursorRef.current,
          limit,
        });

        setPages((prev) => (reset ? [page] : [...prev, page]));

        // Update the ref immediately as well as the state: two loadMore calls
        // can fire before React re-renders, and the second must see the new
        // cursor or it refetches the same page.
        cursorRef.current = page.nextCursor;
        hasMoreRef.current = Boolean(page.nextCursor) && page.items.length > 0;

        setCursor(page.nextCursor);
        setHasMore(hasMoreRef.current);
      } catch (err) {
        setError(err);
      } finally {
        loadingRef.current = false;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    // `limit` is a primitive from an options object and is stable in practice.
    [limit]
  );

  // Initial load. `loadMore` is now genuinely stable, so it can be listed as
  // a dependency honestly — no eslint-disable needed.
  useEffect(() => {
    loadMore(true);
  }, [loadMore]);

  // Flatten and de-duplicate: a cursor page can repeat an item across boundaries.
  const items = pages.flatMap((p) => p.items);
  const seen = new Set();
  const uniqueItems = items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });

  return {
    items: uniqueItems,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore: () => loadMore(false),
    reset: () => {
      setPages([]);
      setCursor(null);
      setHasMore(true);
      loadMore(true);
    },
  };
}

/**
 * A sentinel ref for infinite scroll.
 *
 * IntersectionObserver beats a scroll listener: no layout thrash, no
 * throttling logic, and it fires only when the sentinel is actually visible.
 * `rootMargin` loads the next page BEFORE the user reaches the bottom.
 */
export function useInfiniteScroll(onLoadMore, { enabled = true, rootMargin = '200px' } = {}) {
  const sentinelRef = useRef(null);
  const callbackRef = useRef(onLoadMore);

  useEffect(() => {
    callbackRef.current = onLoadMore;
  });

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !enabled) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) callbackRef.current();
      },
      { rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return sentinelRef;
}

/**
 * Search-as-you-type with debouncing.
 *
 * Two things matter here:
 *   - debounce, so you do not fire a request per keystroke
 *   - abort the previous request, so a slow early response cannot overwrite
 *     a fast later one (useApi already does this)
 */
export function useSearch(searchFn, { delay = 300, minLength = 2 } = {}) {
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(term), delay);
    return () => clearTimeout(timer);
  }, [term, delay]);

  const enabled = debounced.length >= minLength;

  const { data, error, isLoading, isFetching } = useApi(
    ({ signal }) => searchFn({ search: debounced, signal }),
    [debounced],
    { enabled }
  );

  return {
    term,
    setTerm,
    results: enabled ? data?.items ?? [] : [],
    // Show the spinner while the user is still typing, not just while fetching.
    isSearching: enabled && (isLoading || isFetching || term !== debounced),
    error,
  };
}
