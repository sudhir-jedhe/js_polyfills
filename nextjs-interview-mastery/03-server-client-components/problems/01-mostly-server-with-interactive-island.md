# Problem 1: Build a Page That's Mostly Server, One Interactive Island

## Task

Build `app/articles/[id]/page.tsx`: a Server Component that fetches an article from an API and renders its title, body, and author. Add exactly one interactive piece — a "Like" button that increments a like count client-side (optimistic UI) and calls a Server Action to persist the like. The page itself, article body rendering, and author info must remain Server Component code with no client JS shipped for them.

## Solution

```tsx
// app/articles/[id]/actions.ts
'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function likeArticle(articleId: string) {
  await db.article.update({
    where: { id: articleId },
    data: { likes: { increment: 1 } },
  })
  revalidatePath(`/articles/${articleId}`)
}
```

```tsx
// app/articles/[id]/LikeButton.tsx
'use client'

import { useState, useTransition } from 'react'
import { likeArticle } from './actions'

export function LikeButton({ articleId, initialLikes }: { articleId: string; initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)
  const [isPending, startTransition] = useTransition()

  function handleLike() {
    setLikes((l) => l + 1) // optimistic update
    startTransition(async () => {
      await likeArticle(articleId)
    })
  }

  return (
    <button onClick={handleLike} disabled={isPending}>
      ❤ {likes}
    </button>
  )
}
```

```tsx
// app/articles/[id]/page.tsx — Server Component, no directive
import { LikeButton } from './LikeButton'

async function getArticle(id: string) {
  const res = await fetch(`https://api.example.com/articles/${id}`)
  return res.json()
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)

  return (
    <article>
      <h1>{article.title}</h1>
      <p>By {article.author}</p>
      <div>{article.body}</div>
      <LikeButton articleId={article.id} initialLikes={article.likes} />
    </article>
  )
}
```

**Composition check:** `ArticlePage` (Server Component) imports and renders `LikeButton` (Client Component) — allowed. `LikeButton` only imports `likeArticle`, a Server Action (allowed via the `'use server'` reference mechanism), not any raw server-only module like a database client — also correct. Only `LikeButton`'s small bundle (a `useState`/`useTransition` counter and a Server Action call) ships to the browser; the article-fetching logic, the API call, and the article body rendering all stay entirely server-side.
