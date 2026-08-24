# Output: Is This a Valid `"use client"` Placement?

```tsx
// app/Widget.tsx
import { useState } from 'react'

function helper() {
  return Math.random()
}

'use client'

export function Widget() {
  const [n, setN] = useState(helper())
  return <button onClick={() => setN(helper())}>{n}</button>
}
```

Does putting `'use client'` after some other code, rather than as the very first line, work?

**Answer:** No — this is invalid and either fails to be recognized as a client boundary at all (silently, meaning `Widget` is treated as a Server Component and the `useState` call then throws), or the build tooling flags it as a misplaced directive, depending on the exact bundler/version. Directives like `'use client'` must be the **very first statement in the file** — no imports, no comments that get treated as code, nothing above it (a leading comment or blank line is generally tolerated, but any actual import or code statement is not).

**Why:** `'use client'` (and `'use server'`) are *module-level directives*, processed by the bundler/compiler as a static, whole-file signal before any other code is evaluated — conceptually similar to `'use strict'` in older JavaScript. Tooling scans for the directive specifically at the top of the file because it needs to decide, before processing any imports, whether this module belongs in the server graph or the client graph — imports listed above the directive would already have been resolved under the wrong assumption. Because of this, the directive can't be conditional, can't be placed mid-file, and can't be scoped to only part of a file — it applies to the entire module or not at all. The fix is moving `'use client'` to line 1:

```tsx
// app/Widget.tsx
'use client'

import { useState } from 'react'

function helper() {
  return Math.random()
}

export function Widget() {
  const [n, setN] = useState(helper())
  return <button onClick={() => setN(helper())}>{n}</button>
}
```
