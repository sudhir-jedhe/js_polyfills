/**
 * Wiring it all up.
 */

import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from '../query/queryClient.js';
import { apiClient } from '../api/client.js';
import { installAuthInterceptors, auth, onSessionExpiredDo } from '../api/auth.js';
import { ErrorBoundary } from '../react19/use-hook.jsx';
import { UserListQuery } from './UserList.jsx';

/* ---- one-time setup, before React renders ---- */

installAuthInterceptors(apiClient);

// Let the router handle session expiry rather than a hard redirect.
onSessionExpiredDo(() => {
  queryClient.clear(); // never leave another user's data in the cache
  window.location.assign('/login');
});

/* ---- providers ---- */

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary fallback={(error, reset) => <AppCrash error={error} onReset={reset} />}>
        <Suspense fallback={<p>Loading…</p>}>
          <UserListQuery />
        </Suspense>
      </ErrorBoundary>

      {/* Devtools are stripped in production builds automatically. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

function AppCrash({ error, onReset }) {
  return (
    <div role="alert">
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
      <button onClick={onReset}>Reload</button>
    </div>
  );
}

/* ---- bootstrap: restore the session before first paint ---- */

async function start() {
  await auth.bootstrap(); // refresh cookie -> access token, or null

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

start();
