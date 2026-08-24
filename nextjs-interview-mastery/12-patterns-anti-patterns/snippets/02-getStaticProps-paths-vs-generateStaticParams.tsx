// Side-by-side: Pages Router getStaticProps/getStaticPaths vs.
// App Router generateStaticParams + revalidate.

// ============ Pages Router: pages/blog/[slug].tsx ============
export async function getStaticPaths() {
  const posts = await getRecentPosts(5);
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: 'blocking', // unlisted slugs render on-demand
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { notFound: true };
  return { props: { post }, revalidate: 3600 };
}

export default function BlogPost({ post }: { post: { title: string; body: string } }) {
  return <article><h1>{post.title}</h1><p>{post.body}</p></article>;
}

// ============ App Router: app/blog/[slug]/page.tsx ============
import { notFound } from 'next/navigation';

export const dynamicParams = true; // equivalent of fallback: 'blocking'
export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getRecentPosts(5);
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <article><h1>{post.title}</h1><p>{post.body}</p></article>;
}

// Mock data functions shared by both examples above.
async function getRecentPosts(limit: number) {
  return [{ slug: 'a' }, { slug: 'b' }].slice(0, limit);
}
async function getPost(slug: string) {
  return { title: `Post ${slug}`, body: 'Lorem ipsum' };
}
