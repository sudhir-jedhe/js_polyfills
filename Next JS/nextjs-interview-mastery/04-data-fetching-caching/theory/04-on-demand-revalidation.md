# On-Demand Revalidation: `revalidatePath` and `revalidateTag`

Time-based revalidation (`revalidate: N`) is a reasonable default, but it can't express "invalidate exactly when the underlying data actually changed." On-demand revalidation closes that gap: you explicitly tell Next.js "this data/route is now stale" the moment you know it, typically right after a mutation completes.

**`revalidateTag(tag)`.** Invalidates every Data Cache entry that was tagged with `tag` via `fetch(url, { next: { tags: [tag] } })`, regardless of how much time remains on any `revalidate` window those entries had. The next request for any route depending on that tagged data re-fetches fresh instead of reusing the stale cached value.

```tsx
// app/actions/publish-post.ts
'use server'
import { revalidateTag } from 'next/cache'

export async function publishPost(id: string, content: string) {
  await fetch(`https://cms.example.com/posts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ content, published: true }),
  })
  revalidateTag('posts') // invalidates every fetch tagged 'posts', anywhere in the app
}
```

Tags are useful specifically because they're not tied to a single URL — many different fetches (a posts list, an individual post detail, a related-posts widget) can all share the tag `'posts'`, and one `revalidateTag('posts')` call invalidates all of them at once without needing to know every specific route/path that depends on that data.

**`revalidatePath(path)`.** Invalidates the Full Route Cache (and any Data Cache entries used by it) for a specific path. Useful when you know exactly which route(s) need to reflect a change and don't need the more granular, cross-cutting tag-based approach.

```tsx
// app/actions/update-profile.ts
'use server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(userId: string, data: FormData) {
  await db.user.update({ where: { id: userId }, data: { name: data.get('name') } })
  revalidatePath(`/profile/${userId}`) // just this one route needs to refresh
}
```

`revalidatePath` also accepts a `type` argument (`'page'` or `'layout'`) for finer control over whether nested routes under a given path segment are affected, and can revalidate an entire dynamic segment (e.g., `revalidatePath('/blog/[slug]', 'page')`) rather than one specific instance.

**Typical flow:** a Server Action performs a mutation (create/update/delete), then calls the appropriate revalidation function so that the *next* render/request reflects the change — without this call, the mutation would succeed in the database, but users would keep seeing stale cached content until the next natural `revalidate` window elapses (or indefinitely, for content with no time-based revalidation at all). This "mutate, then invalidate" pattern is the standard way to keep aggressively-cached content correct after edits, and it's the mechanism that makes ISR-style caching practical for CMS-backed and user-editable content rather than only for truly static data.
