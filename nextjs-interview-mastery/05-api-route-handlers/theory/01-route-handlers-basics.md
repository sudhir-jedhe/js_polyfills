# Route Handlers: The Basics

Before the App Router, Next.js API routes lived in `pages/api/*.js` and exported a single default function that received Express-style `(req, res)` objects. The App Router replaces that with **Route Handlers**: a file literally named `route.js` (or `route.ts`) placed anywhere inside `app/`, which exports one async function *per HTTP method* — `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, and `OPTIONS`.

```js
// app/api/notes/route.js
export async function GET(request) {
  return Response.json({ notes: [] });
}

export async function POST(request) {
  const body = await request.json();
  return Response.json({ id: 1, ...body }, { status: 201 });
}
```

A few things matter immediately here. First, there is no default export — Next.js inspects the named exports and wires each one to the matching HTTP verb. If a client sends a `DELETE` request to a route file that only exports `GET`, Next.js automatically returns a `405 Method Not Allowed`, and it sets the `Allow` header for you. You don't write that branching logic yourself.

Second, `route.js` and `page.js` **cannot coexist in the same route segment**. `app/api/notes/route.js` is fine; `app/notes/page.js` alongside `app/notes/route.js` at the exact same segment is a conflict, because both would try to respond to a `GET` on `/notes`. This is a common early mistake — people try to add an API endpoint at the same URL as a page and get a build error.

Third, the file's location in the `app/` tree *is* the URL. `app/api/notes/route.js` → `/api/notes`. `app/api/notes/[id]/route.js` → `/api/notes/123`, with the dynamic segment available as a second argument:

```js
// app/api/notes/[id]/route.js
export async function GET(request, { params }) {
  const { id } = params;
  return Response.json({ id });
}
```

Route Handlers are, by default, treated like any other Server Component–adjacent code: they run on the server, never ship to the client bundle, and can safely use secrets, database clients, or filesystem access. Unlike page/layout files, a route segment can only have one `route.js`, so if you need both `GET /api/notes` and `POST /api/notes`, they live in the *same* file as separate exports — not separate files.

One subtlety senior engineers get asked about: **caching**. In the Pages Router, API routes were never cached. In the App Router, a `GET` Route Handler *can* be statically evaluated and cached at build time if it doesn't read dynamic data (no `cookies()`, no `request.url` search params usage, no `no-store` fetch inside it). As soon as you touch `request.nextUrl.searchParams`, read cookies/headers, or use a dynamic fetch, Next.js automatically treats the route as dynamic and stops caching it. You can also force this explicitly with `export const dynamic = 'force-dynamic'` at the top of the file — a pattern worth knowing because interviewers love asking "why did my GET route return stale data in production?"
