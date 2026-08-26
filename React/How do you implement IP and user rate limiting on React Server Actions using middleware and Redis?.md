Because Server Actions are public HTTP endpoints, they can be targeted by automated bots or brute-force requests.

You can rate limit Server Actions at two distinct layers:

1. **Edge/Middleware Layer:** Intercepts incoming HTTP requests with the `Next-Action` header (or POST actions) to block automated volumetric flooding by IP before the Server Component runtime even boots.
2. **Action/Application Layer:** Enforces per-user/per-session rate limits on specific business actions (e.g., password resets, comments, OTP verifications) using Redis (Upstash or self-hosted Redis with sliding window algorithms).

---

### 1. Configure the Redis Client & Rate Limiter

Using the **Sliding Window Counter** algorithm prevents burst traffic around fixed window boundaries.

```typescript
// lib/ratelimit.ts
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// General IP rate limiter for middleware: 100 requests per 10 seconds
export const globalActionLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '10 s'),
  prefix: 'rl:global_actions',
  analytics: true,
});

// Strict per-user limiter for sensitive business actions: 5 attempts per 1 minute
export const sensitiveActionLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  prefix: 'rl:sensitive_actions',
});

```

---

### 2. Middleware Layer: Global IP Rate Limiting for All Server Actions

Next.js and RSC runtimes tag JavaScript-initiated Server Actions with the `Next-Action` HTTP header. For progressive enhancement (native HTML forms), inspection is performed on `POST` requests.

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { globalActionLimiter } from '@/lib/ratelimit';

export async function middleware(request: NextRequest) {
  const isServerAction =
    request.headers.has('next-action') ||
    (request.method === 'POST' && request.headers.get('content-type')?.includes('multipart/form-data'));

  // Only apply this guard to Server Action invocations
  if (isServerAction) {
    // Resolve true client IP behind reverse proxies/CDNs
    const ip =
      request.headers.get('cf-connecting-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    const { success, limit, remaining, reset } = await globalActionLimiter.limit(ip);

    if (!success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests. Please slow down.',
          retryAfter: Math.ceil((reset - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': reset.toString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match dynamic routes and exclude static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

```

---

### 3. Action Layer: Per-User Fine-Grained Rate Limiting

For user-specific actions (e.g., submitting posts or resetting passwords), limit against the **authenticated User ID** rather than the IP address (which can be shared across corporate VPNs or NAT gateways).

```typescript
// app/actions/comments.ts
'use server';

import { auth } from '@/lib/auth';
import { sensitiveActionLimiter } from '@/lib/ratelimit';
import { headers } from 'next/headers';
import db from '@/lib/db';

export async function createCommentAction(prevState: any, formData: FormData) {
  // 1. Authenticate user
  const session = await auth();
  const headersList = await headers();

  // Identifier: Prefer User ID; fallback to IP for guest users
  const identifier =
    session?.user?.id ||
    headersList.get('cf-connecting-ip') ||
    headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
    'anonymous';

  // 2. Check sliding window limit in Redis
  const { success, reset } = await sensitiveActionLimiter.limit(
    `comment:${identifier}`
  );

  if (!success) {
    const waitSeconds = Math.ceil((reset - Date.now()) / 1000);
    return {
      status: 'error',
      error: `You are posting too quickly. Please wait ${waitSeconds}s before trying again.`,
    };
  }

  // 3. Process business logic
  const commentText = formData.get('comment') as string;
  if (!commentText?.trim()) {
    return { status: 'error', error: 'Comment text cannot be empty.' };
  }

  const savedComment = await db.comment.create({
    data: {
      text: commentText,
      userId: session?.user?.id,
    },
  });

  return {
    status: 'success',
    data: savedComment,
  };
}

```

---

### 4. Custom Sliding Window Redis Lua Script (Self-Hosted Alternative)

If not using Upstash, implement the sliding window counter directly via Redis `ZADD` and `ZREMRANGEBYSCORE` in a Lua script:

```lua
-- sliding_window.lua
-- KEYS[1]: Rate limit key (e.g., "ratelimit:user_123")
-- ARGV[1]: Current timestamp in ms
-- ARGV[2]: Window size in ms (e.g., 60000 for 1m)
-- ARGV[3]: Max requests allowed in window

local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local max_requests = tonumber(ARGV[3])
local clear_before = now - window

-- 1. Remove expired timestamps outside sliding window
redis.call('ZREMRANGEBYSCORE', key, 0, clear_before)

-- 2. Count current hits within window
local current_requests = redis.call('ZCARD', key)

if current_requests < max_requests then
    -- 3. Record new hit and set TTL
    redis.call('ZADD', key, now, now)
    redis.call('PEXPIRE', key, window)
    return {1, max_requests - current_requests - 1} -- {Allowed: true, Remaining}
else
    return {0, 0} -- {Allowed: false, Remaining}
end

```

---

### Security & Architecture Comparison

| Guard Level            | Identifier Used                                    | Primary Purpose                                                                | Cost to Server                                                         |
| ---------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Edge Middleware**    | Client IP (`cf-connecting-ip` / `x-forwarded-for`) | Blocks DDoS, scraping bots, and brute force sweeps.                            | **Ultra-low:** Drops requests before loading React/DB runtimes.        |
| **Action / App Layer** | Authenticated User ID (`session.user.id`)          | Enforces fair-use limits and stops automated account spam across IP rotations. | **Low:** Verifies session token and performs $O(\log N)$ Redis lookup. |

---

### Production Best Practices

* **Fail-Open vs. Fail-Closed:** If your Redis instance experiences an outage, determine whether to allow requests (fail-open for high availability) or block actions (fail-closed for high security like payment processing) inside a `try/catch` block.
* **Identify Behind Trusted Proxies:** Always configure your web server or hosting platform (Vercel, Cloudflare, AWS ALB) to strip and override spoofed `X-Forwarded-For` headers from untrusted clients.
* **Combine with React 19 `useActionState`:** When returning a `429` status from an Action, return structured `{ status: 'error', error: 'Too many requests' }` objects so the client form displays the cooldown timer gracefully without triggering an uncaught Error Boundary.
