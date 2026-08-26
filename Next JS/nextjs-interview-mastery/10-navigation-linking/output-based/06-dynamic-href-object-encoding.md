# Why does one of these break with a search term containing a space?

```tsx
const query = 'red shoes';

// Version A
<Link href={`/search?q=${query}`}>Search</Link>

// Version B
<Link href={{ pathname: '/search', query: { q: query } }}>Search</Link>
```

**Answer:** Version A produces `href="/search?q=red shoes"` — a literal, unencoded space in the URL. Most browsers will silently "fix" this on click by encoding it as the user navigates, but the raw `href` attribute in the rendered HTML is technically malformed, and if this string is ever used elsewhere (copied as a link, sent via `fetch`, parsed by `new URL()`), the unencoded space can cause inconsistent behavior across environments. Version B produces a correctly encoded `href="/search?q=red%20shoes"` because Next.js builds the URL string using `URLSearchParams`-equivalent encoding internally when given the object form.

**Why:** Manually template-stringing a query string (`` `?q=${query}` ``) skips URL encoding entirely — it's the developer's responsibility to call `encodeURIComponent(query)` themselves if they stick with the string form (`` `/search?q=${encodeURIComponent(query)}` `` would be correct). The object form of `href` removes this footgun by handling encoding automatically for every value in the `query` object, which is why it's the recommended pattern any time a query string is built from a dynamic (especially user-provided) value rather than a hardcoded string literal. The general interview point: prefer the structured `href` object whenever any part of the URL is not a compile-time-known constant string.
