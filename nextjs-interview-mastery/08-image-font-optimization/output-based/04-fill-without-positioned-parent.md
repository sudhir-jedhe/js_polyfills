## Why is this image invisible (zero height) on the page?

```jsx
export default function CardImage({ src, alt }) {
  return (
    <div className="card-image-wrapper">
      <Image src={src} alt={alt} fill className="object-cover" />
    </div>
  );
}
```

```css
.card-image-wrapper {
  /* no position, no explicit height set */
  overflow: hidden;
  border-radius: 8px;
}
```

The image element is in the DOM (inspecting it in devtools shows it there),
but it renders as a zero-height sliver, effectively invisible.

**Answer:** `fill` makes the `<Image>` absolutely positioned relative to its
nearest positioned ancestor. `.card-image-wrapper` has no `position:
relative` (so the image ends up positioned relative to some further-up
ancestor instead of this wrapper) *and* has no explicit height, so even if
positioning were correct, there's no space for the absolutely-positioned
image to fill — an element with `height: auto` and only an absolutely
positioned child (which is taken out of normal document flow) collapses to
zero height.

**Why:** `fill` deliberately does not carry its own intrinsic size the way
`width`/`height` mode does — it's designed to defer sizing entirely to the
parent container, which means the parent *must* both establish a positioning
context and have a real height for the image to have anywhere to render
into. The fix addresses both:

```css
.card-image-wrapper {
  position: relative;
  aspect-ratio: 4 / 3; /* or a fixed height like height: 240px */
  overflow: hidden;
  border-radius: 8px;
}
```

This is one of the most common `next/image` bugs precisely because it
produces no error — no console warning, no build failure — just a silently
invisible image, which makes it harder to diagnose than the "missing
width/height" case that at least throws loudly.
