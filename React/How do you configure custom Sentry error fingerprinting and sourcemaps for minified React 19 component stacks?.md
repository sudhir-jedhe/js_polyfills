In production, React 19 component stacks can become heavily minified, causing generic errors (like minified invariant codes or generic `TypeError` exceptions) to group into a single misleading Sentry issue.

To resolve this, you must configure **automated Source Map uploads** (via Vite, Webpack, or Next.js plugins) and implement **custom fingerprinting via `beforeSend**` using React 19's `componentStack`.

---

### 1. Configure Source Map Generation & Uploads

Sentry needs your build artifacts and unminified source maps uploaded during CI/CD to translate minified frames and component names back to original source files.

#### For Next.js (`@sentry/nextjs`)

Next.js handles source maps and server/client bundle symbolication automatically via `next.config.mjs`:

```javascript
// next.config.mjs
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  productionBrowserSourceMaps: true, // Optional: keeps maps on disk during build
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true, // Strips sourcemap URLs from client bundles for security
  disableLogger: true,
});

```

#### For Vite (`@sentry/vite-plugin`)

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sentryVitePlugin } from '@sentry/vite-plugin';

export default defineConfig({
  build: {
    sourcemap: 'hidden', // Generates maps for Sentry without exposing them publicly
  },
  plugins: [
    react(),
    sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        filesToDeleteAfterUpload: ['dist/**/*.map'], // Cleans up local maps after uploading
      },
    }),
  ],
});

```

---

### 2. Parse the Component Stack for Custom Fingerprinting

A component stack string contains the tree hierarchy (e.g., `\n in OrderSummary (at ...)\n in CheckoutPage (at ...)`). Extracting the top 2–3 component names provides a reliable fingerprint signature across minified bundles.

```typescript
// lib/sentry-utils.ts

export function parseTopComponentFromStack(componentStack?: string): string {
  if (!componentStack) return 'UnknownComponent';

  // Matches component identifiers: "in ComponentName" or "at ComponentName"
  const match = componentStack.match(/(?:at|in)\s+([A-Za-z0-9_$]+)/);
  return match ? match[1] : 'RootComponent';
}

export function extractComponentHierarchy(componentStack?: string): string[] {
  if (!componentStack) return [];

  const matches = [...componentStack.matchAll(/(?:at|in)\s+([A-Za-z0-9_$]+)/g)];
  return matches.slice(0, 3).map((m) => m[1]); // Take top 3 ancestor components
}

```

---

### 3. Sentry Initialization with `beforeSend` Fingerprinting

Configure `Sentry.init` to inspect the `extra.componentStack` attached by React 19 root error handlers:

```typescript
// sentry.client.config.ts / main.tsx
import * as Sentry from '@sentry/react';
import { extractComponentHierarchy, parseTopComponentFromStack } from '@/lib/sentry-utils';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,

  beforeSend(event, hint) {
    const error = hint.originalException;
    const componentStack = event.extra?.componentStack as string | undefined;

    if (componentStack) {
      const topComponent = parseTopComponentFromStack(componentStack);
      const hierarchy = extractComponentHierarchy(componentStack);
      const errorMessage = error instanceof Error ? error.message : 'UnknownError';

      // Attach high-value tags for dashboard filtering
      event.tags = {
        ...event.tags,
        failing_component: topComponent,
        component_hierarchy: hierarchy.join(' > '),
      };

      // ── Custom Fingerprinting Rule ──
      // Default: Sentry groups by {{ default }} (stack trace)
      // Custom: Group by Error Name + Top Component + Hierarchy
      event.fingerprint = [
        '{{ default }}',
        topComponent,
        ...hierarchy,
        errorMessage.replace(/0x[a-fA-F0-9]+/g, '<HEX>'), // Normalize memory/hash addresses
      ];
    }

    return event;
  },
});

```

---

### 4. Wiring with React 19 Root Handlers

Pass the raw `errorInfo.componentStack` directly into Sentry's capture pipeline from `createRoot` or `hydrateRoot`:

```tsx
// entry.client.tsx
import { createRoot } from 'react-dom/client';
import * as Sentry from '@sentry/react';
import App from './App';

const container = document.getElementById('root')!;

createRoot(container, {
  onCaughtError(error, errorInfo) {
    Sentry.captureException(error, {
      mechanism: {
        type: 'react.onCaughtError',
        handled: true,
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  },

  onUncaughtError(error, errorInfo) {
    Sentry.captureException(error, {
      mechanism: {
        type: 'react.onUncaughtError',
        handled: false,
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  },

  onRecoverableError(error, errorInfo) {
    Sentry.captureException(error, {
      level: 'info',
      mechanism: {
        type: 'react.onRecoverableError',
        handled: true,
      },
      tags: {
        error_class: 'hydration_recoverable',
      },
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
  },
}).render(<App />);

```

---

### Fingerprinting Comparison Matrix

| Scenario                                                  | Default Sentry Behavior                                            | With Component Stack Fingerprinting                                         |
| --------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| **Generic Invariant Error** (`Minified React error #310`) | All occurrences across the whole app merge into **1 giant issue**. | Grouped by **`#310 + <CheckoutButton>`**, **`#310 + <NavMenu>`**, etc.      |
| **Stream Chunk Rejection**                                | Merged under generic fetch failure.                                | Grouped under specific unwrapping component (e.g., **`<LiveRatesChart>`**). |
| **SSR Hydration Mismatch**                                | Lumped together under hydration warning.                           | Split by specific mismatching component subtree.                            |

---

### Best Practices

* **Normalize Dynamic Identifiers:** Strip dynamic runtime numbers (e.g., user IDs, UUIDs, timestamp hashes) from error messages before pushing them into the `fingerprint` array to avoid issue fragmentation.
* **Keep `{{ default }}` in the Fingerprint:** Prepending `'{{ default }}'` preserves Sentry’s core stack-trace grouping heuristic while narrowing it with component boundaries.
* **Use Hidden Source Maps in Production:** Always use `sourcemap: 'hidden'` (or `hideSourceMaps: true`) so sourcemap comments (`//# sourceMappingURL=...`) are not exposed to the public browser client.
