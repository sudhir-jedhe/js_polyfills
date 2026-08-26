# Scenario: Diagnosing a Broken Social Share Preview

A support ticket comes in: when the `/product/wireless-headphones` page is
shared on Slack or iMessage, the preview shows the site's generic homepage
title and no image — not the specific product. The page itself, viewed
directly in a browser, displays the correct product name and image fine.

**Approach:**

Work through this like an actual debugging session, in order of most likely
cause:

**1. Check whether the page defines `generateMetadata()` at all**, or is
relying on a static `metadata` export (or nothing, inheriting the root
layout's generic values entirely):

```jsx
// If this is what's there — the bug is immediately visible
export const metadata = {
  title: 'Acme Store', // static, same for every product
};
```

Product pages backed by dynamic data almost always need `generateMetadata()`,
not a static export, precisely because the title/OG data has to vary per
product.

**2. If `generateMetadata()` exists, check whether `openGraph` is actually
being set**, distinct from just `title`/`description`:

```jsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  return {
    title: product.name,
    description: product.shortDescription,
    // no `openGraph` key at all here — this is the actual bug
  };
}
```

Setting `title`/`description` alone does *not* automatically populate
`og:title`/`og:image` — Open Graph tags are a distinct object that must be
set explicitly (they don't magically derive from the plain `title`/
`description` fields, though they often duplicate the same values).

**3. If `openGraph` is set, check for the "child override replaces the whole
object" trap** — if the root layout has `openGraph.images` set as a sensible
default, and this page's `generateMetadata()` sets its own `openGraph` object
without re-including `images`, the inherited image is lost entirely (see the
inheritance/merging theory file).

**4. If everything looks correct in the rendered HTML, check
`metadataBase`/absolute URLs** — view-source the actual page and confirm
`<meta property="og:image">` contains a full `https://...` URL, not a
relative path; some crawlers silently fail on relative image URLs.

**5. Rule out platform-side caching** — if the metadata is now provably
correct in the HTML but the preview still looks stale, the sharing
platform itself likely cached the old preview for that URL. Use the
platform's own debugging/re-scrape tool (Facebook Sharing Debugger, X Card
Validator) to force a fresh crawl rather than assuming the code fix didn't
work.

The final, corrected version:

```jsx
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Product Not Found' };

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image, width: 1200, height: 630, alt: product.name }],
      siteName: 'Acme Store',
      type: 'website',
    },
  };
}
```
