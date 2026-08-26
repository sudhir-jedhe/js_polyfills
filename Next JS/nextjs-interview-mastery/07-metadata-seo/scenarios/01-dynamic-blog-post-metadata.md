# Scenario: Blog Post Titles/Descriptions Are Generic Everywhere

The blog at `/blog/[slug]` currently uses a static `metadata` export at the
page level, so every post shares the same generic title and description —
"Blog | Acme Inc" — and every shared link on social media shows an identical,
unhelpful preview card regardless of which post was actually shared.

**Approach:**

Replace the static `metadata` export with `generateMetadata()`, fetching the
actual post and building per-post title, description, and Open Graph data.

```jsx
// app/blog/[slug]/page.jsx
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }],
      siteName: 'Acme Blog',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}

async function getPost(slug) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 3600, tags: [`post-${slug}`] },
  });
  if (res.status === 404) return null;
  return res.json();
}
```

Points worth raising:

1. **Same `getPost(params.slug)` call in both `generateMetadata` and the page
   component** — this looks duplicated but isn't wasteful, because Next.js
   deduplicates identical `fetch()` calls within a single render pass via
   request memoization; the second call resolves from an in-memory cache, not
   a second network round trip.
2. **`metadataBase` set once in the root layout** so `post.coverImage`, if
   it's a relative path from the CMS, still resolves to an absolute OG image
   URL.
3. **404 handling paired correctly**: `generateMetadata` returns sensible
   fallback metadata for a missing post, while `notFound()` in the page
   component is what actually produces a real HTTP 404 status — the two need
   to agree, not just the page-visible content.
4. **Revalidation tag** (`tags: [`post-${slug}`]`) means a CMS webhook on
   publish can call `revalidateTag(`post-${slug}`)` to update both the
   content and the metadata immediately, rather than waiting on the
   `revalidate: 3600` window.
