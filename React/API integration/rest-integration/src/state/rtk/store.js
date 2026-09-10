/**
 * The Redux store, plus RTK Query.
 *
 * The important bit here is `baseQueryWithReauth`: the canonical
 * single-flight token refresh for RTK Query, using a mutex so ten
 * simultaneous 401s cause ONE refresh.
 */

import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setupListeners } from '@reduxjs/toolkit/query';

import { reducers, signedIn, signedOut } from './slices.js';
import { broadcast } from '../shared/crossTab.js';

/* ------------------------------------------------------------------ *
 * A tiny mutex — no dependency needed
 * ------------------------------------------------------------------ */

function createMutex() {
  let unlock = null;
  let locked = null;

  return {
    get isLocked() {
      return locked !== null;
    },
    /** Wait for whoever holds the lock to release it. */
    waitForUnlock: () => locked ?? Promise.resolve(),
    acquire() {
      locked = new Promise((resolve) => {
        unlock = () => {
          locked = null;
          unlock = null;
          resolve();
        };
      });
      return () => unlock?.();
    },
  };
}

const refreshMutex = createMutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta?.env?.VITE_API_URL ?? '/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return headers;
  },
});

/**
 * Wrap the base query: on a 401, refresh once and replay.
 *
 * The mutex is the whole point. Without it, ten concurrent 401s fire ten
 * refreshes; nine fail because the first rotated the refresh token, and the
 * user is thrown out mid-session.
 */
async function baseQueryWithReauth(args, api, extraOptions) {
  // If a refresh is already running, wait for it rather than starting another.
  await refreshMutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status !== 401) return result;

  if (!refreshMutex.isLocked) {
    const release = refreshMutex.acquire();

    try {
      const refresh = await rawBaseQuery(
        { url: '/auth/refresh', method: 'POST' },
        api,
        extraOptions
      );

      if (refresh.data?.accessToken) {
        api.dispatch(signedIn({ accessToken: refresh.data.accessToken }));
        result = await rawBaseQuery(args, api, extraOptions); // replay
      } else {
        api.dispatch(signedOut());
        broadcast({ type: 'session-expired' });
      }
    } finally {
      release();
    }
  } else {
    // Someone else refreshed while we waited — just retry.
    await refreshMutex.waitForUnlock();
    result = await rawBaseQuery(args, api, extraOptions);
  }

  return result;
}

/* ------------------------------------------------------------------ *
 * RTK Query API
 * ------------------------------------------------------------------ */

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,

  /**
   * Tags are RTK Query's invalidation model — the equivalent of TanStack's
   * query keys. A mutation lists what it invalidates; matching queries refetch.
   */
  tagTypes: ['User', 'Post'],

  keepUnusedDataFor: 300, // seconds — the gcTime equivalent

  endpoints: (build) => ({
    getUsers: build.query({
      query: ({ page = 1, search = '', sortBy, sortDir } = {}) => ({
        url: '/users',
        params: { page, q: search, sort_by: sortBy, sort_dir: sortDir },
      }),
      // Tag each row AND the list, so a single-user update can invalidate precisely.
      providesTags: (result) =>
        result
          ? [...result.items.map(({ id }) => ({ type: 'User', id })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }],
    }),

    getUser: build.query({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    createUser: build.mutation({
      query: (body) => ({ url: '/users', method: 'POST', body }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: build.mutation({
      query: ({ id, ...patch }) => ({ url: `/users/${id}`, method: 'PATCH', body: patch }),

      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],

      /**
       * Optimistic update, RTK Query style. `updateQueryData` returns a patch
       * with an `undo()` — that is the rollback.
       */
      async onQueryStarted({ id, ...patch }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getUser', id, (draft) => {
            Object.assign(draft, patch);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo(); // roll back
        }
      },
    }),

    deleteUser: build.mutation({
      query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'User', id }, { type: 'User', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = api;

/* ------------------------------------------------------------------ *
 * The store
 * ------------------------------------------------------------------ */

export const store = configureStore({
  reducer: {
    ...reducers,
    [api.reducerPath]: api.reducer,
  },

  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        // RTK Query's internal actions carry non-serialisable bits.
        ignoredActions: ['api/executeQuery/fulfilled'],
      },
    }).concat(api.middleware),

  devTools: import.meta?.env?.MODE !== 'production',
});

/** Enables refetchOnFocus / refetchOnReconnect. */
setupListeners(store.dispatch);

/** Clear every cached response — call this on sign-out. */
export const resetApiCache = () => store.dispatch(api.util.resetApiState());
