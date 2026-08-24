# Why does this page score poorly on CLS despite using `next/image`?

```tsx
import Image from 'next/image';

export function ProductCard({ product }: { product: { imageUrl: string; name: string } }) {
  return (
    <div className="card">
      <Image src={product.imageUrl} alt={product.name} fill />
      <h3>{product.name}</h3>
    </div>
  );
}
```

```css
.card {
  display: flex;
  flex-direction: column;
}
```

The team used `next/image` correctly (they think) with the `fill` prop, expecting it to handle sizing automatically like it does with explicit `width`/`height`. Lighthouse still reports a high CLS score for this component.

**Answer:** The `fill` prop makes the image absolutely positioned to fill its **nearest positioned parent** — but the `.card` div here has no explicit `position: relative` and no defined height, so the browser has nothing to reserve space against before the image loads. The image (and the rest of the card's layout) collapses to zero height until the image finishes loading, at which point the page's content shifts to accommodate it — exactly the layout shift `next/image`'s dimension-reservation behavior is supposed to prevent, defeated by a missing CSS rule rather than a missing `next/image` prop.

**Why:** `fill` is fundamentally different from passing explicit `width`/`height`: with explicit dimensions, `next/image` can compute and reserve an aspect-ratio box directly, independent of any parent CSS. With `fill`, the *parent* is responsible for establishing the size the image will fill — `next/image` can't reserve space it doesn't control. The fix requires two things on the parent: `position: relative` (so `fill`'s `position: absolute` has something to position against) and an explicit height or aspect-ratio (`.card { position: relative; aspect-ratio: 4 / 3; }` or a fixed height), so the space is reserved by CSS before the image data ever arrives. `fill` is the right choice specifically when an image needs to adapt to a dynamically-sized container (a responsive grid cell), but it shifts the sizing responsibility to CSS rather than removing it — it doesn't mean "don't worry about dimensions at all."
