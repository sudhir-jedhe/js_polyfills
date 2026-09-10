/**
 * Implementation 1: Zustand.
 *
 * ~1.2 kB, no provider, no reducers, no action types. A store is a hook.
 *
 * Its one genuine footgun: `useStore()` with no selector subscribes the
 * component to EVERY field, so an unrelated toast re-renders your table.
 * Always select the narrowest slice you need — see the selector notes below.
 */

import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { initialAuth, initialFilters, applyFilterPatch, toQueryKeyInput, nextToastId } from '../shared/contracts.js';
import { broadcast } from '../shared/crossTab.js';

/* ------------------------------------------------------------------ *
 * Auth
 * ------------------------------------------------------------------ */

export const useAuthStore = create(
  subscribeWithSelector((set, get) => ({
    ...initialAuth,

    signIn: (accessToken, user) => {
      set({ accessToken, user, status: 'authenticated' });
      broadcast({ type: 'signed-in' });
    },

    /** Local-only sign-out; the app shell also clears the query cache. */
    signOut: () => {
      set({ ...initialAuth, status: 'anonymous' });
      broadcast({ type: 'signed-out' });
    },

    /** Called by cross-tab handlers — does NOT re-broadcast, or tabs loop. */
    signOutQuietly: () => set({ ...initialAuth, status: 'anonymous' }),

    setUser: (user) => set({ user }),

    isAuthenticated: () => get().status === 'authenticated',
  }))
);

/**
 * NOTE: the token deliberately lives OUTSIDE React and outside persist.
 * `api/auth.js` reads it synchronously in a request interceptor, which
 * cannot call a hook. Bridging the two:
 */
useAuthStore.subscribe(
  (state) => state.accessToken,
  (token) => {
    // Keep the plain module store in api/auth.js in sync, so interceptors
    // (which run outside React) always see the current token.
    import('../../api/auth.js').then(({ tokenStore }) => {
      token ? tokenStore.set(token) : tokenStore.clear();
    });
  }
);

/* ------------------------------------------------------------------ *
 * Filters — client state that FEEDS server state
 * ------------------------------------------------------------------ */

export const useFilterStore = create(
  persist(
    (set, get) => ({
      ...initialFilters,

      setFilters: (patch) => set((state) => applyFilterPatch(state, patch)),

      setSearch: (search) => set((state) => applyFilterPatch(state, { search })),

      setPage: (page) => set({ page }),

      toggleSort: (column) =>
        set((state) => ({
          sortBy: column,
          sortDir: state.sortBy === column && state.sortDir === 'asc' ? 'desc' : 'asc',
          page: 1,
        })),

      reset: () => set(initialFilters),

      toQueryKey: () => toQueryKeyInput(get()),
    }),
    {
      name: 'app:filters',
      storage: createJSONStorage(() => localStorage),
      // Persist the inputs, never the actions.
      partialize: ({ page, search, sortBy, sortDir }) => ({ page, search, sortBy, sortDir }),
      version: 1,
      // Bump `version` and write a migrate when the shape changes, or users
      // with old localStorage will hydrate garbage.
      migrate: (persisted, version) => (version === 0 ? { ...initialFilters } : persisted),
    }
  )
);

/* ------------------------------------------------------------------ *
 * UI: toasts, connectivity, offline queue count
 * ------------------------------------------------------------------ */

export const useUiStore = create((set, get) => ({
  toasts: [],
  isOnline: typeof navigator === 'undefined' ? true : navigator.onLine,
  queuedMutations: 0,

  pushToast: ({ kind = 'info', message, timeout = 5000 }) => {
    const id = nextToastId();
    set((state) => ({ toasts: [...state.toasts, { id, kind, message }] }));

    if (timeout) setTimeout(() => get().dismissToast(id), timeout);
    return id;
  },

  dismissToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  setOnline: (isOnline) => set({ isOnline }),
  setQueuedMutations: (queuedMutations) => set({ queuedMutations }),
}));

/* ------------------------------------------------------------------ *
 * Selectors — the part that decides your render performance
 * ------------------------------------------------------------------ */

/**
 * WRONG: subscribes to the whole store. Any toast re-renders this component.
 *   const { page, search } = useFilterStore();
 *
 * RIGHT: one primitive per call. Zustand compares with Object.is, so a
 * primitive only re-renders when it actually changes.
 */
export const usePage = () => useFilterStore((s) => s.page);
export const useSearch = () => useFilterStore((s) => s.search);

/**
 * Selecting an OBJECT needs a shallow comparator, or the new object literal
 * is a new reference every render and you re-render forever.
 */
export const useQueryFilters = () =>
  useFilterStore(useShallow(({ page, search, sortBy, sortDir }) => ({ page, search, sortBy, sortDir })));

/** Actions are stable references — safe to select without a comparator. */
export const useFilterActions = () =>
  useFilterStore(useShallow((s) => ({
    setFilters: s.setFilters,
    setSearch: s.setSearch,
    setPage: s.setPage,
    toggleSort: s.toggleSort,
    reset: s.reset,
  })));

export const useAuthStatus = () => useAuthStore((s) => s.status);
export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useToasts = () => useUiStore((s) => s.toasts);

/** Read or write from outside React — the escape hatch that makes Zustand nice. */
export const authActions = {
  signIn: (...args) => useAuthStore.getState().signIn(...args),
  signOut: () => useAuthStore.getState().signOut(),
  getToken: () => useAuthStore.getState().accessToken,
};

export const toast = {
  success: (message) => useUiStore.getState().pushToast({ kind: 'success', message }),
  error: (message) => useUiStore.getState().pushToast({ kind: 'error', message, timeout: 8000 }),
  info: (message) => useUiStore.getState().pushToast({ kind: 'info', message }),
};
