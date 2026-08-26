# Output: Is a POST Request Cached Like a GET?

```tsx
// app/search/page.tsx
async function searchProducts(query: string) {
  const res = await fetch('https://api.example.com/search', {
    method: 'POST',
    body: JSON.stringify({ query }),
  })
  return res.json()
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const results = await searchProducts(searchParams.q ?? '')
  return <ResultsList results={results} />
}
```

A developer assumes this `POST` fetch behaves like any other `fetch()` call in a Server Component — cached indefinitely by default (`force-cache`), the same as a `GET`. Is that correct?

**Answer:** No. By default, Next.js's extended caching behavior only applies `force-cache` semantics to `GET` requests. `fetch()` calls using `POST` (or other non-`GET` methods) are **not cached by default** — they're treated as effectively uncached/dynamic-triggering unless explicitly configured otherwise. (Separately, this route is *already* forced dynamic here regardless, since it reads `searchParams` — but the POST-caching distinction matters even in routes that would otherwise be static.)

**Why:** Next.js's caching layer models `fetch()` around the assumption that `GET` requests are typically idempotent, read-only operations well-suited to caching, while `POST`/`PUT`/`PATCH`/`DELETE` usually represent actions with side effects (or, in cases like a search endpoint using POST for a large query body, still conceptually request-varying data) where blanket caching would be surprising or incorrect default behavior. This distinction matters independent of the `searchParams` issue in this specific example — even in a hypothetical version of this component with a hardcoded query (no `searchParams` dependency, otherwise eligible for static rendering), the `POST` fetch itself would still not be cached by default, unlike an equivalent `GET` call would be. If you genuinely want a `POST` request's result cached, you have to opt in explicitly with `cache: 'force-cache'` or `next: { revalidate: N }` — it's not automatic the way it is for `GET`.
