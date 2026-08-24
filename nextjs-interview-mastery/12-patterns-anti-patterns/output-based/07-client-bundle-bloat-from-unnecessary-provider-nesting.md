# Why does a "just for one page" context provider bloat every route's bundle?

```tsx
// app/layout.tsx
import { AnalyticsProvider } from './analytics-provider'; // 'use client', wraps a heavy SDK
import { FeatureFlagsProvider } from './feature-flags-provider'; // 'use client'
import { CheckoutProvider } from './checkout-provider'; // 'use client', only actually used on /checkout

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          <FeatureFlagsProvider>
            <CheckoutProvider>{children}</CheckoutProvider>
          </FeatureFlagsProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
```

`CheckoutProvider` wraps a fairly large third-party payment SDK and is only ever actually consumed by components under `/checkout/*`. A bundle analysis shows every route in the app — including the marketing homepage — pays for that SDK's bundle weight.

**Answer:** Because `CheckoutProvider` is mounted in the **root layout**, which wraps every single page in the app, its client bundle (including the payment SDK it initializes) is loaded for every route, whether or not that route ever touches checkout functionality. Even though `AnalyticsProvider` and `FeatureFlagsProvider` might genuinely need to be global (analytics and flags plausibly apply everywhere), `CheckoutProvider` doesn't share that requirement — it's scoped to one feature area, not the whole app, yet it's paying the "runs everywhere" tax anyway.

**Why:** Context providers placed in a root layout are a common, easy-to-miss version of the "unnecessarily wide `use client` boundary" anti-pattern — it's not that the provider itself shouldn't be a Client Component (context inherently requires client-side React), but that its **mounting location** determines its blast radius on bundle size, independent of whether its logic is used on a given page. The fix is scoping the provider to only the layout that actually needs it:

```tsx
// app/checkout/layout.tsx -- scoped to /checkout/* only
import { CheckoutProvider } from './checkout-provider';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <CheckoutProvider>{children}</CheckoutProvider>;
}

// app/layout.tsx -- root layout no longer includes CheckoutProvider
import { AnalyticsProvider } from './analytics-provider';
import { FeatureFlagsProvider } from './feature-flags-provider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsProvider>
          <FeatureFlagsProvider>{children}</FeatureFlagsProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
```

Because the App Router's code-splitting is per-route-segment, moving `CheckoutProvider` into a nested layout under `app/checkout/` means its bundle (SDK included) is only fetched when a user actually navigates into `/checkout/*` — every other route stops paying for it entirely. The general lesson: when auditing bundle size, check not just *which* providers/components are Client Components, but *where in the layout tree* they're mounted, since that placement directly determines which routes inherit their cost.
