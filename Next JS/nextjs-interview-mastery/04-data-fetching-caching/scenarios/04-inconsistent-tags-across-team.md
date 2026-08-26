# Scenario: Revalidation "Works Sometimes" Across a Growing Codebase

As your app has grown to a dozen engineers, revalidation has become unreliable — sometimes editing a post makes changes appear immediately everywhere they should, and sometimes only some pages update while others (like a "related posts" widget or an author's profile page listing their posts) keep showing stale data for the full hour-long fallback window. Nobody can quite explain the inconsistency, and it's eroding trust in the caching system enough that some engineers have started adding `cache: 'no-store'` defensively wherever they're unsure, quietly degrading performance across the app.

**Approach:** This is almost always a tag-naming consistency problem, as covered in the caching pitfalls theory — different engineers, working on different features at different times, tagged their fetches for "the same" underlying data with different ad-hoc strings (`'posts'`, `'post-list'`, `'blog-posts'`, `'author-posts'`), so a single `revalidateTag('posts')` call only invalidates the subset that happens to share that exact string.

The fix is introducing a small, shared, centrally-defined set of cache tag constants that every fetch and every revalidation call imports from, rather than each engineer writing tag strings by hand:

```tsx
// lib/cache-tags.ts — single source of truth
export const CACHE_TAGS = {
  posts: 'posts',
  postDetail: (id: string) => `post-${id}`,
  authorProfile: (authorId: string) => `author-${authorId}`,
} as const
```

```tsx
// app/blog/page.tsx
import { CACHE_TAGS } from '@/lib/cache-tags'
const res = await fetch('https://cms.example.com/posts', { next: { tags: [CACHE_TAGS.posts] } })

// app/authors/[id]/page.tsx — related posts widget
import { CACHE_TAGS } from '@/lib/cache-tags'
const res = await fetch(`https://cms.example.com/authors/${authorId}/posts`, {
  next: { tags: [CACHE_TAGS.posts, CACHE_TAGS.authorProfile(authorId)] }, // tag with BOTH relevant tags
})

// app/actions/publish-post.ts
'use server'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache-tags'

export async function publishPost(id: string, authorId: string) {
  await savePost(id)
  revalidateTag(CACHE_TAGS.posts) // now guaranteed to match every fetch using the shared constant
  revalidateTag(CACHE_TAGS.authorProfile(authorId))
}
```

Beyond the immediate fix, this is worth writing up as a short team convention: any fetch representing data that might need coordinated invalidation should tag with a shared constant, not a hand-typed string, and a piece of data that appears in multiple contexts (a post appearing in a list, a detail page, and an author's profile) should carry *all* the relevant tags so a single mutation can invalidate every place it's cached. Also worth revisiting the defensive `cache: 'no-store'` additions engineers made out of frustration — once tagging is consistent and trustworthy, those can likely be reverted back to proper cached + tagged fetches, recovering the performance that was quietly given up.
