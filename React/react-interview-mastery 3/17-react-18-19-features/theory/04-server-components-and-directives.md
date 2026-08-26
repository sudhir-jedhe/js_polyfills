# React Server Components and the "use client" / "use server" Directives

## React Server Components (RSC)

Server Components render entirely on the server and send the result (not JavaScript) to the client — zero client-side JS for that component, no hydration cost, direct access to server-only resources (databases, file system) without an API layer.

Client Components are the "normal" React components you already know: they render on the client (after optional server-side rendering for the initial HTML) and can use state, effects, and browser APIs.

The mental model: Server Components describe *what* to render using server-only data; Client Components handle *interactivity*. You can't use `useState` or `onClick` in a Server Component — that's the client's job.

## "use client" / "use server"

These are directives (string literals at the top of a file) that mark a boundary in an RSC-enabled framework (like Next.js App Router):

- `"use client"` at the top of a file says "this component and its subtree render on the client" — it's the escape hatch from the server-component default, opting into hooks like `useState`, event handlers, and browser APIs, at the cost of shipping JS to the browser.
- `"use server"` marks a function as a Server Action — callable from client code but executed on the server (e.g., form submissions that need to write to a database without a hand-rolled API route). The framework handles serializing the call across the network boundary.

These only matter in frameworks that implement the RSC contract; they aren't standalone React APIs you use in a plain client-rendered app.

## Server Components vs. Client Components

| Aspect | Server Components | Client Components |
|---|---|---|
| Where they render | Server only | Client (and optionally pre-rendered on the server for initial HTML) |
| Client JS shipped | None for that component | Ships its JS bundle, hydrates in the browser |
| Can use state/effects/event handlers | No | Yes |
| Can access server resources directly (DB, filesystem) | Yes | No — needs an API or Server Action |
| Common mistake | Trying to use `useState`/`onClick` in a Server Component (build error) | Marking everything `"use client"` out of habit, losing the zero-JS benefit for content that never needed interactivity |

Default to Server Components for static/data-display content in an RSC-enabled framework; add `"use client"` only where you actually need interactivity, state, or browser APIs.

## RSC vs. traditional SSR

A Server Component renders exclusively on the server and never ships its JavaScript to the client at all — there's no hydration for it. Traditional SSR still renders the *same* client component code on the server for the initial HTML, but that component's JS is still sent to the browser afterward to hydrate and become interactive; RSC components skip that entirely because they have no client-side behavior to hydrate.
