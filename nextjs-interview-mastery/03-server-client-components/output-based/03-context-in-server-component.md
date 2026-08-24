# Output: Does This Context Read Work?

```tsx
// app/ThemeContext.tsx
'use client'
import { createContext, useContext } from 'react'

export const ThemeContext = createContext<'light' | 'dark'>('light')

export function useTheme() {
  return useContext(ThemeContext)
}
```

```tsx
// app/page.tsx — Server Component, no directive
import { useTheme } from './ThemeContext'

export default async function Page() {
  const theme = useTheme() // attempting to read Context in a Server Component
  return <div data-theme={theme}>Hello</div>
}
```

Does `useTheme()` work here?

**Answer:** No — this throws an error, because `useContext` (and React hooks generally) cannot be called inside a Server Component. Even though `Page` itself has no `"use client"` directive, calling a hook defined in a client module doesn't retroactively make `Page` a Client Component — `Page` is still evaluated as a Server Component, and Server Components have no hook support at all, since hooks are a client-runtime concept tied to a component instance and a reconciliation lifecycle that doesn't exist during server rendering.

**Why:** React Context, like all hooks, is fundamentally a *client-side* mechanism — a Provider/Consumer pair wired into React's client reconciler, tracking subscriptions and triggering re-renders on value changes. Server Components render once, top-to-bottom, with no persistent instance or re-render cycle to subscribe within, so there's no way for `useContext` to have meaning there. The fix is to move the Context read into an actual Client Component: either mark `Page` itself `"use client"` (losing Server Component benefits for the whole page, generally undesirable), or — better — extract just the piece that needs `theme` into a small Client Component, and let the Server Component pass any server-known initial value down as a plain prop instead of relying on Context for it.

```tsx
// app/page.tsx — Server Component stays as-is
import { ThemedGreeting } from './ThemedGreeting'
export default async function Page() {
  return <ThemedGreeting /> // this Client Component reads Context internally
}

// app/ThemedGreeting.tsx
'use client'
import { useTheme } from './ThemeContext'
export function ThemedGreeting() {
  const theme = useTheme()
  return <div data-theme={theme}>Hello</div>
}
```
