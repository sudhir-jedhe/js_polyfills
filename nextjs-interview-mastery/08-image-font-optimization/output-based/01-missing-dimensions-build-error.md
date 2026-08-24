## What happens when this builds?

```jsx
import Image from 'next/image';

export default function ProductThumb({ product }) {
  return <Image src={product.imageUrl} alt={product.name} />;
}
```

**Answer:** This throws a build/runtime error: `Image with src "..." is
missing required "width" property.` (or similarly for `height`) — it does
not silently render an unsized image the way a plain `<img>` would.

**Why:** Unlike a raw `<img>`, which happily renders with unknown dimensions
and just causes layout shift once its natural size becomes known,
`next/image` treats `width`/`height` (or `fill`) as a required contract,
because it needs those values to compute and reserve the correct aspect
ratio in the DOM ahead of the image loading — the entire CLS-prevention
mechanism depends on this being non-optional. The fix is either providing
real dimensions:

```jsx
<Image src={product.imageUrl} alt={product.name} width={300} height={300} />
```

or switching to `fill` mode if the container's size is meant to be
responsive/dynamic rather than fixed:

```jsx
<div className="relative aspect-square w-full">
  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
</div>
```
