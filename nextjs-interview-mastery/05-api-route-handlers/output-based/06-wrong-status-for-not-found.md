## What's wrong with this response?

```js
export async function GET(request, { params }) {
  const note = notes.find((n) => n.id === Number(params.id));

  return Response.json(
    note ?? { error: 'Note not found' },
    { status: 200 }
  );
}
```

A client does:

```js
const res = await fetch('/api/notes/999');
if (res.ok) {
  const data = await res.json();
  renderNote(data); // crashes trying to render { error: '...' } as a note
}
```

**Answer:** When the note doesn't exist, the handler still returns HTTP `200 OK` with an error-shaped body. `res.ok` is `true` (any 2xx is "ok"), so the client's error-handling branch never runs, and it tries to render `{ error: 'Note not found' }` as if it were a real note — producing a confusing UI bug far from the actual root cause.

**Why:** The HTTP status code *is* the primary error-signaling channel that `fetch` (and virtually every HTTP client) checks first via `res.ok` / `res.status`. Returning a `200` with an "error" field buried in the JSON defeats that mechanism — callers have to inspect the body's shape instead of trusting the status, which is easy to forget and inconsistent across endpoints. The fix is to return the correct status alongside the error payload:

```js
if (!note) {
  return Response.json({ error: 'Note not found' }, { status: 404 });
}
return Response.json(note);
```

Now `res.ok` is `false` for the missing case, and standard error-handling code paths (including generic API clients, React Query, SWR) work without special-casing.
