## Why does this fail to build?

```jsx
// app/dashboard/page.jsx
'use client';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

**Answer:** This fails at build time — Next.js raises an error to the effect
of "the `metadata` export is not allowed in a Client Component." It's a hard
compile-time restriction, not a warning that silently gets ignored.

**Why:** `metadata`/`generateMetadata` are resolved entirely on the server,
before any HTML is streamed to the client, as part of building the document
`<head>`. A Client Component, by definition, is meant to also run (or at
least hydrate and re-run) in the browser — allowing a `metadata` export there
would create an ambiguous, unsupported situation where the framework can't
guarantee server-only resolution. The fix is to split the file: keep
`page.jsx` as a Server Component that exports `metadata` and renders a
separate Client Component for the interactive parts:

```jsx
// app/dashboard/page.jsx (Server Component — no "use client")
import DashboardClient from './dashboard-client';

export const metadata = { title: 'Dashboard' };

export default function DashboardPage() {
  return <DashboardClient />;
}
```

```jsx
// app/dashboard/dashboard-client.jsx
'use client';
import { useState } from 'react';

export default function DashboardClient() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```
