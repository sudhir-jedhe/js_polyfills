## Is this valid, and what does it do?

```jsx
// app/dashboard/page.jsx  (Server Component — no "use client")
import { revalidatePath } from 'next/cache';

async function archiveOldItems() {
  'use server';
  await db.item.updateMany({ where: { old: true }, data: { archived: true } });
  revalidatePath('/dashboard');
}

export default function DashboardPage() {
  return (
    <form action={archiveOldItems}>
      <button type="submit">Archive old items</button>
    </form>
  );
}
```

**Answer:** Yes, this is completely valid — and a common, idiomatic pattern. It works exactly as intended: submitting the form invokes `archiveOldItems` on the server, mutates data, and revalidates the page.

**Why:** A Server Action doesn't need to be defined in, or called from, a Client Component. You can define an inline Server Action directly inside a Server Component (note the `'use server'` directive nested *inside the function body*, not at the top of the file) and pass it straight to a `<form action={...}>`. Because the whole page is server-rendered, the form's `action` attribute becomes a reference Next.js resolves back to that server function on submission — no client-side JavaScript is required for this interaction to work at all, which is exactly the kind of progressive-enhancement behavior Server Actions are designed to preserve. The confusion trap here is assuming `'use server'` implies you're inside client-triggered interactivity that needs `'use client'` somewhere — it doesn't; `'use server'` marks the *function* as a server boundary, independent of whether the calling component is server- or client-rendered.
