/**
 * A list screen, three ways — same feature, escalating machinery.
 *
 * Read these top to bottom to see what each layer buys you.
 */

import { useState } from 'react';

import { users } from '../api/endpoints.js';
import { useApi, useDebouncedValue } from '../hooks/useApi.js';
import { useQueryCache } from '../hooks/useQueryCache.js';
import { usePagination, useInfiniteScroll } from '../hooks/usePagination.js';
import { useUsers, useUserFeed, useDeleteUser, prefetchUser } from '../query/queries.js';
import { toUserMessage } from '../api/errors.js';

/* ------------------------------------------------------------------ *
 * 1. Plain hook — no cache. Fine for one screen.
 * ------------------------------------------------------------------ */

export function UserListBasic() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, error, errorMessage, isLoading, isFetching, refetch } = useApi(
    ({ signal }) => users.list({ search: debouncedSearch, signal }),
    [debouncedSearch]
  );

  // Order matters: error before empty, empty before content.
  if (isLoading) return <ListSkeleton />;

  if (error) {
    return (
      <div role="alert">
        <p>{errorMessage}</p>
        <button onClick={refetch}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users"
        aria-label="Search users"
      />

      {/* isFetching, not isLoading — a background refresh should not blank the list */}
      {isFetching && <span aria-live="polite">Updating…</span>}

      {data?.items.length === 0 ? (
        <EmptyState search={debouncedSearch} />
      ) : (
        <ul>
          {data?.items.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ *
 * 2. The hand-rolled cache — dedup + SWR, no dependency.
 * ------------------------------------------------------------------ */

export function UserListCached({ page = 1 }) {
  const { data, error, isLoading, isFetching, isStale, refetch } = useQueryCache(
    ['users', { page }],
    ({ signal }) => users.list({ page, signal }),
    { staleTime: 60_000 }
  );

  if (isLoading) return <ListSkeleton />;
  if (error && !data) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <>
      {/* Stale data is shown, not hidden — then quietly replaced. */}
      <ul aria-busy={isFetching}>
        {data?.items.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      {isStale && <small>Showing cached results…</small>}
    </>
  );
}

/* ------------------------------------------------------------------ *
 * 3. TanStack Query — what you ship.
 * ------------------------------------------------------------------ */

export function UserListQuery() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);

  const { data, error, isPending, isFetching, isPlaceholderData, refetch } = useUsers({
    page,
    search: debouncedSearch,
  });

  const deleteUser = useDeleteUser();

  // v5 renamed isLoading -> isPending for the "no data yet" state.
  if (isPending) return <ListSkeleton />;
  if (error) return <ErrorState error={error} onRetry={refetch} />;

  return (
    <>
      <input value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search" />

      <ul aria-busy={isFetching} style={{ opacity: isPlaceholderData ? 0.6 : 1 }}>
        {data.items.map((user) => (
          <li
            key={user.id}
            // Prefetch on hover: by the time they click, it is already cached.
            onMouseEnter={() => prefetchUser(user.id)}
          >
            {user.name}

            <button
              onClick={() => deleteUser.mutate(user.id)}
              disabled={deleteUser.isPending}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <nav>
        <button onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={() => setPage((p) => p + 1)}
          // isPlaceholderData means we're showing the old page; don't let them
          // race past the end.
          disabled={isPlaceholderData || page * data.pageSize >= data.total}
        >
          Next
        </button>
      </nav>

      {deleteUser.isError && <p role="alert">{toUserMessage(deleteUser.error)}</p>}
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Infinite scroll
 * ------------------------------------------------------------------ */

export function UserFeed() {
  // useUserFeed is a real useInfiniteQuery — a plain useQuery does NOT provide
  // fetchNextPage / hasNextPage / isFetchingNextPage.
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isPending } =
    useUserFeed();

  const sentinelRef = useInfiniteScroll(
    () => hasNextPage && !isFetchingNextPage && fetchNextPage(),
    { enabled: hasNextPage }
  );

  if (isPending) return <ListSkeleton />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <ul>
        {data.items.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      {/* The sentinel sits below the list; seeing it triggers the next page. */}
      <div ref={sentinelRef} aria-hidden="true" style={{ height: 1 }} />

      {isFetchingNextPage && <p>Loading more…</p>}
      {!hasNextPage && <p>That's everyone.</p>}
    </>
  );
}

/* ------------------------------------------------------------------ *
 * Shared UI states
 * ------------------------------------------------------------------ */

function ListSkeleton() {
  // A skeleton beats a spinner: it holds layout, so nothing jumps when data
  // arrives, and it communicates the SHAPE of what is coming.
  return (
    <ul aria-busy="true" aria-label="Loading users">
      {Array.from({ length: 5 }, (_, i) => (
        <li key={i} className="skeleton-row" />
      ))}
    </ul>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div role="alert">
      <p>{toUserMessage(error)}</p>
      {onRetry && <button onClick={onRetry}>Try again</button>}
    </div>
  );
}

function EmptyState({ search }) {
  return (
    <p>
      {search ? `No users match "${search}".` : 'No users yet.'}
    </p>
  );
}
