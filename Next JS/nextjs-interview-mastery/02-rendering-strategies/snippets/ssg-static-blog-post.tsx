// app/blog/[slug]/page.tsx
// SSG: generateStaticParams pre-renders every slug at build time.
// Default fetch() caching (force-cache) keeps this route fully static.

export async function generateStaticParams() {
  const posts: { slug: string }[] = await fetch('https://api.example.com/posts')
    .then((res) => res.json())
  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const res = await fetch(`https://api.example.com/posts/${params.slug}`) // cache: 'force-cache' (default)
  const post = await res.json()

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  )
}
