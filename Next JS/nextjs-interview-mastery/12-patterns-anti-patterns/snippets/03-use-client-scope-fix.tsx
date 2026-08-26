// Anti-pattern fix: shrinking a 'use client' boundary from an entire
// page down to just the interactive leaf component.

// ============ BEFORE: whole page is a Client Component ============
// app/articles/[id]/page.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// export default function ArticlePage({ params }) {
//   const [article, setArticle] = useState(null);
//   const [liked, setLiked] = useState(false);
//   useEffect(() => {
//     fetch(`/api/articles/${params.id}`).then((r) => r.json()).then(setArticle);
//   }, [params.id]);
//   if (!article) return <div>Loading...</div>;
//   return (
//     <article>
//       <h1>{article.title}</h1>
//       <div>{article.body}</div>
//       <button onClick={() => setLiked(!liked)}>{liked ? 'Liked' : 'Like'}</button>
//     </article>
//   );
// }

// ============ AFTER: only the like button is a Client Component ============
// app/articles/[id]/page.tsx (Server Component)
import { LikeButton } from './like-button';

async function getArticle(id: string) {
  const res = await fetch(`https://api.example.com/articles/${id}`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticle(id);

  return (
    <article>
      <h1>{article.title}</h1>
      <div>{article.body}</div>
      <LikeButton articleId={id} />
    </article>
  );
}

// app/articles/[id]/like-button.tsx
// 'use client';

import { useState } from 'react';

export function LikeButton({ articleId }: { articleId: string }) {
  const [liked, setLiked] = useState(false);

  async function handleClick() {
    setLiked((prev) => !prev);
    await fetch(`/api/articles/${articleId}/like`, { method: 'POST' });
  }

  return <button onClick={handleClick}>{liked ? 'Liked' : 'Like'}</button>;
}
