# Pages Router vs. App Router: A Real Comparison

Plenty of production jobs still run on the Pages Router — either legacy codebases not yet migrated, or teams who made a deliberate choice to stay on it. Knowing the mapping between the two data-fetching models cold is a practical interview skill, not just App Router trivia.

## Data fetching: the direct mapping

| Pages Router | App Router equivalent |
|---|---|
| `getServerSideProps` | `async` Server Component with a `fetch` using `{ cache: 'no-store' }` (or no `next` cache options) |
| `getStaticProps` | `async` Server Component with a cached `fetch` (`{ next: { revalidate: N } }`) |
| `getStaticPaths` | `generateStaticParams()` |
| `getInitialProps` (legacy, both routers) | Generally avoid in both; use `getServerSideProps`-equivalent patterns instead |

```tsx
// Pages Router: pages/posts/[slug].tsx
export async function getServerSideProps({ params }) {
  const post = await fetch(`https://api.example.com/posts/${params.slug}`).then((r) => r.json());
  return { props: { post } };
}
export default function PostPage({ post }) {
  return <Post post={post} />;
}
```

```tsx
// App Router equivalent: app/posts/[slug]/page.tsx
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetch(`https://api.example.com/posts/${slug}`, {
    cache: 'no-store', // equivalent of getServerSideProps: always fresh, per-request
  }).then((r) => r.json());
  return <Post post={post} />;
}
```

```tsx
// Pages Router: getStaticProps + getStaticPaths (SSG + ISR)
export async function getStaticPaths() {
  const posts = await getRecentPosts(5);
  return { paths: posts.map((p) => ({ params: { slug: p.slug } })), fallback: 'blocking' };
}
export async function getStaticProps({ params }) {
  const post = await getPost(params.slug);
  return { props: { post }, revalidate: 3600 };
}
```

```tsx
// App Router equivalent
export async function generateStaticParams() {
  const posts = await getRecentPosts(5);
  return posts.map((p) => ({ slug: p.slug }));
}
export const revalidate = 3600;
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <Post post={post} />;
}
```

The Pages Router's `fallback: 'blocking'` (render on-demand for paths not in `getStaticPaths`, blocking the response until ready) maps conceptually to the App Router's default `dynamicParams = true` behavior; `fallback: false` (404 for unlisted paths) maps to `dynamicParams = false`.

## Structural differences beyond data fetching

- **Layouts**: Pages Router layouts are a manual convention (a `_app.tsx` wrapper, or a per-page `getLayout` pattern) — there's no file-system-enforced nesting. App Router layouts (`layout.tsx`) are a first-class routing primitive with automatic nesting and persistence across navigations.
- **Loading/error states**: Pages Router requires manual loading state management (or a library) per page. App Router has file-system conventions (`loading.tsx`, `error.tsx`) that wire directly into React Suspense and Error Boundaries automatically.
- **Server vs. Client Components**: Pages Router has no concept of Server Components — every page component runs on both server (during SSR) and client (during hydration), and all page-level code ships to the client. App Router defaults every component to a Server Component, and only `'use client'`-marked subtrees ship JS — a fundamentally different default for client bundle size.
- **API routes**: Pages Router's `pages/api/*.ts` maps to App Router's `app/api/*/route.ts` Route Handlers, with a different function signature (`export default function handler(req, res)` vs. named exports per HTTP method: `export async function GET(request)`).

## When Pages Router knowledge still matters

Beyond legacy maintenance, understanding the Pages Router model deeply is often what makes App Router concepts click faster — `getStaticProps`'s `revalidate` option is the direct conceptual ancestor of `fetch`'s `next: { revalidate }`, and explaining *why* the App Router redesigned data fetching around React Server Components (co-locating fetch calls with the components that use them, rather than a separate top-level function) demonstrates a deeper understanding than just knowing both APIs' syntax in isolation.
