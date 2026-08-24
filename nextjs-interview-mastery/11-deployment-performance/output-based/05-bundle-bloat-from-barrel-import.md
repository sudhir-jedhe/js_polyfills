# Why did the client bundle for this route grow by 300KB from a "small" change?

Before:
```tsx
// components/icon.tsx
'use client';
import { ChevronDown } from 'lucide-react';

export function Icon() {
  return <ChevronDown size={16} />;
}
```

After (a teammate "simplified" the import):
```tsx
// components/icon.tsx
'use client';
import * as Icons from 'lucide-react';

export function Icon() {
  return <Icons.ChevronDown size={16} />;
}
```

Both versions render identically. The bundle analyzer shows the second version pulled a dramatically larger chunk of `lucide-react` into this route's client bundle.

**Answer:** `import { ChevronDown } from 'lucide-react'` allows the bundler's tree-shaking to statically determine that only the `ChevronDown` module is actually used and exclude every other icon from the output. `import * as Icons from 'lucide-react'` imports the **entire package namespace** as a single object — even though only `Icons.ChevronDown` is ever accessed at runtime, static analysis generally can't prove that no other property on `Icons` is used elsewhere (property access is dynamic from the bundler's point of view), so it conservatively includes the whole library (potentially hundreds of icon components) in the bundle.

**Why:** This is the classic "barrel import" tree-shaking failure, and it's an easy trap because both versions are functionally identical and the difference is invisible without actually inspecting bundle output — nothing about the wildcard import *looks* wrong, and it even reads as simpler code. The fix is always to import only the specific named exports actually used: `import { ChevronDown } from 'lucide-react'`. For libraries that don't tree-shake well even with named imports (some component libraries structure their exports in ways that still pull in shared internals), a deep import path (`import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down'`) or a dedicated Next.js `modularizeImports`/`optimizePackageImports` config entry can force per-icon splitting. Catching this class of regression before it ships is exactly what routine bundle-analyzer runs (or a CI bundle-size budget check) are for — it's very hard to catch by code review alone.
