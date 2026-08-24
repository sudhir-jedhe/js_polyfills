## Why did LCP get *worse* after this "optimization"?

```jsx
export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {products.map((p) => (
        <Image
          key={p.id}
          src={p.imageUrl}
          alt={p.name}
          width={300}
          height={300}
          priority // added to "make images load faster"
        />
      ))}
    </div>
  );
}
```

A grid of 40 products, all marked `priority`. LCP got measurably worse after
this change, not better.

**Answer:** Marking every image `priority` disables lazy loading and adds a
`<link rel="preload">` hint for *all 40 images*, so the browser now attempts
to eagerly fetch every single one at high priority immediately on page
load — including the 36 that are below the fold and weren't going to be
visible for a while anyway. This creates network contention: 40 simultaneous
high-priority requests compete for the same limited bandwidth/connection
pool that the *actual* LCP-critical resource (probably the first row of
images, or none of them if the LCP element is something else entirely) now
has to share, slowing everything down including the one image that mattered
most.

**Why:** `priority` is meant to be a scarce signal — "this specific resource
is critical to the initial paint, prioritize it above everything else." When
applied broadly, it stops communicating anything meaningful to the browser's
scheduler; every resource claims to be equally critical, which is
functionally the same as none of them being prioritized, while also
defeating the bandwidth-saving benefit of lazy-loading below-the-fold
content in the first place. The fix is applying `priority` only to the
actual LCP candidate(s) — typically just the first visible row, or often
just a single hero image:

```jsx
{products.map((p, i) => (
  <Image
    key={p.id}
    src={p.imageUrl}
    alt={p.name}
    width={300}
    height={300}
    priority={i < 4} // only the first visible row
  />
))}
```
