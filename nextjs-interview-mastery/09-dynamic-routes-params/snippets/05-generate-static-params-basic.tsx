// app/blog/[slug]/page.tsx
// Pre-render the 5 most recent posts at build time; everything else
// renders on-demand on first request (dynamicParams defaults to true).

import { notFound } from 'next/navigation';

export const dynamicParams = true; // explicit, though this is the default

export async function generateStaticParams() {
  const recentPosts = await fetch('https://api.example.com/posts?limit=5&sort=newest').then(
    (res) => res.json()
  );

  return recentPosts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    next: { revalidate: 3600 },
  });

  if (res.status === 404) notFound();
  const post = await res.json();

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
