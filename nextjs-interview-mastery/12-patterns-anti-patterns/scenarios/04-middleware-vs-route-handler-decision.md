# Scenario: Deciding where A/B test bucketing logic should live

**Problem:** A growth team wants to run an A/B test on the homepage's hero layout. The proposed logic: check for an existing `experiment-bucket` cookie; if absent, randomly assign the visitor to "A" or "B", set the cookie, and pass the assignment down to the page so it can render the right variant. There's disagreement on the team about whether this belongs in middleware or in the page itself via a Route Handler / Server Component logic.

**Approach:** Apply the distinguishing question from the middleware-vs-Route-Handler anti-pattern: is this decision (a) needed *before* routing/rendering happens, (b) fast and stateless enough to run on every matching request without meaningfully adding latency, and (c) free of business logic that would be awkward or unsafe to run on the Edge Runtime? Bucket assignment via a cookie check and a random number generator satisfies all three — it's exactly the class of lightweight, request-shaping decision middleware exists for, unlike, say, writing the assignment to an analytics database synchronously (which would fail all three criteria and belongs elsewhere).

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const existing = request.cookies.get('experiment-bucket');
  if (existing) return NextResponse.next();

  const bucket = Math.random() < 0.5 ? 'A' : 'B';
  const response = NextResponse.next();
  response.cookies.set('experiment-bucket', bucket, { maxAge: 60 * 60 * 24 * 30 });
  return response;
}

export const config = {
  matcher: ['/'], // scoped ONLY to the homepage -- not every route
};
```

```tsx
// app/page.tsx (Server Component)
import { cookies } from 'next/headers';

export default async function HomePage() {
  const cookieStore = await cookies();
  const bucket = cookieStore.get('experiment-bucket')?.value ?? 'A';

  return bucket === 'B' ? <HeroVariantB /> : <HeroVariantA />;
}
```

Where the disagreement resolves: middleware handles *only* the assignment-and-persistence decision (fast, stateless, needs to happen before the page renders so the correct variant can be chosen without a client-side flash of the wrong version) — it does **not** log the assignment to an analytics backend synchronously, since that's exactly the kind of slower, potentially-failing external call that shouldn't block every homepage request. If the experiment's results need to be recorded server-side beyond just "which cookie value is set," that recording happens either fire-and-forget (not awaited) from the Server Component itself, or via a separate async call the client triggers, keeping the actual page render (and the middleware that gates it) fast and reliable.
