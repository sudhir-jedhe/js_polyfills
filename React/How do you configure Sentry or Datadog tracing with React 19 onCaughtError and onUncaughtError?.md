React 19’s root configuration options (`onCaughtError`, `onUncaughtError`, and `onRecoverableError`) provide native hooks to feed full component stacks and error contexts directly into monitoring platforms like Sentry or Datadog without needing legacy `componentDidCatch` wrappers on every boundary.

---

### 1. Sentry Configuration (React 19 Client Entry)

Sentry captures rich context via `Sentry.captureException()`. You can attach the `componentStack` via `extra` or `contexts` and set the `handled` flag accordingly.

```tsx
// main.tsx / entry.client.tsx
import { createRoot, hydrateRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.VITE_SENTRY_DSN,
  tracesSampleRate: 1.0,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
});

const container = document.getElementById('root')!;

const rootOptions = {
  // 1. Errors caught by an <ErrorBoundary>
  onCaughtError(error: unknown, errorInfo: { componentStack?: string }) {
    Sentry.captureException(error, {
      level: 'warning',
      mechanism: {
        type: 'react.onCaughtError',
        handled: true, // Mark as handled since an Error Boundary absorbed it
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  },

  // 2. Fatal crashes that bubbled without an ErrorBoundary
  onUncaughtError(error: unknown, errorInfo: { componentStack?: string }) {
    Sentry.captureException(error, {
      level: 'fatal',
      mechanism: {
        type: 'react.onUncaughtError',
        handled: false, // Unhandled crash
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  },

  // 3. Hydration mismatches or transient engine errors React recovered from
  onRecoverableError(error: unknown, errorInfo: { componentStack?: string }) {
    Sentry.captureException(error, {
      level: 'info',
      mechanism: {
        type: 'react.onRecoverableError',
        handled: true,
      },
      tags: {
        error_type: 'hydration_or_recoverable',
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  },
};

// Use with createRoot or hydrateRoot (SSR)
createRoot(container, rootOptions).render(<App />);
// Or: hydrateRoot(container, <App />, rootOptions);

```

---

### 2. Datadog RUM Configuration

Datadog Real User Monitoring (RUM) accepts errors via `datadogRum.addError()`. You can pass custom contexts and component stacks directly to your RUM session:

```tsx
// main.tsx / entry.client.tsx
import { createRoot } from 'react-dom/client';
import { datadogRum } from '@datadog/browser-rum';
import App from './App';

datadogRum.init({
  applicationId: '<DATADOG_APP_ID>',
  clientToken: '<DATADOG_CLIENT_TOKEN>',
  site: 'datadoghq.com',
  service: 'frontend-web',
  env: 'production',
  version: '1.0.0',
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: 'mask-user-input',
});

const container = document.getElementById('root')!;

createRoot(container, {
  onCaughtError(error: unknown, errorInfo: { componentStack?: string }) {
    datadogRum.addError(error, {
      source: 'custom',
      errorHandling: 'HANDLED',
      componentStack: errorInfo.componentStack,
    });
  },

  onUncaughtError(error: unknown, errorInfo: { componentStack?: string }) {
    datadogRum.addError(error, {
      source: 'custom',
      errorHandling: 'UNHANDLED',
      componentStack: errorInfo.componentStack,
    });
  },

  onRecoverableError(error: unknown, errorInfo: { componentStack?: string }) {
    datadogRum.addError(error, {
      source: 'custom',
      errorHandling: 'HANDLED',
      errorType: 'ReactRecoverableError',
      componentStack: errorInfo.componentStack,
    });
  },
}).render(<App />);

```

---

### 3. Next.js (App Router) Integration

In Next.js (App Router), `createRoot` is managed internally by the framework. To capture errors with Sentry or Datadog in Next.js applications:

* **Unhandled / Caught Boundary Errors:** Next.js routes these through `app/global-error.tsx` (for root crashes) and `app/error.tsx` (for segment crashes):

```tsx
// app/error.tsx
'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function ErrorBoundarySegment({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log segment crashes
    Sentry.captureException(error, {
      extra: { digest: error.digest },
    });
  }, [error]);

  return (
    <div className="p-4 bg-red-50 border rounded text-red-900 space-y-2">
      <h2>Something went wrong in this section!</h2>
      <button
        onClick={() => reset()}
        className="px-3 py-1 bg-red-600 text-white rounded text-xs"
      >
        Try Again
      </button>
    </div>
  );
}

```

* **Instrumentation Hook:** Configure `instrumentation.ts` in your Next.js root for server and edge runtime telemetry:

```typescript
// instrumentation.ts
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('./sentry.server.config');
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

```

---

### Key Best Practices for Telemetry Pipelines

* **Fingerprinting on `componentStack`:** By default, minified production errors might group together under a generic name (e.g., `Minified React error #418`). Provide custom fingerprinting in Sentry using the `componentStack` string to group identical component failures accurately.
* **Filter Transient Network Retries:** If you use transition-based retries on stream errors, consider tagging caught stream errors with `{ streamRetry: true }` so non-fatal, transient connection drops don't trigger urgent alert pages.
* **Track Hydration Mismatch Trends:** Send `onRecoverableError` events with a lower severity (e.g., `info` or `warning`). Spikes in these events indicate deployment divergences between server-rendered HTML and client bundles.
