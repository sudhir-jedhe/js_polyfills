# Why does this fail to do what the author intended?

```tsx
// app/search/page.tsx
// Author's goal: pre-render the page for the 10 most common search queries.

export async function generateStaticParams() {
  const commonQueries = await getTopSearchQueries(10);
  return commonQueries.map((q) => ({ q: q.term })); // trying to "pre-render" ?q=...
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const results = q ? await search(q) : [];
  return <SearchResults results={results} />;
}
```

**Answer:** This does nothing useful — `generateStaticParams` is completely ignored here (with no error), because `app/search/page.tsx` has **no dynamic path segment**. `generateStaticParams` only has meaning for folders literally named `[something]`; it enumerates values for a **path segment**, not for **query string parameters**. Every request to `/search?q=...` is dynamically rendered on every request regardless of this function's presence.

**Why:** This is a category error interviewers like to probe: `params` (path) and `searchParams` (query string) look similar in the page's props but participate in totally different parts of the rendering model. Static generation pre-builds *pages at specific URLs*, and a query string isn't part of the "page identity" the App Router's static generation targets — there's no `generateStaticSearchParams` equivalent, and there can't be, because query strings are combinatorially unbounded (arbitrary user input) in a way path segments usually aren't. If you want fast search, the real fixes are: cache the underlying data fetch (`fetch(url, { next: { revalidate: 60 } })`), add a CDN/edge cache layer keyed on the full URL including query string, or, if there really are only 10 known "canonical" searches, model them as actual **path segments** (`/search/[query]`) instead of query params, which then *does* make them eligible for `generateStaticParams`.
