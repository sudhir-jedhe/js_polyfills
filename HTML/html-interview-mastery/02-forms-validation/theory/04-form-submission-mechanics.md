***  04-form-submission-mechanics.md ***

# Form Submission Mechanics: GET vs. POST, enctype, FormData

## `method="get"` vs. `method="post"`

| | GET | POST |
|---|---|---|
| Where data goes | Appended to the URL as a query string | Sent in the request body |
| Visibility | Visible in the URL, browser history, server logs, `Referer` header | Not visible in the URL |
| Data size | Limited by practical URL length limits (browsers/servers typically cap around 2000–8000 characters) | Effectively unbounded (server config may still cap it) |
| Idempotent / cacheable / bookmarkable | Yes — a GET request is meant to be safely repeatable and cacheable; the resulting URL can be bookmarked or shared | No — resubmitting a POST (e.g. via browser back/refresh) usually prompts "resubmit form?" |
| Typical use | Searches, filters, any request that doesn't change server state | Login, account creation, anything that mutates data or includes sensitive info (passwords must never go in a GET, since they'd land in the URL/history/logs) |
| File uploads | Not supported | Required (`enctype="multipart/form-data"`) |

```html
<!-- GET: submitting produces /search?q=html+forms -->
<form action="/search" method="get">
  <input type="text" name="q">
</form>

<!-- POST: data goes in the request body, not the URL -->
<form action="/login" method="post">
  <input type="password" name="password">
</form>
```

## `enctype`

Only relevant for `method="post"` — controls how the form body is encoded.

| `enctype` | When to use |
|---|---|
| `application/x-www-form-urlencoded` (default) | Plain text field data, URL-encoded key=value pairs — the default if you omit `enctype` entirely |
| `multipart/form-data` | **Required** whenever the form includes a `<input type="file">` — splits the body into distinct parts, each able to carry binary data |
| `text/plain` | Rare, mostly for debugging — sends roughly-readable key=value lines, not meant for real parsing |

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="avatar">
  <button type="submit">Upload</button>
</form>
```

Forgetting `enctype="multipart/form-data"` on a form with a file input is a classic bug: the form still submits, but the file's binary content never actually reaches the server — only the filename (or nothing, depending on the browser) gets sent as urlencoded text.

## The `FormData` API

`FormData` gives you a JS object representing form fields (including files) without manually walking the DOM, and works whether or not you actually submit via a real HTML `<form>` navigation:

```js
const form = document.querySelector('#signup-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault(); // stop the native full-page navigation/submission
  const formData = new FormData(form); // auto-collects every named control's current value, incl. files

  // read individual fields
  console.log(formData.get('email'));

  // or send it directly — fetch sets the correct multipart Content-Type header automatically
  const response = await fetch('/api/signup', {
    method: 'POST',
    body: formData,
  });
});
```

`FormData` automatically respects each field's `name` attribute (fields without a `name` are excluded entirely — a very common "why isn't my field submitting" bug), correctly includes only the *checked* checkbox/radio values, and bundles file contents from `<input type="file">` without any manual `FileReader` work.

## Converting `FormData` to a plain object (when you don't need file support)

```js
const data = Object.fromEntries(formData.entries());
// { email: 'a@b.com', username: 'jdoe' }
// NOTE: if multiple fields share the same `name` (e.g. several checkboxes), 
// Object.fromEntries silently keeps only the LAST one — use formData.getAll('name') instead for multi-value fields
```
