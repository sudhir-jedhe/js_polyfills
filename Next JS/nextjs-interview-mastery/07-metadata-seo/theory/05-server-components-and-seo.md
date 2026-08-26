# Why Server Components Make Good SEO Easier

Before the App Router, a common source of SEO problems in React apps was
client-side data fetching: a page would render a loading skeleton, then fetch
data in `useEffect`, then update the DOM once the response arrived. A crawler
that doesn't fully execute JavaScript (or times out before your fetch
resolves) would index the skeleton — an essentially empty page — not the real
content. Even crawlers that *do* execute JS (modern Googlebot does, with
caveats) pay a real cost: content isn't available in the initial HTML
response, so it isn't reliably part of what gets indexed quickly or
consistently.

Server Components change the default. A Server Component that fetches data
does so **during server rendering**, before any HTML is sent to the client —
the fetched content is already baked into the initial HTML response:

```jsx
// app/blog/[slug]/page.jsx — a Server Component by default (no "use client")
export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug); // runs on the server, before HTML is sent

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </article>
  );
}
```

View-source (or, equivalently, what any crawler receives on the very first
request) on this page shows the actual article title and body text — not a
`<div id="root"></div>` shell waiting for JavaScript to fill it in. This is
true even without any special SEO-specific code; it's simply the default
behavior of Server Components doing their data fetching server-side. Compare
this to the older pattern:

```jsx
// The old, client-fetching pattern this replaces
'use client';
export default function BlogPostPage({ slug }) {
  const [post, setPost] = useState(null);
  useEffect(() => {
    fetch(`/api/posts/${slug}`).then((r) => r.json()).then(setPost);
  }, [slug]);

  if (!post) return <Skeleton />; // this is what crawlers/first paint actually see
  return <article>...</article>;
}
```

The second pattern isn't *broken* for SEO — modern search engines do render
JavaScript before indexing in many cases — but it's strictly worse: slower
time-to-indexable-content, dependent on the crawler's JS execution budget and
timeout behavior, and more fragile (a slow API, a client-side error, or a
crawler that doesn't execute JS at all all degrade straight to "empty page
indexed").

This connects directly back to the Metadata API: `generateMetadata()` runs
server-side too, meaning the `<title>` and Open Graph tags a crawler or a
social platform's link-unfurling bot sees are already correct in the very
first HTML response — no reliance on client JS executing to inject them via
`document.title = ...` or a head-management library, which was a common
pattern (and common source of SEO bugs) in older client-rendered React apps.
The combination — server-rendered content plus server-resolved metadata — is
why App Router apps default to a much stronger SEO baseline than a
client-fetching SPA, without the team having to think about SEO as a
separate concern layered on top.
