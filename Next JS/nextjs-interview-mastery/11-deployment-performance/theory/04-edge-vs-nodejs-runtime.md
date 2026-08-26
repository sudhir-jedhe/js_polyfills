# Edge Runtime vs. Node.js Runtime

Next.js lets individual Route Handlers, Middleware, and pages opt into running on either the standard Node.js runtime or the **Edge Runtime** — a lighter, more restricted JavaScript environment. Choosing correctly requires understanding what you're trading away, not just which one is "faster."

## Declaring the runtime

```ts
// app/api/geo/route.ts
export const runtime = 'edge'; // opt into Edge Runtime for this route

export async function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country');
  return Response.json({ country });
}
```

Without this export, a Route Handler runs on the Node.js runtime by default. Middleware, by contrast, **always** runs on the Edge Runtime — there's no opt-out, which is worth knowing since it constrains what's safe to write inside `middleware.ts` regardless of preference.

## Why Edge is faster (in the ways that matter)

The Edge Runtime is built on a minimal, V8-isolate-based execution model (conceptually similar to what Cloudflare Workers or Deno Deploy use) rather than spinning up a full Node.js process. This gives it two concrete advantages: **cold-start latency is dramatically lower** (isolates start in single-digit milliseconds rather than the hundreds of milliseconds a Node.js cold start can take), and **it runs physically closer to the end user** — Edge functions are deployed to a global network of regional locations rather than a single (or few) origin region(s), cutting round-trip latency for geographically distributed users.

## What Edge gives up

This is the tradeoff side interviewers want articulated precisely: the Edge Runtime implements a **subset** of standard Web APIs (`fetch`, `Request`, `Response`, `Headers`, Web Crypto, `URL`) but has **no access to Node.js-native APIs** — no `fs` (filesystem), no `net`/`tls` raw sockets, no native Node modules that rely on C++ bindings (many database drivers, image-processing libraries, and some ORMs fall into this category), and generally a smaller npm package compatibility surface, since packages written assuming a full Node.js environment often fail at import time or at runtime on Edge.

```ts
// app/api/report/route.ts
export const runtime = 'edge';

export async function GET() {
  const fs = require('fs'); // throws / fails to resolve on Edge Runtime
  const data = fs.readFileSync('/tmp/report.csv');
  return new Response(data);
}
```

Attempting to use a Node-only API on Edge fails at build time in many cases (a bundler error that the module can't be resolved for the Edge target) or at runtime with a clear "Module not found" / "X is not a function" style error — it doesn't silently degrade, but it does mean the failure surfaces at the moment you add that dependency, not necessarily during initial route setup.

## When to choose which

- **Edge**: latency-sensitive, lightweight logic close to the request — auth checks, A/B test bucketing, geolocation-based redirects, simple header manipulation, streaming proxies to another API. Middleware is forced into this category by definition.
- **Node.js**: anything needing a database driver with native bindings, file system access, heavier compute (image processing, PDF generation), or a large npm dependency tree not verified Edge-compatible. Most typical CRUD Route Handlers backed by a traditional ORM/database client still need Node.js.

The interview-ready framing: Edge trades a full-featured runtime for speed and locality; the right choice depends on whether the specific handler's dependencies can survive that trade, not on a blanket "Edge is always better because it's faster" assumption.
