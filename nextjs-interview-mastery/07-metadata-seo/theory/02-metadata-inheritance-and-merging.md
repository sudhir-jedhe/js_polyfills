# Metadata Inheritance and Merging Across Nested Layouts

Metadata in the App Router isn't defined once at the top and left alone — it
cascades down through nested `layout.js` files and gets merged with whatever
the matching `page.js` defines, similar in spirit to how CSS cascades, but
with specific, well-defined merge rules rather than arbitrary specificity.

The core rule: **a child segment's metadata is shallow-merged over its
parent's**, field by field. If the root layout sets a `title` and an `icons`
field, and a page two levels deep only sets `title`, the page inherits
`icons` from the root untouched — but its own `title` value wins over the
root's for that field.

```jsx
// app/layout.jsx
export const metadata = {
  title: { default: 'Acme Inc', template: '%s | Acme Inc' },
  description: 'The default site description.',
  icons: { icon: '/favicon.ico' },
};
```

```jsx
// app/blog/[slug]/page.jsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title, // becomes "Post Title | Acme Inc" via the template
    description: post.excerpt, // overrides the root's description for this page
    // icons is NOT set here — inherited from the root layout untouched
  };
}
```

The `title.template` pattern deserves special attention because it's a
frequent interview question: setting `title: { template: '%s | Acme Inc',
default: 'Acme Inc' }` at the root means every descendant page that sets a
plain string `title` (e.g., `title: 'Post Title'`) automatically gets
wrapped into `'Post Title | Acme Inc'` in the rendered `<title>` tag — you
don't repeat the site name on every page. The `default` value is what's used
if a segment doesn't define a title at all. A child segment can **opt out**
of the parent's template entirely by providing its own `title.absolute`
value instead of a plain string, which bypasses template wrapping — useful
for something like a login page that wants exactly `"Sign In"` with no site
name suffix.

Some fields don't merge shallowly at all — they're **fully replaced**, not
combined, when redefined at a deeper level. `openGraph` and `twitter` are the
most commonly misunderstood examples here: if a child page defines its own
`openGraph` object, it does *not* merge individual OG properties with the
parent's `openGraph` object field-by-field the way top-level metadata keys
merge with each other — the child's `openGraph` object entirely replaces the
parent's. This means if the root layout's `openGraph` includes a default
`siteName` and `images`, and a blog post only sets `openGraph: { title:
post.title }`, that post's page loses the inherited `siteName` and `images`
entirely, because it redefined `openGraph` as a whole object rather than
extending it. The practical fix: when overriding `openGraph` at a deeper
level, spread in what you still want:

```jsx
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage ?? '/default-og-image.png'], // must be re-specified
      siteName: 'Acme Inc', // must be re-specified — not auto-inherited into this object
    },
  };
}
```

Understanding "shallow merge at the top level, full replace within nested
objects like `openGraph`/`twitter`" is exactly the distinction that separates
someone who's memorized the API surface from someone who's actually debugged
a broken social share preview in production.
