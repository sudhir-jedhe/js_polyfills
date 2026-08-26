// app/blog/page.tsx — tagged fetch
async function getPosts() {
  const res = await fetch('https://cms.example.com/posts', {
    next: { tags: ['posts'] },
  })
  return res.json()
}

export default async function BlogPage() {
  const posts = await getPosts()
  return <ul>{posts.map((p: { id: string; title: string }) => <li key={p.id}>{p.title}</li>)}</ul>
}

// app/actions/create-post.ts — Server Action invalidating the tag on mutation
;('use server')

import { revalidateTag } from 'next/cache'

export async function createPost(formData: FormData) {
  await fetch('https://cms.example.com/posts', {
    method: 'POST',
    body: JSON.stringify({ title: formData.get('title') }),
  })

  revalidateTag('posts') // next request to /blog re-fetches instead of using stale cache
}
