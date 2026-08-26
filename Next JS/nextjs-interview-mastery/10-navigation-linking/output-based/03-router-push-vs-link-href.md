# Is there a functional difference between these two?

```tsx
// Version A
<Link href="/dashboard">Go to dashboard</Link>

// Version B
'use client';
function GoButton() {
  const router = useRouter();
  return <button onClick={() => router.push('/dashboard')}>Go to dashboard</button>;
}
```

Both navigate to `/dashboard` on click. Are they equivalent from an accessibility and behavior standpoint?

**Answer:** No — they behave differently in ways that matter. Version A renders a real `<a href="/dashboard">` element: middle-click and `Ctrl`/`Cmd`+click open it in a new tab, right-click gives "Open in new tab" / "Copy link," it's keyboard-focusable and announced as a link by screen readers, and it degrades gracefully if JavaScript fails to load (the browser can still navigate via the native `href`, though the App Router's enhanced behavior wouldn't apply). Version B renders a `<button>`, which supports none of that — no new-tab behavior, no "copy link" context menu, and screen readers announce it as a button/action rather than a navigational link, which is semantically misleading for something whose entire job is "take me to a different page."

**Why:** `router.push` is the right tool when navigation is a **side effect of an action** (submitting a form, completing a multi-step flow, an API call succeeding) — not for something that's fundamentally just a link a user clicks to go somewhere. The general rule: if the primary purpose of the interactive element is "navigate to X," reach for `<Link href="X">` even inside a Client Component; reserve `router.push`/`replace` for navigation triggered programmatically after other logic runs (and even then, wrapping the trigger element in a semantically-correct `<button>` is right if it also does non-navigational work, like validating a form before navigating).
