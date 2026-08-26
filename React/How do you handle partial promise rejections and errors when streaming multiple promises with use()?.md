When streaming multiple parallel promises, handling partial failures is critical so that a failure in one non-essential data source does not crash the entire page or bring down sibling components.

In React 19, you handle partial rejections using three primary strategies depending on your architectural needs:

---

### Strategy 1: Isolated Error Boundaries per `<Suspense>` Slot (Recommended)

Wrap each parallel data stream in its own `<ErrorBoundary>` alongside its `<Suspense>` boundary. If one promise rejects, `use()` throws the rejection directly into the nearest Error Boundary, leaving sibling components unaffected.

```tsx
// app/dashboard/page.tsx (Server Component)
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AnalyticsWidget } from './AnalyticsWidget';
import { NotificationsWidget } from './NotificationsWidget';
import { fetchAnalytics, fetchNotifications } from '@/lib/api';

export default function DashboardPage() {
  // Fire both promises concurrently on the server
  const analyticsPromise = fetchAnalytics();
  const notificationsPromise = fetchNotifications(); // If this fails, only widget B degrades

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Stream 1: Analytics */}
      <ErrorBoundary fallback={<ErrorCard title="Analytics failed to load" />}>
        <Suspense fallback={<CardSkeleton title="Loading Analytics..." />}>
          <AnalyticsWidget dataPromise={analyticsPromise} />
        </Suspense>
      </ErrorBoundary>

      {/* Stream 2: Notifications */}
      <ErrorBoundary fallback={<ErrorCard title="Notifications unavailable" />}>
        <Suspense fallback={<CardSkeleton title="Loading Notifications..." />}>
          <NotificationsWidget dataPromise={notificationsPromise} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

```

```tsx
// app/dashboard/NotificationsWidget.tsx (Client Component)
'use client';

import { use } from 'react';

export function NotificationsWidget({ dataPromise }: { dataPromise: Promise<string[]> }) {
  // If `dataPromise` rejects on the server, `use` throws to the surrounding ErrorBoundary
  const notifications = use(dataPromise);

  return (
    <div>
      <h3>Notifications</h3>
      <ul>{notifications.map((n, i) => <li key={i}>{n}</li>)}</ul>
    </div>
  );
}

```

---

### Strategy 2: Server-Side `catch()` Fallback (Soft Degradation)

If a stream is optional and you prefer to handle fallback data without rendering an Error Boundary UI, attach `.catch()` to the Promise on the server before passing it to the client:

```tsx
// app/profile/page.tsx (Server Component)
export default function ProfilePage({ userId }: { userId: string }) {
  const profilePromise = fetchProfile(userId);

  // Catch rejection on server and supply safe default data
  const badgesPromise = fetchBadges(userId).catch((error) => {
    console.error('Non-critical badges fetch failed:', error);
    return [] as Badge[]; // Safe fallback value
  });

  return (
    <main>
      <Suspense fallback={<p>Loading Profile...</p>}>
        <ProfileView profilePromise={profilePromise} />
      </Suspense>

      <Suspense fallback={<p>Loading Badges...</p>}>
        <BadgesView badgesPromise={badgesPromise} />
      </Suspense>
    </main>
  );
}

```

Because `.catch()` transforms the rejected Promise into a resolved Promise holding `[]`, `use(badgesPromise)` will unwrap the array cleanly instead of throwing.

---

### Strategy 3: Result Tuple Pattern with `Promise.allSettled`

When multiple promises are consumed inside a **single** Client Component and you need to inspect the status of each individual operation (e.g., in a consolidated data-sync dashboard):

#### Server Component

```tsx
// app/system-status/page.tsx (Server Component)
import { Suspense } from 'react';
import { StatusDashboard } from './StatusDashboard';
import { checkDbHealth, checkRedisHealth } from '@/lib/health';

export default function Page() {
  // Use Promise.allSettled to guarantee the outer promise never rejects
  const healthPromise = Promise.allSettled([
    checkDbHealth(),
    checkRedisHealth(),
  ]);

  return (
    <Suspense fallback={<p>Inspecting services...</p>}>
      <StatusDashboard healthPromise={healthPromise} />
    </Suspense>
  );
}

```

#### Client Component

```tsx
// app/system-status/StatusDashboard.tsx
'use client';

import { use } from 'react';

export function StatusDashboard({
  healthPromise,
}: {
  healthPromise: Promise<[PromiseSettledResult<{ db: string }>, PromiseSettledResult<{ redis: string }>]>;
}) {
  const [dbResult, redisResult] = use(healthPromise);

  return (
    <div className="space-y-4">
      <div>
        <strong>Database: </strong>
        {dbResult.status === 'fulfilled' ? (
          <span className="text-green-600">Online ({dbResult.value.db})</span>
        ) : (
          <span className="text-red-600">Offline ({dbResult.reason.message})</span>
        )}
      </div>

      <div>
        <strong>Redis: </strong>
        {redisResult.status === 'fulfilled' ? (
          <span className="text-green-600">Online ({redisResult.value.redis})</span>
        ) : (
          <span className="text-red-600">Offline ({redisResult.reason.message})</span>
        )}
      </div>
    </div>
  );
}

```

---

### Comparison of Error Handling Strategies

| Strategy                   | Failure Blast Radius                        | UI State on Error                                                 | Best Suited For                                          |
| -------------------------- | ------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------- |
| **Granular ErrorBoundary** | Isolated to that specific component slot.   | Renders custom fallback component or error alert.                 | Independent widgets, distinct dashboard cards.           |
| **Server `.catch()**`      | None (Promise resolves with fallback data). | Renders standard UI populated with empty/default state.           | Non-critical enhancements (recommendations, badges).     |
| **`Promise.allSettled`**   | None (Outer promise always fulfills).       | Custom conditional UI per item state (`fulfilled` vs `rejected`). | Tightly coupled multi-source metrics or health monitors. |
