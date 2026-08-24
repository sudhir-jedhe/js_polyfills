// app/news/page.tsx — ISR base page
export const revalidate = 3600 // fallback timer, rarely relied on directly

export default async function NewsPage() {
  const res = await fetch('https://cms.example.com/articles', {
    next: { tags: ['articles'] },
  })
  const articles = await res.json()

  return (
    <ul>
      {articles.map((a: { id: string; title: string }) => (
        <li key={a.id}>{a.title}</li>
      ))}
    </ul>
  )
}

// app/actions/publish-article.ts — Server Action triggered by an editor
;('use server')

import { revalidateTag } from 'next/cache'

export async function publishArticle(formData: FormData) {
  await fetch('https://cms.example.com/articles', {
    method: 'POST',
    body: formData,
  })

  // Bypasses the 3600s timer immediately — next request to /news
  // regenerates fresh instead of waiting out the revalidate window.
  revalidateTag('articles')
}
