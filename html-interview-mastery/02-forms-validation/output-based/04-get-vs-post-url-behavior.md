# Output: GET Form Submission and the Resulting URL

```html
<form action="/search" method="get">
  <input type="text" name="q" value="html forms">
  <input type="hidden" name="category" value="docs">
  <button type="submit">Search</button>
</form>
```

**Question:** What URL does the browser navigate to when this form is submitted, without changing anything the user typed?

**Answer:** `/search?q=html+forms&category=docs` — every named field's current value (including the `hidden` one) is serialized into the query string, with spaces encoded as `+` (the `application/x-www-form-urlencoded` convention) and special characters percent-encoded. The page performs a full navigation to that URL, exactly as if the user had typed/pasted it into the address bar or clicked a link with that `href`.

**Why:** With `method="get"`, the browser ignores `enctype` entirely (urlencoding into the query string is the *only* GET encoding) and constructs the target URL by appending `action`'s existing query string (if any) plus every form field serialized as `key=value` pairs joined by `&`. This is exactly why GET forms are bookmarkable/shareable (the resulting URL fully encodes the request) and why sensitive data (passwords, tokens) must never be submitted via a GET form — it would end up visible in the URL bar, browser history, and server access logs.
