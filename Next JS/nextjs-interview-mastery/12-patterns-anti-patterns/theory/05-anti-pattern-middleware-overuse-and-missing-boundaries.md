# Anti-Patterns: Overusing Middleware, and Missing Loading/Error Boundaries

Two smaller but very common anti-patterns rounding out this topic — both are about *not using the right built-in mechanism* for a job, either by reaching for a tool that's too broad (middleware) or by skipping a mechanism that costs almost nothing to add (route-level boundaries).

## Overusing middleware for logic that belongs in a Route Handler

```ts
// middleware.ts — BEFORE: doing real business logic here
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === '/api/orders' && request.method === 'POST') {
    const body = await request.json();
    const order = await db.orders.create(body); // heavy DB write, in middleware
    await sendConfirmationEmail(order); // external API call, in middleware
    return NextResponse.json(order);
  }
  return NextResponse.next();
}
```

Middleware runs on the Edge Runtime for *every matching request*, before routing even resolves to a page or Route Handler — it's designed for lightweight, fast decisions: auth gating, redirects, header manipulation, A/B test bucketing, geolocation-based routing. Putting genuine business logic (database writes, calling third-party APIs, complex validation) in middleware couples that logic to Edge Runtime constraints (no Node-native DB drivers in many cases), makes it harder to test in isolation (middleware has a different invocation model than a Route Handler), and can silently slow down *every single request* that matches the middleware's path matcher, including ones that don't need this logic at all if the matcher is too broad.

```ts
// middleware.ts — AFTER: middleware does only what middleware should
export async function middleware(request: NextRequest) {
  const isAuthed = Boolean(request.cookies.get('session'));
  if (!isAuthed && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

// app/api/orders/route.ts — the actual business logic, in a Route Handler
export async function POST(request: Request) {
  const body = await request.json();
  const order = await db.orders.create(body);
  await sendConfirmationEmail(order);
  return Response.json(order);
}
```

## Missing loading/error boundaries

```
// BEFORE — no loading.tsx, no error.tsx anywhere in this route segment
app/
  dashboard/
    page.tsx    <- does a slow data fetch, no fallback UI
```

Without a `loading.tsx`, navigating to a route with a slow data fetch shows nothing — no visual feedback, no skeleton — until the entire page's data resolves, which reads to users as the app being frozen or broken, especially on a slow connection. Without an `error.tsx`, an unhandled error during rendering or data fetching crashes the *entire* application shell (or at minimum a very broad section of it) rather than being contained to just the failing route segment, taking down shared UI (navigation, sidebars) that had nothing to do with the failure.

```
// AFTER
app/
  dashboard/
    page.tsx
    loading.tsx    <- automatic Suspense fallback while page.tsx's data resolves
    error.tsx        <- Client Component Error Boundary scoped to this segment
```

```tsx
// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return <DashboardSkeleton />;
}

// app/dashboard/error.tsx
'use client'; // error.tsx must be a Client Component -- it uses interactive state/handlers
export default function DashboardError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <p>Something went wrong loading the dashboard.</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

Both files are pure file-system conventions — no extra wiring, no manual `<Suspense>`/`<ErrorBoundary>` component authoring required at the call site — which is exactly why omitting them is an anti-pattern rather than a reasonable tradeoff: the cost of adding them is close to zero, and the UX and blast-radius benefit is substantial, especially as an app grows enough nested routes that an unguarded failure anywhere becomes a matter of when, not if.
