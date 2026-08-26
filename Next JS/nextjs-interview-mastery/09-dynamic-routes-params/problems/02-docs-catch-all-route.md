# Problem 2: Documentation site catch-all route

## Task

Implement a documentation route under `app/docs/[...slug]/page.tsx` that handles arbitrary-depth paths such as:

- `/docs/getting-started`
- `/docs/guides/authentication/oauth`
- `/docs/api-reference/v2/endpoints/users`

## Requirements

1. The route must **not** match bare `/docs` — assume a separate `app/docs/page.tsx` landing page owns that URL.
2. Given `params.slug` (a `string[]`), resolve it against a content source (mock a `getDocByPath(path: string)` function that takes a `/`-joined path).
3. Return a proper 404 via `notFound()` when the path doesn't resolve to a real doc.
4. Render a breadcrumb trail from the `slug` array (e.g., `guides / authentication / oauth`).
5. Pre-render the full known doc tree via `generateStaticParams` (assume a `getAllDocPaths(): Promise<string[]>` helper returning `/`-joined paths like `"guides/auth/oauth"`) — you'll need to split each returned path back into a segment array in the shape `generateStaticParams` expects.

## Edge cases to handle explicitly

- A path with a trailing or malformed segment (e.g., unusually long depth) that doesn't correspond to any real doc — should not crash, should 404 cleanly.
- Confirm in a comment why this route form (`[...slug]`, not `[[...slug]]`) is the correct choice given requirement 1.

## Self-check

- Does `/docs` route to the landing page, not this catch-all, with zero conflict?
- Does a 5-level-deep valid path resolve correctly without any route-file changes?
- Is every path returned by `getAllDocPaths()` correctly split into the array shape `generateStaticParams` needs?
