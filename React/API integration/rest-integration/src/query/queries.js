/**
 * TanStack Query v5 patterns — the ones you actually need.
 *
 * Queries (reads), mutations (writes), optimistic updates with rollback,
 * infinite lists, dependent queries, and prefetching.
 */

import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  useSuspenseQuery,
  keepPreviousData,
} from '@tanstack/react-query';

import { users, posts } from '../api/endpoints.js';
import { keys, queryClient } from './queryClient.js';

/* ------------------------------------------------------------------ *
 * Reads
 * ------------------------------------------------------------------ */

/**
 * Note `signal` — Query hands you an AbortSignal and cancels the request
 * automatically when the component unmounts or the key changes. Forwarding
 * it is free and fixes race conditions.
 */
export function useUsers(filters = {}) {
  return useQuery({
    queryKey: keys.users.list(filters),
    queryFn: ({ signal }) => users.list({ ...filters, signal }),

    // Keeps the previous page on screen while the next one loads, instead of
    // flashing a spinner. This is `placeholderData` in v5 (was keepPreviousData).
    placeholderData: keepPreviousData,

    // `select` runs on cached data without refetching — good for derived views.
    select: (page) => ({ ...page, items: page.items.filter((u) => u.role !== 'banned') }),
  });
}

export function useUser(id) {
  const client = useQueryClient();

  return useQuery({
    queryKey: keys.users.detail(id),
    queryFn: ({ signal }) => users.byId(id, { signal }),

    // Only run once we have an id (see "dependent queries" below).
    enabled: Boolean(id),

    /**
     * Seed the detail view from the list cache so it renders instantly,
     * then let the background refetch fill in any fields the list omitted.
     */
    initialData: () => {
      const lists = client.getQueriesData({ queryKey: keys.users.lists() });
      for (const [, page] of lists) {
        const hit = page?.items?.find((u) => u.id === id);
        if (hit) return hit;
      }
      return undefined;
    },
    // Treat seeded data as slightly stale so it does refresh.
    initialDataUpdatedAt: () => Date.now() - 20_000,
  });
}

/** DEPENDENT QUERIES: the second only runs once the first has an answer. */
export function useUserPosts(userId) {
  const { data: user } = useUser(userId);

  return useQuery({
    queryKey: keys.posts.byAuthor(user?.id),
    queryFn: ({ signal }) => posts.list({ authorId: user.id, signal }),
    enabled: Boolean(user?.id),
  });
}

/** Suspense variant: no isLoading branch — the boundary handles it. */
export function useUserSuspense(id) {
  return useSuspenseQuery({
    queryKey: keys.users.detail(id),
    queryFn: ({ signal }) => users.byId(id, { signal }),
  });
}

/* ------------------------------------------------------------------ *
 * Infinite list
 * ------------------------------------------------------------------ */

export function useUserFeed() {
  return useInfiniteQuery({
    queryKey: keys.users.feed(),
    queryFn: ({ pageParam, signal }) => users.feed({ cursor: pageParam, signal }),

    // v5 requires this explicitly — v4 defaulted it to undefined.
    initialPageParam: null,

    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.previousCursor ?? undefined,

    // Flatten the pages so consumers see one list.
    select: (data) => ({
      ...data,
      items: data.pages.flatMap((page) => page.items),
    }),
  });
}

/* ------------------------------------------------------------------ *
 * Writes
 * ------------------------------------------------------------------ */

/** Simple mutation: write, then invalidate what it affected. */
export function useCreateUser() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (newUser) => users.create(newUser),

    onSuccess: (created) => {
      // Drop the list cache so it refetches with the new row.
      client.invalidateQueries({ queryKey: keys.users.lists() });

      // And seed the detail cache, so navigating to it is instant.
      client.setQueryData(keys.users.detail(created.id), created);
    },
  });
}

/**
 * OPTIMISTIC UPDATE with rollback — the pattern worth memorising.
 *
 *   onMutate   apply the change immediately, return a snapshot
 *   onError    put the snapshot back
 *   onSettled  refetch, so the server has the final say
 */
export function useUpdateUser() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: ({ id, changes }) => users.update(id, changes),

    onMutate: async ({ id, changes }) => {
      // Stop in-flight refetches from clobbering the optimistic value.
      await client.cancelQueries({ queryKey: keys.users.detail(id) });
      await client.cancelQueries({ queryKey: keys.users.lists() });

      // Snapshot for rollback.
      const previousUser = client.getQueryData(keys.users.detail(id));
      const previousLists = client.getQueriesData({ queryKey: keys.users.lists() });

      // Apply optimistically.
      client.setQueryData(keys.users.detail(id), (old) => ({ ...old, ...changes }));

      client.setQueriesData({ queryKey: keys.users.lists() }, (old) => {
        if (!old?.items) return old;
        return { ...old, items: old.items.map((u) => (u.id === id ? { ...u, ...changes } : u)) };
      });

      return { previousUser, previousLists };
    },

    onError: (error, { id }, context) => {
      // Undo everything.
      if (context?.previousUser) client.setQueryData(keys.users.detail(id), context.previousUser);
      context?.previousLists?.forEach(([key, data]) => client.setQueryData(key, data));
    },

    onSettled: (data, error, { id }) => {
      // Success or failure, resync with the server.
      client.invalidateQueries({ queryKey: keys.users.detail(id) });
      client.invalidateQueries({ queryKey: keys.users.lists() });
    },
  });
}

/** Optimistic DELETE — remove from every list immediately. */
export function useDeleteUser() {
  const client = useQueryClient();

  return useMutation({
    mutationFn: (id) => users.remove(id),

    onMutate: async (id) => {
      await client.cancelQueries({ queryKey: keys.users.all });

      const previousLists = client.getQueriesData({ queryKey: keys.users.lists() });

      client.setQueriesData({ queryKey: keys.users.lists() }, (old) => {
        if (!old?.items) return old;
        return { ...old, items: old.items.filter((u) => u.id !== id), total: old.total - 1 };
      });

      return { previousLists };
    },

    onError: (error, id, context) => {
      context?.previousLists?.forEach(([key, data]) => client.setQueryData(key, data));
    },

    onSettled: () => client.invalidateQueries({ queryKey: keys.users.lists() }),
  });
}

/* ------------------------------------------------------------------ *
 * Prefetching
 * ------------------------------------------------------------------ */

/** Warm the cache on hover, so the click feels instant. */
export function prefetchUser(id) {
  return queryClient.prefetchQuery({
    queryKey: keys.users.detail(id),
    queryFn: ({ signal }) => users.byId(id, { signal }),
    staleTime: 60_000, // don't prefetch again if it's already fresh
  });
}

/** Prefetch a route's data before navigating (pair with a router loader). */
export async function prefetchUsersRoute(filters = {}) {
  await queryClient.prefetchQuery({
    queryKey: keys.users.list(filters),
    queryFn: ({ signal }) => users.list({ ...filters, signal }),
  });
}
