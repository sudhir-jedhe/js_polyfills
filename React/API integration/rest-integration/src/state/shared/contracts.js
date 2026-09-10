/**
 * The contract every implementation satisfies.
 *
 * The point of writing this first: the three libraries in ../zustand,
 * ../rtk and ../jotai are NOT three different designs. They are three
 * spellings of the same three slices. Reading them side by side, the only
 * real differences are ergonomics — which is exactly what you want to
 * compare when choosing.
 *
 * Three slices, and why each one belongs in a client store rather than in
 * the server cache:
 *
 *   AUTH     the session is client state. The *user record* is server
 *            state (fetch it with Query); the access token, the "am I
 *            logged in" flag and the logout action are not.
 *
 *   FILTERS  page / search / sort are client state that FEEDS server state.
 *            They belong in a store (or the URL), and the query key is
 *            derived from them. This is the seam people get wrong — they
 *            put the *results* in the store instead of the *inputs*.
 *
 *   UI       toasts, modals, the offline banner. Pure client state, never
 *            server-derived.
 */

/**
 * @typedef {object} AuthState
 * @property {string|null} accessToken   held in memory only — never localStorage
 * @property {object|null} user          the cached identity, refreshed by Query
 * @property {'unknown'|'authenticated'|'anonymous'} status
 * @property {(token: string, user?: object) => void} signIn
 * @property {() => void} signOut        must also clear the query cache
 * @property {() => boolean} isAuthenticated
 */

/**
 * @typedef {object} FilterState
 * @property {number} page
 * @property {string} search
 * @property {'name'|'createdAt'} sortBy
 * @property {'asc'|'desc'} sortDir
 * @property {(patch: object) => void} setFilters  resets page unless page is set
 * @property {() => void} reset
 * @property {() => object} toQueryKey  the serialisable slice Query keys on
 */

/**
 * @typedef {object} UiState
 * @property {Array<{id: string, kind: string, message: string}>} toasts
 * @property {(toast: object) => string} pushToast
 * @property {(id: string) => void} dismissToast
 * @property {boolean} isOnline
 * @property {(online: boolean) => void} setOnline
 */

/** Shared defaults, so the three implementations start identical. */
export const initialFilters = {
  page: 1,
  search: '',
  sortBy: 'name',
  sortDir: 'asc',
};

export const initialAuth = {
  accessToken: null,
  user: null,
  status: 'unknown', // 'unknown' until bootstrap finishes — see the note below
};

/**
 * Why `status: 'unknown'` and not `isAuthenticated: false`.
 *
 * On first paint you do not yet know whether the refresh cookie is valid.
 * A boolean forces you to guess, and guessing `false` flashes the login
 * screen to a signed-in user. Three states let the shell render a splash
 * until bootstrap resolves.
 */

/** Normalise a filter patch: changing anything except the page resets to page 1. */
export function applyFilterPatch(current, patch) {
  const next = { ...current, ...patch };
  const changedSomethingElse = Object.keys(patch).some((k) => k !== 'page');
  if (changedSomethingElse && patch.page === undefined) next.page = 1;
  return next;
}

/** Only the fields a query key should depend on — never functions or transient UI. */
export function toQueryKeyInput(filters) {
  const { page, search, sortBy, sortDir } = filters;
  return { page, search: search.trim(), sortBy, sortDir };
}

let toastId = 0;
export const nextToastId = () => `toast-${++toastId}`;
