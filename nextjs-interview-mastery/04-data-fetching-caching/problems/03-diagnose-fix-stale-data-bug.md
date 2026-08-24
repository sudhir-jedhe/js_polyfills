# Problem 3: Diagnose and Fix a Page Showing Stale Data

## Task

You're handed this broken page — users report that after an admin updates the "featured announcement" banner text via a separate admin tool (which writes directly to the database, no revalidation call), the public homepage keeps showing the old announcement for hours. Diagnose the cause and fix it.

```tsx
// app/page.tsx — the buggy version
async function getAnnouncement() {
  const res = await fetch('https://api.example.com/announcement')
  return res.json()
}

export default async function HomePage() {
  const announcement = await getAnnouncement()
  return (
    <div>
      <Banner text={announcement.text} />
      <MainContent />
    </div>
  )
}
```

## Diagnosis

`getAnnouncement`'s `fetch()` call has no cache options specified, which means it defaults to `cache: 'force-cache'` — cached indefinitely in the Data Cache. Since nothing else in the route forces dynamic rendering, this page is likely statically rendered and served from the Full Route Cache, meaning it may not even re-execute `getAnnouncement()` on subsequent requests at all until the next deploy. The admin tool updates the database directly but never calls any Next.js revalidation function, so there's no signal telling Next.js the cached content is now stale — the cache has no time-based expiry (no `revalidate` set) and no tag-based invalidation wired up, so it can persist indefinitely.

## Fix

The correct fix depends on how fresh the announcement genuinely needs to be. Given it's an admin-triggered, infrequent change, on-demand tag-based revalidation (rather than switching to `no-store`, which would needlessly make the whole homepage dynamic) is the right approach:

```tsx
// app/page.tsx — fixed
async function getAnnouncement() {
  const res = await fetch('https://api.example.com/announcement', {
    next: { tags: ['announcement'] },
  })
  return res.json()
}

export default async function HomePage() {
  const announcement = await getAnnouncement()
  return (
    <div>
      <Banner text={announcement.text} />
      <MainContent />
    </div>
  )
}
```

```tsx
// app/admin/actions/update-announcement.ts
'use server'

import { db } from '@/lib/db'
import { revalidateTag } from 'next/cache'

export async function updateAnnouncement(text: string) {
  await db.announcement.update({ where: { id: 'current' }, data: { text } })
  revalidateTag('announcement') // the missing piece — invalidates the cache on save
}
```

The admin tool's save action now needs to route through this Server Action (or an equivalent Route Handler that also calls `revalidateTag('announcement')`) instead of writing to the database directly with no downstream signal to Next.js. As a defense-in-depth measure, it's also reasonable to add a modest `next: { revalidate: 300 }` alongside the tag, so that even if some other code path updates the announcement without calling `revalidateTag`, the staleness is bounded to 5 minutes rather than persisting indefinitely — but the primary fix is wiring up the missing on-demand revalidation call.
