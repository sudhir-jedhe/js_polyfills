# Problem 1: `generateMetadata()` for a Dynamic Blog Post Route

## Task

Implement `app/blog/[slug]/page.jsx` with:

- A `generateMetadata()` function that fetches the post by `params.slug` and
  sets `<title>` to the post's actual title, `description` to its excerpt.
- Full Open Graph metadata: `title`, `description`, `type: 'article'`,
  `publishedTime`, and an `images` array using the post's cover image (with
  explicit `width`/`height`/`alt`).
- Twitter card metadata using `summary_large_image`.
- Correct handling for a missing post: return sensible fallback metadata
  (`title: 'Post Not Found'`, `robots: { index: false }`) AND trigger a real
  `404` from the page component via `notFound()` — both must agree.
- The page component itself renders the post title and HTML content.

## Constraints

- Assume `getPost(slug)` is an async function backed by `fetch` that returns
  `null` for a nonexistent slug (simulate a 404 upstream response).
- Rely on Next's automatic request deduplication rather than manually passing
  fetched data between `generateMetadata` and the page component.

## Solution

```jsx
// app/blog/[slug]/page.jsx
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
      robots: { index: false, follow: false },
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      images: [
        { url: post.coverImage, width: 1200, height: 630, alt: post.title },
      ],
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

  if (!post) {
    notFound();
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}

async function getPost(slug) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 3600 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}
```

The two `getPost(params.slug)` calls (one in `generateMetadata`, one in the
page component) are intentional and not wasteful — Next.js deduplicates
identical `fetch` calls within the same request via request memoization.
