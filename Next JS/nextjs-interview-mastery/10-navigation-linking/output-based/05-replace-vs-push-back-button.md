# A user complains the back button traps them in a redirect loop

```tsx
'use client';
// app/login/login-form.tsx
export function LoginForm() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const ok = await login(formData);
    if (ok) {
      router.push('/dashboard'); // <-- the line in question
    }
  }
  // ...
}
```

```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const isAuthed = Boolean(request.cookies.get('session'));
  if (!isAuthed && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

A logged-in user lands on `/dashboard` after login, then clicks the browser's back button. They're sent back to `/login`, which — since they're now authenticated (cookie is set) — doesn't redirect them away, so they see the login form again, submit is a no-op-feeling experience, and pressing back again just cycles between the two pages.

**Answer:** `router.push('/dashboard')` added a new history entry **on top of** the `/login` entry, so the browser history stack is `[..., /login, /dashboard]`. Pressing back correctly (from the browser's point of view) returns to `/login`, which still exists as a valid, renderable page — it's just confusing UX, not a bug in routing per se. The fix is `router.replace('/dashboard')` instead of `push`, which overwrites the `/login` entry rather than stacking on top of it, so the history stack becomes `[..., /dashboard]` and back takes the user to wherever they were *before* they navigated to `/login` in the first place (e.g., the marketing homepage), not back into the login form.

**Why:** This is the textbook case for `replace` over `push`: any navigation that represents "the login form was scaffolding, not a destination the user should ever return to" should replace rather than push. The same principle applies to post-signup onboarding steps, one-time redirect pages, and any interstitial/loading page that's an implementation detail of a flow rather than a genuine navigational destination the user might want to revisit via back/forward.
