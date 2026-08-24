# Scenario: Auditing a small App Router project for anti-patterns

**Problem:** A team hands over the following small project (a blog with a comments feature) for a pre-launch review. Identify every anti-pattern present.

```tsx
// app/layout.tsx
'use client';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav><a href="/">Home</a> <a href="/blog">Blog</a></nav>
        {children}
      </body>
    </html>
  );
}

// app/blog/[slug]/page.tsx
'use client';
import { useState, useEffect } from 'react';

export default function BlogPost({ params }: { params: { slug: string } }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState(null);

  useEffect(() => {
    fetch(`/api/posts/${params.slug}`).then((r) => r.json()).then(setPost);
  }, [params.slug]);

  useEffect(() => {
    fetch(`/api/posts/${params.slug}/comments`).then((r) => r.json()).then(setComments);
  }, [params.slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <article>
      <img src={post.coverImageUrl} />
      <h1>{post.title}</h1>
      <div>{post.body}</div>
      <section>{comments?.map((c) => <p key={c.id}>{c.text}</p>)}</section>
    </article>
  );
}

// middleware.ts
export async function middleware(request) {
  const analytics = await fetch('https://analytics.example.com/log', {
    method: 'POST',
    body: JSON.stringify({ path: request.nextUrl.pathname }),
  });
  const post = await db.posts.findBySlug(request.nextUrl.pathname.split('/').pop());
  if (post?.isDraft) {
    return new Response('Not found', { status: 404 });
  }
}
```

**Approach:** Walk the codebase and flag each anti-pattern with its fix.

1. **`app/layout.tsx` unnecessarily `'use client'`** — the root layout has no interactivity or client-only API usage at all; it's `'use client'` for no discernible reason, forcing the entire app's tree into the client bundle. Fix: remove the directive; use plain `<a>` tags or (better) `next/link` for the nav, neither of which requires a Client Component wrapper at this level.
2. **`app/blog/[slug]/page.tsx` unnecessarily `'use client'` + `useEffect` fetch waterfall-adjacent pattern** — both `post` and `comments` are fetched client-side after mount, forcing a loading state and shipping fetch/state logic to the client for data that's known at request time and isn't personalized. Fix: convert to an `async` Server Component, `await`ing both fetches (ideally via `Promise.all` for true parallelism, or as separately Suspense-streamed sub-components if comments are expected to be slower than the main post).
3. **Raw `<img>` for the cover image** — no dimensions, no optimization, likely CLS and unnecessary bandwidth. Fix: `next/image` with explicit `width`/`height` and `priority` (it's almost certainly the LCP element on this page).
4. **Middleware doing real business logic** — a database query (`db.posts.findBySlug`) and a blocking analytics call both run in middleware, on every request matching its (unscoped — no `matcher`) path, adding real latency to every page load site-wide, not just blog posts, and coupling a DB call to the Edge Runtime's constraints. Fix: move the draft-check logic into the blog post page itself (a direct data check as part of the normal Server Component render, using `notFound()`), and move analytics logging out of the critical path entirely (client-side beacon, or an async fire-and-forget call from within a Route Handler that isn't awaited by the response).
5. **Missing `loading.tsx` and `error.tsx`** — no loading UI for the (currently client-fetched, but even after the Server Component fix, still non-instant) data fetch, and no error boundary scoping potential failures to the blog post route rather than the whole app shell. Fix: add both file-system convention files under `app/blog/[slug]/`.
6. **Middleware matcher missing entirely** — even setting aside what the middleware *does*, it has no `config.matcher`, so it runs on every request across the entire site, not just blog-related paths, multiplying the cost of every other issue in point 4.
