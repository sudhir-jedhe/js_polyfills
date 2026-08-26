# App Router vs Pages Router: The Conceptual Split

Next.js ships two routing systems side by side: the legacy **Pages Router** (`pages/`, stable since Next.js 1, the only option pre-13) and the **App Router** (`app/`, introduced in 13, the recommended default since 13.4). You can technically run both in the same project — Next.js matches `app/` routes first, then falls back to `pages/` — which is how large codebases migrate incrementally. This topic only introduces the distinction at a high level; a full comparison and migration strategy lives in a later topic dedicated to it.

The headline differences to know for now:

- **Rendering model.** Pages Router components are Client Components by default — `pages/*.js` ships to and hydrates in the browser like a traditional SPA page, and data fetching is done through exported functions (`getServerSideProps`, `getStaticProps`, `getStaticPaths`) that run *outside* the component. App Router components are **Server Components by default** — they render on the server, fetch data with plain `async/await` inline, and ship zero JS to the client unless you opt into `"use client"`.
- **Layouts.** Pages Router has no built-in nested layout primitive — shared UI is typically hand-rolled via a `_app.js` wrapper or per-page layout functions, and it doesn't persist state across navigation without extra work. The App Router's `layout.js` gives you real nested, persistent layouts for free.
- **Data fetching APIs.** `getServerSideProps`, `getStaticProps`, and `getStaticPaths` don't exist in the App Router — they're replaced by `fetch()` inside Server Components (with Next.js's extended caching options) and `generateStaticParams()` for static params.
- **Loading and error states.** Pages Router requires manual loading/error UI wiring per page. The App Router gets `loading.js` and `error.js` as automatic conventions backed by React Suspense and Error Boundaries.
- **Routing primitives.** Both use file-based routing and dynamic segments (`[id]`), but the App Router adds route groups, parallel routes (`@slot`), and intercepting routes (`(.)folder`) — none of which exist in the Pages Router.

```jsx
// pages/posts/[id].js — Pages Router
export async function getServerSideProps({ params }) {
  const post = await fetchPost(params.id)
  return { props: { post } }
}

export default function Post({ post }) {
  return <article>{post.title}</article>
}
```

```tsx
// app/posts/[id]/page.tsx — App Router
export default async function Post({ params }: { params: { id: string } }) {
  const post = await fetchPost(params.id)
  return <article>{post.title}</article>
}
```

For interview purposes, the important thing isn't memorizing every API mapping — it's being able to say clearly: *the App Router is the current default, built on React Server Components and Suspense, and it exists alongside the Pages Router rather than replacing it outright.* New projects should default to the App Router; existing Pages Router codebases can adopt it route-by-route since both can coexist under `app/` and `pages/` in the same project.
