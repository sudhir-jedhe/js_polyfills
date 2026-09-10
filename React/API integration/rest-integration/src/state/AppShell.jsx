/**
 * The app shell: where client state, server state and the browser meet.
 *
 * Five concerns that are nobody's feature but everybody's bug:
 *
 *   1. BOOTSTRAP    resolve the session before deciding what to render, or
 *                   a signed-in user sees a flash of the login screen.
 *   2. LOGOUT       clear the QUERY CACHE, not just the auth store. Leaving
 *                   it is how the next user sees the previous user's data.
 *   3. CROSS-TAB    sign out here, sign out everywhere.
 *   4. OFFLINE      queue writes, replay on reconnect, tell the user.
 *   5. TOASTS       one place errors surface, driven by the query cache.
 *
 * This file uses the Zustand implementation; the Redux and Jotai versions
 * differ only in the three hook calls marked below.
 */

import { useEffect, useState } from 'react';
import { QueryClientProvider, useQueryClient, useQuery } from '@tanstack/react-query';

import { queryClient } from '../query/queryClient.js';
import { apiClient } from '../api/client.js';
import { installAuthInterceptors, auth, onSessionExpiredDo } from '../api/auth.js';
import { toUserMessage } from '../api/errors.js';

import { installCrossTabAuth } from './shared/crossTab.js';
import { createOfflineQueue } from './shared/offlineQueue.js';
import { users } from '../api/endpoints.js';

// --- swap these three imports to change implementation ---
import { useAuthStore, useUiStore, useToasts, useQueryFilters, toast } from './zustand/stores.js';

/* ------------------------------------------------------------------ *
 * One-time wiring, before React renders
 * ------------------------------------------------------------------ */

installAuthInterceptors(apiClient);

/** The offline queue needs a handler per mutation type it can replay. */
export const offlineQueue = createOfflineQueue({
  handlers: {
    updateUser: ({ id, changes }, { idempotencyKey }) =>
      apiClient.patch(`/users/${id}`, changes, { headers: { 'Idempotency-Key': idempotencyKey } }),

    createUser: async (user, { idempotencyKey }) => {
      const created = await apiClient.post('/users', user, {
        headers: { 'Idempotency-Key': idempotencyKey },
      });
      // Let later queued entries that referenced the temp id find the real one.
      return { ...created, idMapping: user.tempId ? { [user.tempId]: created.id } : undefined };
    },

    deleteUser: ({ id }) => users.remove(id),
  },

  onChange: (queued) => {
    useUiStore.getState().setQueuedMutations(queued.length);
  },
});

/**
 * Session expiry: the ONE place that decides what "logged out" means.
 * Clearing the cache here is not optional.
 */
onSessionExpiredDo(() => {
  useAuthStore.getState().signOutQuietly();
  queryClient.clear();
  toast.error('Your session expired. Please sign in again.');
});

/* ------------------------------------------------------------------ *
 * Providers
 * ------------------------------------------------------------------ */

export function AppShell({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionGate>
        <ConnectivityWatcher />
        <CrossTabWatcher />
        <OfflineBanner />
        {children}
        <Toasts />
      </SessionGate>
    </QueryClientProvider>
  );
}

/* ------------------------------------------------------------------ *
 * 1. Bootstrap — do not render routes until the session is known
 * ------------------------------------------------------------------ */

function SessionGate({ children }) {
  const status = useAuthStore((s) => s.status);
  const signIn = useAuthStore((s) => s.signIn);
  const signOutQuietly = useAuthStore((s) => s.signOutQuietly);

  useEffect(() => {
    let cancelled = false;

    auth
      .bootstrap()
      .then((user) => {
        if (cancelled) return;
        // bootstrap() has already put the token in the module store; mirror
        // it into the app store so React can react to it.
        user ? signIn(null, user) : signOutQuietly();
      })
      .catch(() => !cancelled && signOutQuietly());

    return () => {
      cancelled = true;
    };
  }, [signIn, signOutQuietly]);

  // 'unknown' is why status is a three-state enum rather than a boolean.
  if (status === 'unknown') return <Splash />;

  return children;
}

function Splash() {
  return (
    <div role="status" aria-live="polite">
      Loading…
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 2. Sign-out — the hook every logout button should use
 * ------------------------------------------------------------------ */

export function useSignOut() {
  const client = useQueryClient();
  const signOut = useAuthStore((s) => s.signOut);

  return async () => {
    try {
      await auth.logout();
    } finally {
      signOut();              // clears the token + broadcasts to other tabs
      client.clear();         // <- the step people forget
      offlineQueue.clear();   // do not replay the last user's writes
    }
  };
}

/* ------------------------------------------------------------------ *
 * 3. Cross-tab
 * ------------------------------------------------------------------ */

function CrossTabWatcher() {
  const client = useQueryClient();

  useEffect(
    () =>
      installCrossTabAuth(
        {
          signOut: () => useAuthStore.getState().signOutQuietly(),
          refresh: () => auth.bootstrap(),
        },
        client
      ),
    [client]
  );

  return null;
}

/* ------------------------------------------------------------------ *
 * 4. Connectivity + offline queue
 * ------------------------------------------------------------------ */

function ConnectivityWatcher() {
  const setOnline = useUiStore((s) => s.setOnline);
  const client = useQueryClient();

  useEffect(() => {
    const goOnline = () => {
      setOnline(true);
      toast.success('Back online');
      // Anything cached while offline is suspect — revalidate it.
      client.invalidateQueries();
    };

    const goOffline = () => {
      setOnline(false);
      toast.info("You're offline. Changes will be saved when you reconnect.");
    };

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    const uninstall = offlineQueue.install();

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
      uninstall();
    };
  }, [setOnline, client]);

  return null;
}

function OfflineBanner() {
  const isOnline = useUiStore((s) => s.isOnline);
  const queued = useUiStore((s) => s.queuedMutations);

  if (isOnline && queued === 0) return null;

  return (
    <div role="status" aria-live="polite" className="offline-banner">
      {!isOnline && <span>You're offline.</span>}
      {queued > 0 && (
        <span>
          {' '}
          {queued} change{queued === 1 ? '' : 's'} waiting to sync.
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * 5. Toasts, fed by the query cache
 * ------------------------------------------------------------------ */

function Toasts() {
  const toasts = useToasts();
  const dismiss = useUiStore((s) => s.dismissToast);
  const client = useQueryClient();

  /**
   * Subscribe to the MUTATION cache so every failed write surfaces once,
   * centrally — instead of an onError in forty components.
   */
  useEffect(() => {
    const unsubscribe = client.getMutationCache().subscribe((event) => {
      if (event.type !== 'updated') return;
      if (event.mutation?.state.status !== 'error') return;

      // Let a mutation opt out when it renders its own inline errors.
      if (event.mutation.meta?.silentError) return;

      const message = toUserMessage(event.mutation.state.error);
      if (message) toast.error(message);
    });

    return unsubscribe;
  }, [client]);

  if (toasts.length === 0) return null;

  return (
    <div className="toasts" role="region" aria-label="Notifications">
      {toasts.map(({ id, kind, message }) => (
        <div key={id} role="alert" data-kind={kind}>
          {message}
          <button onClick={() => dismiss(id)} aria-label="Dismiss">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Filters driving a query — the seam worth studying
 * ------------------------------------------------------------------ */

export function useFilteredUsers() {
  // The FILTERS live in the client store. The RESULTS live in the query
  // cache. Never the other way round.
  const filters = useQueryFilters();

  return useQuery({
    queryKey: ['users', 'list', filters], // derived from client state
    queryFn: ({ signal }) => users.list({ ...filters, signal }),
    placeholderData: (previous) => previous,
  });
}
