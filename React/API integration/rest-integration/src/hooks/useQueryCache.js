/**
 * A miniature TanStack Query: cache, request deduplication, and
 * stale-while-revalidate — in about 150 lines.
 *
 * Worth building once, because it makes clear what the real library does:
 *
 *   DEDUPLICATION  three components mount at once asking for /users;
 *                  ONE request goes out and all three get the result.
 *   CACHING        a second mount renders instantly from cache.
 *   SWR            cached data shows immediately, then a background refresh
 *                  swaps in fresh data — no spinner on repeat visits.
 *   INVALIDATION   after a mutation, mark keys stale so they refetch.
 *
 * In production use @tanstack/react-query. This is for understanding — and
 * for the interview question "how would you build one?".
 */

import { useSyncExternalStore, useCallback, useEffect, useRef } from "react";
import { AbortError } from "../api/errors.js";

/* ------------------------------------------------------------------ *
 * The store
 * ------------------------------------------------------------------ */

const cache = new Map(); // key -> { data, error, updatedAt, isFetching }
const inflight = new Map(); // key -> Promise   (this is the deduplication)
const listeners = new Map(); // key -> Set<fn>

const serialiseKey = (key) =>
  typeof key === "string" ? key : JSON.stringify(key);

function notify(key) {
  listeners.get(key)?.forEach((fn) => fn());
}

function setEntry(key, patch) {
  cache.set(key, { ...(cache.get(key) ?? {}), ...patch });
  notify(key);
}

/**
 * Fetch, deduplicating concurrent callers for the same key.
 * Everyone awaiting the same key awaits the same promise.
 */
function fetchQuery(key, fetcher, { force = false, staleTime = 0 } = {}) {
  const entry = cache.get(key);
  const isFresh = entry && Date.now() - entry.updatedAt < staleTime;

  if (!force && isFresh) return Promise.resolve(entry.data);
  if (inflight.has(key)) return inflight.get(key); // <- dedup

  setEntry(key, { isFetching: true });

  const controller = new AbortController();

  const promise = fetcher({ signal: controller.signal })
    .then((data) => {
      setEntry(key, {
        data,
        error: null,
        updatedAt: Date.now(),
        isFetching: false,
      });
      return data;
    })
    .catch((error) => {
      if (!(error instanceof AbortError)) {
        // Keep any stale data on screen; surface the error alongside it.
        setEntry(key, { error, isFetching: false });
      }
      throw error;
    })
    .finally(() => {
      inflight.delete(key);
    });

  promise.cancel = () => controller.abort();
  inflight.set(key, promise);

  return promise;
}

/* ------------------------------------------------------------------ *
 * Public cache API — call these from mutations
 * ------------------------------------------------------------------ */

export const queryCache = {
  get: (key) => cache.get(serialiseKey(key))?.data,

  /** Write directly — used for optimistic updates. */
  set(key, updater) {
    const k = serialiseKey(key);
    const current = cache.get(k)?.data;
    const data = typeof updater === "function" ? updater(current) : updater;
    setEntry(k, { data, updatedAt: Date.now() });
    return current; // return the previous value so callers can roll back
  },

  /** Mark matching keys stale and refetch the ones being observed. */
  invalidate(prefix) {
    const needle = serialiseKey(prefix);

    for (const key of cache.keys()) {
      if (!key.startsWith(needle.replace(/\]$/, ""))) continue;
      setEntry(key, { updatedAt: 0 }); // 0 == always stale
      notify(key);
    }
  },

  remove(key) {
    const k = serialiseKey(key);
    cache.delete(k);
    notify(k);
  },

  clear() {
    const keys = [...cache.keys()];
    cache.clear();
    keys.forEach(notify);
  },
};

/* ------------------------------------------------------------------ *
 * The hook
 * ------------------------------------------------------------------ */

const EMPTY = { data: undefined, error: null, isFetching: false, updatedAt: 0 };

/**
 * @param {string|any[]} key      identity of this data, e.g. ['users', { page }]
 * @param {(o:{signal:AbortSignal}) => Promise<any>} fetcher
 * @param {{ staleTime?: number, enabled?: boolean, refetchOnFocus?: boolean }} options
 */
export function useQueryCache(key, fetcher, options = {}) {
  const { staleTime = 30_000, enabled = true, refetchOnFocus = true } = options;
  const serialised = serialiseKey(key);

  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  // useSyncExternalStore is the correct way to read external mutable state:
  // it is tear-free under concurrent rendering, unlike a useEffect+setState pair.
  const subscribe = useCallback(
    (onChange) => {
      if (!listeners.has(serialised)) listeners.set(serialised, new Set());
      listeners.get(serialised).add(onChange);

      return () => {
        const set = listeners.get(serialised);
        set?.delete(onChange);
        if (set?.size === 0) listeners.delete(serialised);
      };
    },
    [serialised],
  );

  const getSnapshot = useCallback(
    () => cache.get(serialised) ?? EMPTY,
    [serialised],
  );

  const entry = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // Fetch on mount and whenever the key changes.
  useEffect(() => {
    if (!enabled) return;
    fetchQuery(serialised, (opts) => fetcherRef.current(opts), {
      staleTime,
    }).catch(() => {});
  }, [serialised, enabled, staleTime]);

  // Revalidate when the tab regains focus or the network returns.
  useEffect(() => {
    if (!refetchOnFocus || !enabled) return undefined;

    const revalidate = () => {
      if (document.visibilityState === "visible") {
        fetchQuery(serialised, (opts) => fetcherRef.current(opts), {
          staleTime,
        }).catch(() => {});
      }
    };

    window.addEventListener("visibilitychange", revalidate);
    window.addEventListener("online", revalidate);

    return () => {
      window.removeEventListener("visibilitychange", revalidate);
      window.removeEventListener("online", revalidate);
    };
  }, [serialised, enabled, staleTime, refetchOnFocus]);

  const refetch = useCallback(
    () =>
      fetchQuery(serialised, (opts) => fetcherRef.current(opts), {
        force: true,
      }),
    [serialised],
  );

  return {
    data: entry.data,
    error: entry.error,
    // First load: no data yet AND a request is in flight.
    isLoading: entry.data === undefined && (entry.isFetching || enabled),
    isFetching: entry.isFetching,
    isStale: Date.now() - (entry.updatedAt ?? 0) > staleTime,
    refetch,
  };
}

/** Warm the cache before the user navigates — e.g. on link hover. */
export function prefetchQuery(key, fetcher, options) {
  return fetchQuery(serialiseKey(key), fetcher, options).catch(() => {});
}
