# Output: How Many Times Does the Effect Log?

```tsx
// app/onboarding/template.tsx
'use client'
import { useEffect } from 'react'

export default function OnboardingTemplate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    console.log('step mounted')
  }, [])
  return <>{children}</>
}
```

Assume `/onboarding` has three steps: `/onboarding/step-1`, `/onboarding/step-2`, `/onboarding/step-3`, all sharing this `template.tsx`. The user clicks "Next" twice, going step-1 → step-2 → step-3, all via client-side navigation. How many times does "step mounted" log?

**Answer:** Three times — once for the initial load of step-1, and once more for each subsequent navigation to step-2 and step-3.

**Why:** `template.js` is explicitly designed to **not** persist across navigation the way `layout.js` does. Next.js creates a brand-new instance of the template (and remounts everything below it) on every navigation into a route it wraps, even between sibling routes. That means its `useEffect` with an empty dependency array re-fires on every navigation, exactly like a fresh component mount — unlike a `layout.js` with the same effect, which would only log once for the entire session of navigating between these three steps. This is the entire reason `template.js` exists: for cases like multi-step wizards or pages that need a guaranteed re-run of enter animations/effects/analytics-pings per step, where a persisting `layout.js` would suppress that.
