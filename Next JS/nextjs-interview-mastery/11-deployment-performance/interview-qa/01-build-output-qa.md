# Interview Q&A: Build Output Types

**Q: What are the two main build output modes in Next.js, and what's the fundamental difference?**
A: Node.js server output (the default) runs on a live server process and supports the full feature set — Server Components fetching at request time, Route Handlers, ISR, Middleware. Static export (`output: 'export'`) produces plain static HTML/CSS/JS with no server requirement, but every page must be fully resolvable at build time — no request-time computation of any kind.

**Q: Name three things that don't work under static export.**
A: Any of: request-time Server Component data (reading `cookies()`, `headers()`, or `searchParams`), Route Handlers that do dynamic server-side work, ISR/on-demand revalidation, Middleware, and the built-in `next/image` optimization API (requires `images: { unoptimized: true }` or a third-party loader instead).

**Q: Can you mix static export with a few dynamic routes in the same deployment?**
A: No — `output: 'export'` is an all-or-nothing setting for the entire app. There's no per-route opt-out; if even one route needs server-side dynamic behavior, the whole app can't use static export as configured, and that route (or the whole app) needs a different deployment target.

**Q: A team wants to add a server-rendered contact form to a statically exported marketing site without giving up static export for everything else. What's a viable approach?**
A: Keep the static site as-is and handle the form submission via a resource that isn't part of the Next.js build at all — a separately deployed serverless function/API, or a third-party form-backend service — called via client-side `fetch` from the static page. This works because the constraint is specifically "no server-side dynamic behavior *within the Next.js build*," not "the page can't call any external dynamic service."
