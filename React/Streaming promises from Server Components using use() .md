In modern React (React 19 & Next.js App Router), you can initiate an asynchronous data fetch inside a **Server Component** and pass the **unresolved Promise** directly as a prop to a **Client Component**.

The Client Component unwraps the Promise using the **`use()` hook** inside a `<Suspense>` boundary.

---

### How the Architecture Works

Instead of awaiting data on the server (which can block the initial HTML stream) or running `useEffect` fetches in the client (which creates request waterfalls), React streams the in-flight Promise over the network:

```
[1. Server Component (RSC)]
     ├── Initiates DB/API fetch: `const promise = fetchUserDetails()` (NOT awaited)
     └── Streams initial HTML Shell + Flight payload with unresolved Promise pointer ($@1)
            │
            ▼ (HTTP Stream)
[2. Client Browser]
     ├── Receives HTML Shell immediately (Fast First Contentful Paint)
     ├── `<Suspense fallback={<Skeleton />}>` renders the loading fallback
     └── Client Component consumes `use(promise)`
            │
            ▼ (Data resolves on server)
[3. Server streams resolved chunk ($1)] ──▶ Client resolves Promise ──▶ UI renders

```

---

### Step 1: Pass the In-Flight Promise from a Server Component

Do **not** `await` the async call in the Server Component. Pass the raw Promise down as a prop:

```tsx
// app/users/[id]/page.tsx (Server Component - default)
import { Suspense } from 'react';
import { UserProfileClient } from './UserProfileClient';
import { fetchUserDetails } from '@/lib/api';

interface PageProps {
  params: Promise<{ id: string }>; // In Next.js, params is an async Promise
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // 1. Kick off the fetch, but do NOT `await` it here!
  const userPromise = fetchUserDetails(id);

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Account Overview</h1>

      {/* 2. Wrap the consumer in a Suspense boundary */}
      <Suspense fallback={<ProfileSkeleton />}>
        <UserProfileClient userPromise={userPromise} />
      </Suspense>
    </main>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-3 p-4 border rounded-lg">
      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>
  );
}

```

---

### Step 2: Unwrap the Promise in the Client Component with `use()`

The Client Component uses React 19's `use()` hook to resolve the value directly during render:

```tsx
// app/users/[id]/UserProfileClient.tsx
'use client';

import { use } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function UserProfileClient({
  userPromise,
}: {
  userPromise: Promise<User>;
}) {
  // `use` unwraps the streamed Promise. 
  // If the promise is pending, React suspends this component and shows the Suspense fallback.
  const user = use(userPromise);

  return (
    <div className="p-4 border rounded-lg shadow-sm space-y-2">
      <h2 className="text-xl font-semibold">{user.name}</h2>
      <p className="text-sm text-gray-600">{user.email}</p>
      <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
        {user.role}
      </span>
    </div>
  );
}

```

---

### What Happens on the React Flight Wire Format

When an unresolved Promise is passed across the server-to-client boundary, React's Flight serializer outputs a pointer tag:

1. **Initial Shell Payload:**

```
0:["$","$L1",null,{"fallback":["$","div",null,{"children":"Loading..."}],"children":["$","$L2",null,{"userPromise":"$@3"}]}]

```

* `"$@3"` tells the client that `userPromise` is a pending Promise bound to chunk ID `3`.

1. **When the Server Fetch Resolves:**
The server flushes chunk `3` down the open HTTP stream:

```
3:{"id":"101","name":"Alex Jedhe","email":"alex@example.com","role":"Admin"}

```

1. The client runtime resolves `userPromise` with the parsed object, triggers the Suspense boundary to swap out the fallback, and renders `<UserProfileClient/>`.

---

### Why This Pattern Beats `useEffect` and Server-Side `await`

| Pattern                                               | Initial Shell Delivery               | Data Request Waterfall                                    | Client Bundle Size                                      |
| ----------------------------------------------------- | ------------------------------------ | --------------------------------------------------------- | ------------------------------------------------------- |
| **Awaiting in Server Component (`await fetch(...)`)** | ❌ Blocked until slow API finishes.   | ✅ Single server hop.                                      | ✅ 0 KB.                                                 |
| **Client-Side `useEffect` Fetching**                  | ✅ Fast Shell.                        | ❌ Waterfall (Download JS ➔ Mount ➔ Fetch ➔ Render).       | ❌ Larger bundle.                                        |
| **Server-Initiated Stream with `use()**`              | ✅ **Fast Shell (Paints instantly).** | ✅ **Zero client waterfall (Fetched parallel with HTML).** | ✅ **Minimal bundle (No data-fetching library needed).** |

---

### Key Best Practices

* **Always wrap in `<Suspense>`:** Any component calling `use(promise)` will suspend if the Promise is not yet resolved. Without a `<Suspense>` boundary above it, the entire page tree will suspend up to the root.
* **Catch Errors with Error Boundaries:** If the server Promise rejects, `use()` throws the error into the nearest React Error Boundary:

```tsx
<ErrorBoundary fallback={<p className="text-red-500">Failed to load user.</p>}>
  <Suspense fallback={<ProfileSkeleton />}>
    <UserProfileClient userPromise={userPromise} />
  </Suspense>
</ErrorBoundary>

```

* **No Re-fetching on Re-renders:** Because the Promise reference originates from the Server Component's render pass, passing it as a prop prevents the re-fetch loops common when creating promises inside client renders.
