# Problem 3: Diagnose a slow page using the rendering-strategy decision framework

## Task

Given the following page, diagnose why it performs poorly (poor LCP specifically) and rewrite it to fix the root cause — not just symptoms.

```tsx
'use client';
import { useState, useEffect } from 'react';

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(`/api/articles/${params.slug}`)
      .then((res) => res.json())
      .then(setArticle);
  }, [params.slug]);

  if (!article) return <div>Loading article...</div>;

  return (
    <article>
      <img src={article.heroImageUrl} width={1200} height={630} />
      <h1>{article.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: article.bodyHtml }} />
    </article>
  );
}
```

## Requirements

1. Walk through the rendering-strategy decision framework (from topic 02) explicitly: is this content personalized per-visitor? Does it need to reflect very recent writes? Should it be static, dynamic, or ISR?
2. Identify every individual issue contributing to poor performance — there is more than one (hint: also consider `next/image` usage and CLS, not just the fetch pattern).
3. Rewrite the page as a Server Component with an appropriate caching/revalidation strategy.
4. Justify, in comments, why each specific issue you fixed was actually hurting LCP/CLS, referencing the Core Web Vitals framework.

## Self-check

- Is data fetching moved server-side, eliminating the client-fetch waterfall before first paint?
- Is `next/image` (not a raw `<img>`) used, with `priority` set for the hero image?
- Does the rewritten page avoid `'use client'` entirely, or use it only where genuinely necessary (if any interactive sub-component is added)?
- Is a specific `revalidate` value chosen and justified given the content type (an article, presumably edited occasionally but not continuously)?
