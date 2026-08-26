# `useRouter()` for Programmatic Navigation

`<Link>` covers declarative navigation (something the user clicks), but plenty of navigation needs to happen as a *side effect* of code — after a form submits successfully, after auth state resolves, after a timer expires. That's what `useRouter()` (from `next/navigation`, not `next/router` — the Pages Router hook of the same name is a different, incompatible API) is for.

## The hook is Client-Component only

```tsx
'use client';

import { useRouter } from 'next/navigation';

export function DeletePostButton({ postId }: { postId: string }) {
  const router = useRouter();

  async function handleDelete() {
    await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
    router.push('/dashboard/posts');
  }

  return <button onClick={handleDelete}>Delete</button>;
}
```

`useRouter` relies on React context set up by the client-side router, so it only works inside a Client Component (`'use client'` at the top of the file, or a file imported only by one). Trying to call it from a Server Component throws immediately — there's no router instance to read on the server, since routing there is just "what page am I rendering for this request," not an interactive, stateful client concept.

## The core methods

- **`router.push(href)`** — navigates to a new URL, adding an entry to the browser history stack. The most common call; equivalent to a user clicking a `<Link>`.
- **`router.replace(href)`** — navigates without adding a history entry, replacing the current entry instead. Use this after actions where going "back" to the previous state doesn't make sense — e.g., after a login redirect, so pressing back doesn't return the user to the (now stale) login form.
- **`router.back()`** / **`router.forward()`** — programmatically move through browser history, equivalent to the browser's back/forward buttons.
- **`router.refresh()`** — re-fetches the current route's Server Component data from the server without losing client-side state (like scroll position or open modals) or doing a full page reload. Common after a mutation where you want fresh server data reflected immediately without a manual `push` to the same URL (which wouldn't re-fetch, since the URL hasn't changed).
- **`router.prefetch(href)`** — imperatively warms the client-side cache for a route ahead of an anticipated navigation, the same mechanism `<Link>` uses automatically on viewport entry.

## `push` vs. `replace` vs. `refresh`: a common mix-up

```tsx
'use client';

async function handleSubmit(formData: FormData) {
  await saveDraft(formData);
  router.refresh(); // re-fetch server data for the CURRENT route
  // NOT router.push(pathname) -- that would add a redundant history
  // entry and doesn't guarantee the server data actually re-fetches
  // if the URL is unchanged.
}
```

A frequent bug: calling `router.push(window.location.pathname)` to "refresh" the current page. Since the URL doesn't change, the App Router's client cache may serve the previously cached segment instead of hitting the server again — `router.refresh()` is the explicit, guaranteed way to invalidate and re-fetch the current route's server-rendered content.

## Server Actions vs. `useRouter`

For form submissions, a Server Action combined with `redirect()` (from `next/navigation`, callable on the server) is often preferable to a Client Component calling `fetch` then `router.push` — it avoids the client-server round trip for a plain form submit and keeps the mutation logic on the server. `useRouter` remains the right tool for genuinely client-driven navigation: a "Cancel" button, a tab switcher, a redirect gated on client-only state (like a `localStorage` check), or navigation following a non-form interaction (a timer, a WebSocket event, a drag-and-drop completion).
