/**
 * useApi — data fetching with useState + useEffect, done correctly.
 *
 * This is the hook everyone writes badly. The four bugs it fixes:
 *
 *   1. RACE CONDITIONS. Type "a", then "ab". If /search?q=a resolves second,
 *      you render results for "a" while the box says "ab". Fixed by aborting
 *      the previous request AND ignoring stale resolutions.
 *
 *   2. SETTING STATE AFTER UNMOUNT. Harmless in React 18+ (no warning), but
 *      it keeps the closure and its data alive. Fixed by the same guard.
 *
 *   3. THE FUNCTION-IN-DEPS LOOP. Passing an inline `fetcher` re-runs the
 *      effect every render. Fixed by keeping the fetcher in a ref.
 *
 *   4. NO CANCELLATION. Navigating away leaves the request running. Fixed
 *      with AbortController.
 *
 * For anything beyond a couple of screens, use TanStack Query instead —
 * see ../query/queries.js. This hook is what it does, minus the cache.
 */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AbortError, toUserMessage } from '../api/errors.js';

/**
 * @param {(opts: { signal: AbortSignal }) => Promise<any>} fetcher
 * @param {any[]} deps  re-fetch when these change (like useEffect)
 * @param {{ enabled?: boolean, initialData?: any, onSuccess?: Function, onError?: Function }} options
 */
export function useApi(fetcher, deps = [], options = {}) {
  const { enabled = true, initialData = null, onSuccess, onError } = options;

  const [state, setState] = useState({
    data: initialData,
    error: null,
    // `isLoading` is the FIRST load; `isFetching` is any load, including
    // background refreshes. Conflating them causes spinner flicker.
    isLoading: enabled,
    isFetching: false,
  });

  // Keep callbacks in refs so they never need to be dependencies.
  const fetcherRef = useRef(fetcher);
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    fetcherRef.current = fetcher;
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  // Bumping this forces a refetch without changing deps.
  const [nonce, setNonce] = useState(0);
  const refetch = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (!enabled) {
      setState((s) => ({ ...s, isLoading: false }));
      return undefined;
    }

    const controller = new AbortController();
    let cancelled = false; // guards against a resolution arriving after cleanup

    setState((s) => ({ ...s, isFetching: true, error: null }));

    fetcherRef.current({ signal: controller.signal })
      .then((data) => {
        if (cancelled) return;
        setState({ data, error: null, isLoading: false, isFetching: false });
        onSuccessRef.current?.(data);
      })
      .catch((error) => {
        // We cancelled on purpose — that is not an error state.
        if (cancelled || error instanceof AbortError) return;
        setState((s) => ({ ...s, error, isLoading: false, isFetching: false }));
        onErrorRef.current?.(error);
      });

    return () => {
      cancelled = true;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, enabled, nonce]);

  const message = useMemo(() => (state.error ? toUserMessage(state.error) : null), [state.error]);

  return { ...state, errorMessage: message, refetch, isError: Boolean(state.error) };
}

/**
 * useAsyncCallback — the same discipline for things the USER triggers
 * (submit, delete), where you do not want an effect at all.
 */
export function useAsyncCallback(callback) {
  const [state, setState] = useState({ data: null, error: null, isPending: false });
  const mountedRef = useRef(true);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (...args) => {
    setState({ data: null, error: null, isPending: true });

    try {
      const data = await callbackRef.current(...args);
      if (mountedRef.current) setState({ data, error: null, isPending: false });
      return data;
    } catch (error) {
      if (mountedRef.current) setState({ data: null, error, isPending: false });
      throw error; // let the caller decide; the state is for rendering
    }
  }, []);

  const reset = useCallback(() => setState({ data: null, error: null, isPending: false }), []);

  return {
    ...state,
    errorMessage: state.error ? toUserMessage(state.error) : null,
    execute,
    reset,
  };
}

/** Debounce a value — pair with useApi for search-as-you-type. */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
