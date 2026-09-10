/**
 * TanStack Query v5 setup.
 *
 * This is what you should actually use in production. It replaces the whole
 * useEffect-fetch dance with a cache that handles deduplication, background
 * refetching, retries, pagination and optimistic updates.
 *
 * The mental model that makes it click:
 *   SERVER STATE is not application state. It is a CACHE of something you
 *   do not own, which can go stale at any moment without telling you.
 *   useState/Redux are for state you own. Query is for state you borrow.
 */

import { QueryClient } from '@tanstack/react-query';
import { HttpError, AbortError } from '../api/errors.js';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * staleTime: how long data is considered FRESH. While fresh, remounting
       * a component does NOT refetch. Default 0 means "always stale", which
       * is why people think Query "fetches constantly" — it does not, it
       * serves from cache and revalidates.
       *
       * Pick per data type: a user profile can be 5 minutes, a stock price 0.
       */
      staleTime: 30_000,

      /**
       * gcTime (was cacheTime in v4): how long UNUSED data stays in memory
       * after the last component observing it unmounts. This is what makes
       * going "back" render instantly.
       */
      gcTime: 5 * 60_000,

      /** Do not retry errors that will fail identically. */
      retry: (failureCount, error) => {
        if (error instanceof AbortError) return false;
        if (error instanceof HttpError && !error.isRetryable) return false;
        return failureCount < 2;
      },

      retryDelay: (attempt, error) =>
        error?.retryAfterMs ?? Math.min(1000 * 2 ** attempt, 30_000),

      /**
       * Refetch when the user comes back to the tab. Great for dashboards,
       * annoying for a form the user is halfway through — override per query.
       */
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,

      // Remounting a component should use the cache, not refire.
      refetchOnMount: true,
    },

    mutations: {
      retry: false, // never blind-retry a non-idempotent write
      onError: (error) => {
        console.error('[mutation]', error);
      },
    },
  },
});

/**
 * Query keys, centralised.
 *
 * Keys are the cache's identity AND its invalidation surface, so building
 * them ad-hoc across the codebase is how caches go wrong. This factory gives
 * you a hierarchy where invalidating a prefix invalidates everything under it:
 *
 *   invalidateQueries({ queryKey: keys.users.all })    -> every user query
 *   invalidateQueries({ queryKey: keys.users.lists() })-> only the lists
 *   invalidateQueries({ queryKey: keys.users.detail(7) }) -> just user 7
 */
export const keys = {
  users: {
    all: ['users'],
    lists: () => [...keys.users.all, 'list'],
    list: (filters) => [...keys.users.lists(), filters],
    details: () => [...keys.users.all, 'detail'],
    detail: (id) => [...keys.users.details(), id],
    feed: () => [...keys.users.all, 'feed'],
  },
  posts: {
    all: ['posts'],
    lists: () => [...keys.posts.all, 'list'],
    list: (filters) => [...keys.posts.lists(), filters],
    detail: (id) => [...keys.posts.all, 'detail', id],
    byAuthor: (authorId) => [...keys.posts.all, 'author', authorId],
  },
};

/**
 * Persist the cache to localStorage so a reload renders instantly.
 * Requires @tanstack/query-sync-storage-persister + @tanstack/react-query-persist-client.
 *
 *   import { persistQueryClient } from '@tanstack/react-query-persist-client';
 *   import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
 *
 *   persistQueryClient({
 *     queryClient,
 *     persister: createSyncStoragePersister({ storage: window.localStorage }),
 *     maxAge: 24 * 60 * 60 * 1000,
 *     dehydrateOptions: {
 *       // never persist anything user-specific or sensitive
 *       shouldDehydrateQuery: (q) => q.queryKey[0] !== 'auth',
 *     },
 *   });
 */
