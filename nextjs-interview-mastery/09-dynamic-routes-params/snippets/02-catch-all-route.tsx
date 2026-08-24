// app/docs/[...slug]/page.tsx
// Catch-all segment: /docs/a, /docs/a/b, /docs/a/b/c all match.
// /docs (no trailing segment) does NOT match this route.

import { notFound } from 'next/navigation';

async function getDocByPath(pathSegments: string[]) {
  const path = pathSegments.join('/');
  const res = await fetch(`https://api.example.com/docs/${path}`, {
    next: { revalidate: 86400 },
  });
  if (res.status === 404) return null;
  return res.json();
}

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const doc = await getDocByPath(slug);

  if (!doc) {
    notFound();
  }

  return (
    <div>
      <nav aria-label="breadcrumb">
        {slug.map((segment, i) => (
          <span key={i}> / {segment}</span>
        ))}
      </nav>
      <article dangerouslySetInnerHTML={{ __html: doc.contentHtml }} />
    </div>
  );
}
