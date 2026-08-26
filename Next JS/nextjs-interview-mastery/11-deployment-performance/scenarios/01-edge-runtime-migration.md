# Scenario: Migrating an auth-check middleware-adjacent route to Edge for global latency

**Problem:** A SaaS product has users worldwide, and a Route Handler at `/api/session/validate` — called on nearly every page load to check auth state — is deployed only in a single Node.js region (us-east). Users in Asia and Europe see a consistent 200-400ms latency tax on this call alone, purely from network round-trip distance, even though the handler's actual logic (verify a JWT, check an expiry, return a boolean) is trivial and fast once it runs.

**Approach:** Migrate the route to the Edge Runtime so it's deployed to a global edge network rather than a single region, and audit its dependencies first to confirm nothing requires Node-native APIs.

```ts
// Before: app/api/session/validate/route.ts (Node.js runtime, single region)
import jwt from 'jsonwebtoken'; // uses Node's crypto module internally in some versions

export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token!, process.env.JWT_SECRET!);
    return Response.json({ valid: true, userId: payload.sub });
  } catch {
    return Response.json({ valid: false }, { status: 401 });
  }
}
```

```ts
// After: app/api/session/validate/route.ts (Edge runtime, global)
export const runtime = 'edge';

import { jwtVerify } from 'jose'; // Web Crypto-based, Edge-compatible JWT library

export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  try {
    const { payload } = await jwtVerify(token!, secret);
    return Response.json({ valid: true, userId: payload.sub });
  } catch {
    return Response.json({ valid: false }, { status: 401 });
  }
}
```

The key migration step wasn't just adding `export const runtime = 'edge'` — the original `jsonwebtoken` library depends on Node's `crypto` module in some code paths and isn't reliably Edge-compatible, so it had to be swapped for `jose`, a JWT library built on the Web Crypto API that works identically on both runtimes. This is the general pattern for Edge migrations: the runtime flag itself is a one-line change, but the actual work is verifying (and sometimes replacing) every dependency the handler touches. Post-migration, this endpoint executes in the region physically nearest each user, cutting the network round-trip component of its latency dramatically, while cold-start time also drops due to the lighter Edge isolate model versus a full Node.js process.
