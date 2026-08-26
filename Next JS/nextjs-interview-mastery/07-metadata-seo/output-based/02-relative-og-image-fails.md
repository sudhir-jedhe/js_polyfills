## Why does the OG image not show up in link previews?

```jsx
// app/layout.jsx — no metadataBase set
export const metadata = {
  title: 'Acme Inc',
};

// app/pricing/page.jsx
export const metadata = {
  title: 'Pricing',
  openGraph: {
    images: ['/og-pricing.png'], // relative path
  },
};
```

Sharing `https://acme.example.com/pricing` on Slack/iMessage shows the title
correctly, but no image ever renders in the preview card.

**Answer:** The rendered `<meta property="og:image">` tag ends up containing
the literal relative path `/og-pricing.png` rather than a full URL, because
no `metadataBase` was set anywhere in the layout tree for Next.js to resolve
it against. Many link-unfurling bots require an absolute URL for `og:image`
and simply fail to fetch/render a relative one.

**Why:** Next.js only auto-resolves relative image/URL paths in metadata
into absolute URLs when a `metadataBase` is defined (typically once, in the
root layout) — without it, relative paths are passed through as-is into the
final HTML, which works fine for same-origin browser navigation but breaks
for any external consumer that can't resolve a relative URL against your
site's origin (or that resolves it incorrectly). The fix:

```jsx
// app/layout.jsx
export const metadata = {
  metadataBase: new URL('https://acme.example.com'),
  title: 'Acme Inc',
};
```

With `metadataBase` set, `openGraph.images: ['/og-pricing.png']` anywhere in
the tree now correctly resolves to
`https://acme.example.com/og-pricing.png` in the rendered output.
