# Mini Notes API

A minimal, runnable Next.js (App Router) app demonstrating Route Handlers for a
`notes` resource, with full CRUD: `GET`/`POST` on the collection and
`GET`/`PUT`/`DELETE` on a single note.

## Run it

```bash
npm install
npm run dev
```

Then visit `http://localhost:3000` or hit the API directly.

## Structure

```
app/
  layout.jsx
  page.jsx
  api/
    notes/
      route.js          # GET (list), POST (create)
      [id]/
        route.js         # GET (one), PUT (update), DELETE (remove)
lib/
  notes-store.js          # in-memory data store shared by both route files
```

The data store is a plain in-memory array (`lib/notes-store.js`), reset on
every server restart. That's intentional — the point of this project is the
Route Handler wiring (methods, status codes, validation, params), not
persistence. Swap `notes-store.js` for a real database client and the route
files don't need to change.

## API reference

### `GET /api/notes`
Returns all notes.

```bash
curl http://localhost:3000/api/notes
```

### `POST /api/notes`
Creates a note. `title` is required; `body` is optional.

```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy milk","body":"2%, not whole"}'
```

Returns `201` with the created note, or `400` if `title` is missing/invalid.

### `GET /api/notes/:id`
Returns a single note, or `404` if it doesn't exist.

```bash
curl http://localhost:3000/api/notes/1
```

### `PUT /api/notes/:id`
Updates `title` and/or `body`. Either field may be omitted.

```bash
curl -X PUT http://localhost:3000/api/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Buy oat milk"}'
```

Returns the updated note, or `404` if the note doesn't exist.

### `DELETE /api/notes/:id`
Deletes a note.

```bash
curl -X DELETE http://localhost:3000/api/notes/1 -i
```

Returns `204 No Content` on success, `404` if the note didn't exist.

## What this project is meant to demonstrate

- `route.js` exporting one function per HTTP method, instead of a single
  Express-style handler.
- Reading a JSON body via `request.json()` and handling malformed JSON
  gracefully (`400`, not a crash).
- Reading a dynamic segment (`params.id`) in a nested `[id]/route.js`.
- Returning the correct status code per outcome: `200`, `201`, `204`, `400`,
  `404` — never masking an error case as a `200`.
- Keeping data-access logic in a separate module (`lib/notes-store.js`) so the
  route files stay focused on HTTP concerns (parsing, validation, status
  codes) rather than mixing in storage logic.
