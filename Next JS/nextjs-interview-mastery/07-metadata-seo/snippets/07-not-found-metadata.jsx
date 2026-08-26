// app/blog/[slug]/page.jsx — 404 handling paired with metadata
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  if (!post) {
    // Still return valid metadata for the not-found state rather than throwing here —
    // notFound() below is what actually triggers the 404 status/page.
    return { title: 'Post Not Found', robots: { index: false, follow: false } };
  }
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);
  if (!post) {
    notFound(); // renders the nearest not-found.jsx and sets a real 404 status
  }
  return <article><h1>{post.title}</h1></article>;
}

async function getPost(slug) {
  const res = await fetch(`https://api.example.com/posts/${slug}`);
  if (res.status === 404) return null;
  return res.json();
}
