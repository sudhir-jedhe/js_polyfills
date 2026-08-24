# Output: Static or Dynamic Given `searchParams`?

```tsx
// app/search/page.tsx
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const results = await fetch(`https://api.example.com/search?q=${searchParams.q ?? ''}`)
    .then((r) => r.json())

  return <ResultsList results={results} />
}
```

Is `/search?q=nextjs` statically generated at build time, and does the answer change if you compare it to `/search` with no query string at all?

**Answer:** Neither is statically generated. Using the `searchParams` prop in a Server Component forces the route into dynamic rendering, regardless of whether a query string is actually present on a given request.

**Why:** `searchParams` can only be known at request time — Next.js has no way to enumerate every possible query string combination ahead of time (unlike dynamic route params, which can be pre-listed via `generateStaticParams`). Accessing `searchParams` in a page component is therefore treated the same as calling a dynamic function like `cookies()`: it opts the entire route out of static generation. This holds true even for a request with an empty query string — the *capability* to receive different `searchParams` per request is what triggers dynamic rendering, not whether a specific request happens to include one. If you wanted a static shell with query-dependent results layered in, you'd typically render a static page and fetch/filter results client-side (CSR) based on `useSearchParams()` in a Client Component instead.
