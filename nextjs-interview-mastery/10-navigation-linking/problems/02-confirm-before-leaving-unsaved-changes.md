# Problem 2: Confirm before leaving with unsaved changes

## Task

Implement an editable form component that warns the user before they lose unsaved changes, covering both navigation paths:

1. **In-app client-side navigation** (clicking a `<Link>` elsewhere, or a `router.push`/`router.back()` call triggered by this component itself) — show a confirm dialog; if the user cancels, stay on the page.
2. **Browser-level exit** (closing the tab, hard refresh, typing a new URL in the address bar) — trigger the native browser "leave site?" prompt.

## Requirements

- Track a `isDirty` boolean, set to `true` on any field change, reset to `false` after a successful save.
- Use `useRouter` for the in-app "Cancel" button's guarded navigation.
- Use the native `beforeunload` event for the tab-close/refresh case — explain in a comment why `useRouter` alone cannot cover this case.
- Clean up the `beforeunload` listener correctly (no leaked listeners across re-renders or after unmount).
- After a successful save, `isDirty` must reset before any subsequent navigation, so a save-then-immediately-cancel doesn't spuriously trigger the confirm dialog.

## Starter shape

```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function UnsavedChangesForm({ initialValue }: { initialValue: string }) {
  // fill in: state, beforeunload effect, guarded navigate function, save handler
}
```

## Self-check

- Editing a field, then clicking "Cancel": does a confirm dialog appear, and does declining keep you on the page?
- Editing a field, then attempting to close the tab: does the native browser prompt appear?
- Saving successfully, then clicking "Cancel": does it navigate immediately with NO confirm dialog?
- Does the `beforeunload` listener get removed on unmount (no memory leak / stale closure over an old `isDirty` value)?
