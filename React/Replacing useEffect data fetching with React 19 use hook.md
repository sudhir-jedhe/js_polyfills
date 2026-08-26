In React 19, the new **`use()` API** lets you read the value of a Promise (or a Context) directly inside the render phase. When paired with `<Suspense>` and `<ErrorBoundary>`, it completely replaces boilerplate-heavy `useEffect` data fetching.

---

### The Problem with `useEffect` Fetching vs. `use()`

```
The Old Way (useEffect):
[Component Mounts] ──▶ Paints Empty/Loading ──▶ Fires Effect ──▶ Awaits Data ──▶ setState ──▶ Re-renders (Waterfall)
- Requires 3 state variables: data, isLoading, error
- Prone to race conditions and memory leak cleanup boilerplate

The React 19 Way (use):
[Parent / Server initiates Promise] ──▶ Component consumes `use(promise)` ──▶ Suspends until resolved
- Zero local loading/error state boilerplate
- Handled natively by `<Suspense>` and `<ErrorBoundary>`

```

---

### 1. Traditional `useEffect` Data Fetching (The Old Pattern)

```tsx
// ❌ Old boilerplate: manual state management, race condition guards
function UserProfileOld({ userId }: { userId: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    fetchUser(userId)
      .then((data) => {
        if (!ignore) setUser(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [userId]);

  if (loading) return <div>Loading user...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return null;

  return <div><h1>{user.name}</h1><p>{user.email}</p></div>;
}

```

---

### 2. React 19 `use()` Hook Pattern (The Modern Pattern)

With `use()`, the component unwraps the Promise directly. Loading states are delegated to `<Suspense>` and errors are caught by an Error Boundary.

```tsx
'use client';

import { use, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface User {
  id: string;
  name: string;
  email: string;
}

// 1. Data-consuming Client Component
function UserDetails({ userPromise }: { userPromise: Promise<User> }) {
  // `use` unwraps the promise value directly during render
  const user = use(userPromise);

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">{user.name}</h2>
      <p className="text-gray-600">{user.email}</p>
    </div>
  );
}

// 2. Parent / Wrapper managing Suspense & Error Boundaries
export function UserProfile({ userId }: { userId: string }) {
  // Initiate the Promise outside or pass from Server Component / cache
  const userPromise = fetchUser(userId);

  return (
    <ErrorBoundary fallback={<div>Failed to load profile.</div>}>
      <Suspense fallback={<div>Loading user details...</div>}>
        <UserDetails userPromise={userPromise} />
      </Suspense>
    </ErrorBoundary>
  );
}

```

---

### 3. Key Differences: `use()` vs Standard React Hooks

Unlike all other React hooks (`useState`, `useEffect`, `useMemo`), **`use()` is not bound to the strict Rules of Hooks**:

* **Can be called conditionally:** You can safely call `use(promise)` inside `if` statements, `switch` blocks, and loops.
* **Can be called after early returns:**

```tsx
function ConditionalData({
  detailsPromise,
  shouldShowDetails,
}: {
  detailsPromise: Promise<string>;
  shouldShowDetails: boolean;
}) {
  if (!shouldShowDetails) {
    return <div>Click expand to view details.</div>;
  }

  // ✅ VALID with `use()` — completely illegal with standard hooks like useEffect/useState
  const details = use(detailsPromise);

  return <div>{details}</div>;
}

```

---

### 4. Preventing Infinite Re-fetch Loops (Promise Caching)

> **Critical Rule:** Never instantiate a new `fetch()` promise directly inside the body of a client component without caching it. Creating a promise on every render will cause an infinite loop because a new promise reference causes the component to suspend repeatedly.

#### Safe Patterns for Passing Promises

**Pattern A: Pass Promise from a Server Component to a Client Component (Recommended)**

```tsx
// Page.server.tsx (Server Component)
import { UserDetails } from './UserDetails'; // Client Component

export default function Page({ params }: { params: { id: string } }) {
  // Promise starts on the server and streams to the client
  const userPromise = fetchUserData(params.id);

  return (
    <Suspense fallback={<p>Loading user...</p>}>
      <UserDetails userPromise={userPromise} />
    </Suspense>
  );
}

```

**Pattern B: Cache in a Client-Side Store or Resource Map**

```tsx
// lib/userCache.ts
const cache = new Map<string, Promise<User>>();

export function getUser(id: string): Promise<User> {
  if (!cache.has(id)) {
    cache.set(id, fetch(`/api/users/${id}`).then((res) => res.json()));
  }
  return cache.get(id)!;
}

```

---

### Comparison Matrix

| Feature                        | `useEffect` Fetching                                           | React 19 `use(promise)`                                    |
| ------------------------------ | -------------------------------------------------------------- | ---------------------------------------------------------- |
| **Render Phase**               | After initial render (causes layout shifts/flashes).           | **During render** (suspends until data is ready).          |
| **State Boilerplate**          | Requires manual `useState` for data, loading, and error.       | **Zero boilerplate** (handled by Suspense/Error Boundary). |
| **Race Conditions**            | Requires cleanup flags (`ignore = true`) or abort controllers. | **Handled natively** by React transitions and promises.    |
| **Conditional Calling**        | ❌ Forbidden by Rules of Hooks.                                 | ✅ **Allowed** inside `if` blocks and loops.                |
| **Server-to-Client Streaming** | ❌ No direct integration.                                       | ✅ Streams unresolved promises from RSC to client.          |
