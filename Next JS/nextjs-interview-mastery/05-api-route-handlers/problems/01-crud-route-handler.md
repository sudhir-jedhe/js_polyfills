# Problem 1: Build a GET/POST Route Handler for a Resource

## Task

Implement `app/api/books/route.js` for a simple in-memory `books` resource with `{ id, title, author, year }`.

Requirements:

- `GET /api/books` returns the full list, `200`.
- `GET /api/books?author=Orwell` filters by author (case-insensitive partial match), `200`.
- `POST /api/books` creates a new book from a JSON body.
  - `title` and `author` are required strings.
  - `year` is required and must be a number between `1450` and the current year.
  - Return `400` with a descriptive error message for any validation failure — don't just crash.
  - On success, return the created book (with a generated `id`) and status `201`.
  - If the request body isn't valid JSON, return `400`, not a `500`.

## Constraints

- No external validation library — validate manually.
- Use `Response.json()` for all responses.
- Store books in a module-level array (acceptable for this exercise; note in a comment that this resets on every deploy/restart and isn't safe for concurrent serverless instances).

## Starter shape

```js
// app/api/books/route.js
let books = [
  { id: 1, title: '1984', author: 'George Orwell', year: 1949 },
];

export async function GET(request) {
  // TODO
}

export async function POST(request) {
  // TODO
}
```

## Solution

```js
// app/api/books/route.js
let books = [
  { id: 1, title: '1984', author: 'George Orwell', year: 1949 },
];
let nextId = 2;

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const author = searchParams.get('author');

  let result = books;
  if (author) {
    const needle = author.toLowerCase();
    result = books.filter((b) => b.author.toLowerCase().includes(needle));
  }

  return Response.json(result);
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Request body must be valid JSON' }, { status: 400 });
  }

  const { title, author, year } = body;
  const currentYear = new Date().getFullYear();

  if (typeof title !== 'string' || title.trim().length === 0) {
    return Response.json({ error: 'title is required and must be a non-empty string' }, { status: 400 });
  }
  if (typeof author !== 'string' || author.trim().length === 0) {
    return Response.json({ error: 'author is required and must be a non-empty string' }, { status: 400 });
  }
  if (typeof year !== 'number' || year < 1450 || year > currentYear) {
    return Response.json(
      { error: `year must be a number between 1450 and ${currentYear}` },
      { status: 400 }
    );
  }

  const book = { id: nextId++, title: title.trim(), author: author.trim(), year };
  books.push(book);

  return Response.json(book, { status: 201 });
}
```
