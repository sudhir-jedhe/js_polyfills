/**
 * Implementation 2: Redux Toolkit.
 *
 * More ceremony than Zustand — a provider, a configured store, slices — but
 * you get time-travel devtools, a serialisable action log, and RTK Query
 * bundled in. If the app is already Redux, this is the path of least
 * resistance: do NOT add TanStack Query on top.
 *
 * `createSlice` generates the action creators and types for you, and Immer
 * lets you "mutate" draft state safely. The `state.x = y` below produces a
 * new object — it is not actually mutating.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { initialAuth, initialFilters, applyFilterPatch, toQueryKeyInput, nextToastId } from '../shared/contracts.js';
import { broadcast } from '../shared/crossTab.js';

/* ------------------------------------------------------------------ *
 * Auth
 * ------------------------------------------------------------------ */

export const bootstrapSession = createAsyncThunk('auth/bootstrap', async (_, { rejectWithValue }) => {
  try {
    const { auth } = await import('../../api/auth.js');
    const user = await auth.bootstrap();
    if (!user) return rejectWithValue('anonymous');
    return user;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: initialAuth,
  reducers: {
    signedIn: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user ?? null;
      state.status = 'authenticated';
    },
    signedOut: (state) => {
      state.accessToken = null;
      state.user = null;
      state.status = 'anonymous';
    },
    userUpdated: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapSession.pending, (state) => {
        state.status = 'unknown';
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'authenticated';
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.status = 'anonymous';
      });
  },
});

export const { signedIn, signedOut, userUpdated } = authSlice.actions;

/** A thunk, so sign-out can do the side effects too. */
export const signOut = () => async (dispatch) => {
  const { auth } = await import('../../api/auth.js');
  try {
    await auth.logout();
  } finally {
    dispatch(signedOut());
    broadcast({ type: 'signed-out' });
  }
};

/* ------------------------------------------------------------------ *
 * Filters
 * ------------------------------------------------------------------ */

const filterSlice = createSlice({
  name: 'filters',
  initialState: initialFilters,
  reducers: {
    filtersChanged: (state, action) => applyFilterPatch(state, action.payload),

    pageChanged: (state, action) => {
      state.page = action.payload;
    },

    sortToggled: (state, action) => {
      const column = action.payload;
      state.sortDir = state.sortBy === column && state.sortDir === 'asc' ? 'desc' : 'asc';
      state.sortBy = column;
      state.page = 1;
    },

    filtersReset: () => initialFilters,
  },
});

export const { filtersChanged, pageChanged, sortToggled, filtersReset } = filterSlice.actions;

/* ------------------------------------------------------------------ *
 * UI
 * ------------------------------------------------------------------ */

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
    isOnline: true,
    queuedMutations: 0,
  },
  reducers: {
    toastPushed: {
      reducer: (state, action) => {
        state.toasts.push(action.payload);
      },
      // `prepare` is where non-serialisable work (id generation) belongs, so
      // the reducer itself stays pure.
      prepare: ({ kind = 'info', message }) => ({ payload: { id: nextToastId(), kind, message } }),
    },
    toastDismissed: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    onlineChanged: (state, action) => {
      state.isOnline = action.payload;
    },
    queueSizeChanged: (state, action) => {
      state.queuedMutations = action.payload;
    },
  },
});

export const { toastPushed, toastDismissed, onlineChanged, queueSizeChanged } = uiSlice.actions;

/** Auto-dismissing toast as a thunk. */
export const showToast = (toast, timeout = 5000) => (dispatch) => {
  const action = dispatch(toastPushed(toast));
  const { id } = action.payload;
  if (timeout) setTimeout(() => dispatch(toastDismissed(id)), timeout);
  return id;
};

export const reducers = {
  auth: authSlice.reducer,
  filters: filterSlice.reducer,
  ui: uiSlice.reducer,
};

/* ------------------------------------------------------------------ *
 * Selectors — colocate them with the slice, never inline in components
 * ------------------------------------------------------------------ */

export const selectAuthStatus = (state) => state.auth.status;
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.status === 'authenticated';
export const selectToasts = (state) => state.ui.toasts;
export const selectIsOnline = (state) => state.ui.isOnline;

/**
 * A derived selector that returns an OBJECT must be memoised, or every
 * dispatch produces a new reference and re-renders every subscriber.
 * `createSelector` from reselect (re-exported by RTK) does that.
 */
import { createSelector } from '@reduxjs/toolkit';

export const selectQueryFilters = createSelector(
  [(state) => state.filters],
  (filters) => toQueryKeyInput(filters)
);
