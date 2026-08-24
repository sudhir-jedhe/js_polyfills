# Output: Why Does This Fail to Build?

```tsx
// app/page.tsx — Server Component, no directive
import { useState } from 'react'
import DatePicker from 'react-fancy-datepicker' // a library built with hooks internally

export default async function Page() {
  const events = await getEvents()

  return (
    <div>
      <DatePicker onChange={(date) => console.log(date)} />
      <ul>{events.map((e) => <li key={e.id}>{e.name}</li>)}</ul>
    </div>
  )
}
```

`react-fancy-datepicker`'s own source code uses `useState` internally but doesn't ship its own `"use client"` directive (common for libraries published before Server Components existed). What happens when you try to render this?

**Answer:** A build/render error along the lines of "You're importing a component that needs `useState`. This React hook only works in a client component" — the build fails, or at minimum React throws when it tries to render `DatePicker` as part of a Server Component tree.

**Why:** `Page` has no `"use client"` directive, so it's a Server Component, and `DatePicker` is rendered directly inside it without any client boundary in between. Since `DatePicker` internally calls `useState`, it needs to run inside a client rendering context — but nothing here creates one. Even though the *library's* own file doesn't have `"use client"` (it predates RSC, or its author didn't add it), that doesn't change what code it actually calls; Next.js/React still detects the hook usage at the point it's actually invoked during a server render and errors out.

The standard fix for exactly this situation — a third-party component that internally needs client features but isn't marked — is to create a thin wrapper module with `"use client"` in your own codebase, re-export the library component from there, and import your wrapper instead of the library directly in Server Components:

```tsx
// app/components/DatePickerClient.tsx
'use client'
export { default } from 'react-fancy-datepicker'
```

```tsx
// app/page.tsx
import DatePicker from './components/DatePickerClient' // now properly boundary-marked
export default async function Page() {
  const events = await getEvents()
  return (
    <div>
      <DatePicker onChange={(date) => console.log(date)} />
      <ul>{events.map((e) => <li key={e.id}>{e.name}</li>)}</ul>
    </div>
  )
}
```
