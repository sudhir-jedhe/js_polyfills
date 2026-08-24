# Problem 2: Implement Tag-Based Revalidation for a CMS-Like Update Flow

## Task

Build a minimal CMS-like flow: a `/posts` page listing posts fetched with a `'posts'` tag, and a Server Action `updatePostTitle` that updates a post's title and revalidates the tag so the list reflects the change immediately without waiting for any time-based revalidation.

## Solution

```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://cms.example.com/posts', {
    next: { tags: ['posts'] },
  })
  return res.json()
}

export default async function PostsPage() {
  const posts: { id: string; title: string }[] = await getPosts()

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          {post.title}
          <EditTitleForm postId={post.id} currentTitle={post.title} />
        </li>
      ))}
    </ul>
  )
}
```

```tsx
// app/posts/actions.ts
'use server'

import { revalidateTag } from 'next/cache'

export async function updatePostTitle(postId: string, newTitle: string) {
  const res = await fetch(`https://cms.example.com/posts/${postId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title: newTitle }),
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) {
    throw new Error('Failed to update post title')
  }

  revalidateTag('posts') // invalidates the cached list fetch, and any other fetch tagged 'posts'
}
```

```tsx
// app/posts/EditTitleForm.tsx
'use client'

import { useState, useTransition } from 'react'
import { updatePostTitle } from './actions'

export function EditTitleForm({ postId, currentTitle }: { postId: string; currentTitle: string }) {
  const [title, setTitle] = useState(currentTitle)
  const [isPending, startTransition] = useTransition()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        startTransition(async () => {
          await updatePostTitle(postId, title)
        })
      }}
    >
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
```

**Flow explanation:** The `/posts` list fetch is tagged `'posts'` and cached (no explicit `no-store`, so it defaults to cached with the tag attached). When a user edits a title and submits, `updatePostTitle` performs the CMS update, then calls `revalidateTag('posts')`. Because `revalidatePath`/`revalidateTag` calls from a Server Action trigger Next.js to refresh the relevant router cache client-side too, the page reflects the new title essentially immediately after the action resolves — without needing a manual page refresh, and without waiting on any time-based `revalidate` window that might otherwise have left the list stale for minutes or hours.
