# Problem 1: Configure ISR with a Specific Revalidate Interval

## Task

Build `app/articles/[id]/page.tsx` for a news site article page that:

1. Fetches article content from an API.
2. Uses ISR with a 30-second revalidate interval.
3. Explain, step by step, the request lifecycle for a visitor who hits the page 45 seconds after it was first generated (i.e., after the window has expired).

## Solution

```tsx
// app/articles/[id]/page.tsx
export const revalidate = 30

async function getArticle(id: string) {
  const res = await fetch(`https://news-api.example.com/articles/${id}`, {
    next: { revalidate: 30 },
  })
  if (!res.ok) throw new Error('Failed to fetch article')
  return res.json()
}

export default async function ArticlePage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)

  return (
    <article>
      <h1>{article.title}</h1>
      <time dateTime={article.publishedAt}>{article.publishedAt}</time>
      <div>{article.body}</div>
    </article>
  )
}
```

## Request lifecycle explanation

Assume the page was first generated at `t=0s` (first-ever visitor, or build time if pre-listed via `generateStaticParams`).

1. **t=0s to t=30s:** Every visitor gets the cached HTML from `t=0s` instantly — no server render work, no network fetch to the news API on these requests.
2. **t=45s (this visitor):** The 30-second `revalidate` window has already expired (at `t=30s`). Next.js still serves this visitor the cached `t=0s` HTML immediately — they are **not** blocked waiting for a fresh render.
3. **Simultaneously**, this request triggers a background regeneration: Next.js re-runs `ArticlePage`, calling `getArticle(params.id)` again against the live API.
4. **Once regeneration completes** (typically well under a second later, depending on API latency), the cache is updated with the newly rendered HTML.
5. **The next visitor** after regeneration completes gets the fresh content; the visitor at `t=45s` themselves already received the stale version and won't see the update unless they reload after regeneration finishes.

The practical takeaway: `revalidate = 30` guarantees content is *at most* stale by roughly "30 seconds plus time until the next request after expiry" — not that it refreshes exactly every 30 seconds on a wall-clock timer.
