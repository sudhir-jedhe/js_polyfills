# Scenario: Preventing accidental loss of unsaved form edits

**Problem:** A settings form lets users edit a profile. If they make changes and then click a sidebar link, hit the browser back button, or close the tab without saving, their edits are silently lost — a recurring source of support tickets. The fix needs to cover three distinct exit paths: in-app client-side navigation (clicking another `<Link>` or calling `router.push`), and the tab-close/hard-refresh case, which requires a completely different browser API.

**Approach:** There is no single App Router API that intercepts *all* forms of navigation away from a page — client-side navigation and browser-level unload are different mechanisms and need to be guarded separately. Guard programmatic/in-app navigation by routing all "leave this page" actions through a confirm-then-navigate function instead of raw `<Link>`s, and guard tab-close/refresh with the native `beforeunload` event.

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function ProfileForm({ initial }: { initial: { name: string } }) {
  const [name, setName] = useState(initial.name);
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!isDirty) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  const guardedNavigate = useCallback(
    (href: string) => {
      if (isDirty && !confirm('Discard unsaved changes?')) return;
      router.push(href);
    },
    [isDirty, router]
  );

  async function handleSave() {
    await fetch('/api/profile', { method: 'PATCH', body: JSON.stringify({ name }) });
    setIsDirty(false);
    router.refresh();
  }

  return (
    <form>
      <input value={name} onChange={(e) => { setName(e.target.value); setIsDirty(true); }} />
      <button type="button" onClick={handleSave}>Save</button>
      <button type="button" onClick={() => guardedNavigate('/dashboard')}>Cancel</button>
    </form>
  );
}
```

Sidebar links and any other navigational element elsewhere on the page that could lead away from this form would ideally also be routed through the same `guardedNavigate` pattern (e.g., via a shared context that the sidebar checks before calling `router.push`), since a raw `<Link>` elsewhere on the page bypasses this component's guard entirely — App Router navigation doesn't have a built-in global "confirm before leaving" hook analogous to the Pages Router's `router.events` `routeChangeStart` cancellation, so the guard has to be applied at each navigation call site, not centrally.
