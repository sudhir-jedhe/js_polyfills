## Why does this image fail to load in production (but the URL works fine in a browser tab)?

```jsx
import Image from 'next/image';

export default function BlogCover({ post }) {
  // post.coverImage = "https://cdn.contentful.com/assets/xyz/cover.jpg"
  return <Image src={post.coverImage} alt={post.title} width={1200} height={630} />;
}
```

```js
// next.config.js — unchanged, default config
module.exports = {};
```

**Answer:** The image request fails with a 400-level error from Next's
image optimizer (something like "Invalid src prop... hostname is not
configured under images in your next.config.js"). The raw URL loads fine
directly in a browser because that's a completely different request path —
Next's optimizer is what's rejecting it, not the CDN itself.

**Why:** For security, `next/image` refuses to fetch and optimize images
from arbitrary external hostnames by default — this prevents your server
from being used as an open image-proxying/optimization service for any URL
an attacker feeds it (a real abuse vector on unconfigured setups). Every
external hostname you actually intend to load images from must be
explicitly allow-listed via `images.remotePatterns` (or the older
`images.domains`) in `next.config.js`:

```js
// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.contentful.com', pathname: '/assets/**' },
    ],
  },
};
```

This is a very common "works in dev with a local image, breaks the moment we
point at the real CMS" bug, precisely because a locally-sourced test image
(`/public/test.jpg`) never triggers this check at all — only remote URLs do.
