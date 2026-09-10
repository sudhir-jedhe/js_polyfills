/**
 * Implementation 3: Jotai.
 *
 * Bottom-up instead of top-down: rather than one store you slice into, you
 * declare many small atoms and COMPOSE them. A component re-renders only
 * when an atom it actually reads changes — no selector discipline required,
 * because the atom IS the selector.
 *
 * Where it shines: lots of independent, fine-grained pieces of state, and
 * derived values with real dependency graphs.
 * Where it costs: no single object to inspect, and "what is the whole state
 * right now?" is a harder question to answer than in Redux devtools.
 */

import { atom } from 'jotai';
import { atomWithStorage, atomWithReset, RESET, selectAtom, loadable } from 'jotai/utils';

import { initialAuth, initialFilters, applyFilterPatch, toQueryKeyInput, nextToastId } from '../shared/contracts.js';
import { broadcast } from '../shared/crossTab.js';

/* ------------------------------------------------------------------ *
 * Auth
 * ------------------------------------------------------------------ */

/** Primitive atoms — the leaves of the graph. */
export const accessTokenAtom = atom(initialAuth.accessToken);
export const currentUserAtom = atom(initialAuth.user);
export const authStatusAtom = atom(initialAuth.status);

/**
 * A DERIVED (read-only) atom. It recomputes only when authStatusAtom
 * changes, and only components reading THIS atom re-render.
 */
export const isAuthenticatedAtom = atom((get) => get(authStatusAtom) === 'authenticated');

/**
 * A WRITE-ONLY atom is Jotai's action. `null` as the read function means
 * "you cannot read this", which is exactly right for a command.
 */
export const signInAtom = atom(null, (get, set, { accessToken, user }) => {
  set(accessTokenAtom, accessToken);
  set(currentUserAtom, user ?? null);
  set(authStatusAtom, 'authenticated');
  broadcast({ type: 'signed-in' });
});

export const signOutAtom = atom(null, (get, set, { quiet = false } = {}) => {
  set(accessTokenAtom, null);
  set(currentUserAtom, null);
  set(authStatusAtom, 'anonymous');
  if (!quiet) broadcast({ type: 'signed-out' });
});

/**
 * An ASYNC derived atom. Reading it suspends the component until it
 * resolves — Jotai and Suspense compose natively.
 */
export const sessionAtom = atom(async (get) => {
  const status = get(authStatusAtom);
  if (status !== 'authenticated') return null;

  const { auth } = await import('../../api/auth.js');
  return auth.me();
});

/** `loadable` turns a suspending atom into { state, data | error } — no boundary needed. */
export const sessionLoadableAtom = loadable(sessionAtom);

/* ------------------------------------------------------------------ *
 * Filters
 * ------------------------------------------------------------------ */

/** Persisted to localStorage, and resettable via the RESET symbol. */
export const filtersAtom = atomWithStorage('app:filters', initialFilters);

/** Writing a patch goes through the shared normalisation. */
export const setFiltersAtom = atom(null, (get, set, patch) => {
  set(filtersAtom, applyFilterPatch(get(filtersAtom), patch));
});

export const toggleSortAtom = atom(null, (get, set, column) => {
  const current = get(filtersAtom);
  set(filtersAtom, {
    ...current,
    sortBy: column,
    sortDir: current.sortBy === column && current.sortDir === 'asc' ? 'desc' : 'asc',
    page: 1,
  });
});

export const resetFiltersAtom = atom(null, (get, set) => set(filtersAtom, RESET));

/**
 * `selectAtom` is the fine-grained read: a component using pageAtom
 * re-renders when the page changes, NOT when the search text does.
 */
export const pageAtom = selectAtom(filtersAtom, (f) => f.page);
export const searchAtom = selectAtom(filtersAtom, (f) => f.search);

/**
 * The query-key atom. The third argument is an equality function — without
 * it, this returns a new object every time and defeats the memoisation.
 */
export const queryKeyAtom = selectAtom(
  filtersAtom,
  toQueryKeyInput,
  (a, b) => a.page === b.page && a.search === b.search && a.sortBy === b.sortBy && a.sortDir === b.sortDir
);

/* ------------------------------------------------------------------ *
 * UI
 * ------------------------------------------------------------------ */

export const toastsAtom = atom([]);
export const isOnlineAtom = atom(typeof navigator === 'undefined' ? true : navigator.onLine);
export const queuedMutationsAtom = atom(0);

export const pushToastAtom = atom(null, (get, set, { kind = 'info', message, timeout = 5000 }) => {
  const id = nextToastId();
  set(toastsAtom, [...get(toastsAtom), { id, kind, message }]);

  if (timeout) {
    setTimeout(() => set(toastsAtom, (current) => current.filter((t) => t.id !== id)), timeout);
  }

  return id;
});

export const dismissToastAtom = atom(null, (get, set, id) => {
  set(toastsAtom, get(toastsAtom).filter((t) => t.id !== id));
});

/** A derived atom with no state of its own — the banner reads just this. */
export const shouldShowOfflineBannerAtom = atom(
  (get) => !get(isOnlineAtom) || get(queuedMutationsAtom) > 0
);

/* ------------------------------------------------------------------ *
 * Reading/writing outside React
 * ------------------------------------------------------------------ */

/**
 * Jotai's default store, so non-React code (an axios interceptor) can read
 * an atom. This is the equivalent of Zustand's `getState()`.
 *
 *   import { getDefaultStore } from 'jotai';
 *   const store = getDefaultStore();
 *   store.get(accessTokenAtom);
 *   store.sub(accessTokenAtom, () => { ... });
 */
export { getDefaultStore } from 'jotai';
