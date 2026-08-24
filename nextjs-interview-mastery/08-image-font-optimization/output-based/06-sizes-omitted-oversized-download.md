## Why is this "correctly working" image actually a performance problem?

```jsx
// A card image that's always rendered at roughly 300px wide in a 3-column grid,
// but the container is styled responsively without a matching `sizes` prop.
<div className="relative w-full aspect-square" style={{ maxWidth: '300px' }}>
  <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
</div>
```

The image displays correctly at the right visual size on every device. A
performance audit still flags it for "serving an oversized image" on mobile.

**Answer:** No `sizes` prop was provided on a `fill` image whose actual
rendered width (~300px, capped by `maxWidth`) is much smaller than the
viewport. Without `sizes`, Next.js's responsive `srcset` generation falls
back to treating the image as if it could be close to full-viewport-width,
so it selects (and the browser downloads) a much larger image variant than
the ~300px actually needed — the image *looks* fine because it's scaled down
by CSS after downloading, but the bytes transferred are needlessly large,
especially costly on mobile connections.

**Why:** `sizes` is the mechanism that tells the browser (before it even
finishes laying out the page) what the image's rendered width will actually
be at different breakpoints, so it can pick the right candidate from the
generated `srcset` instead of guessing. Because this looks visually correct
in every manual check, it's the kind of bug that survives code review and
QA and only surfaces in a Lighthouse/PageSpeed audit or real-user monitoring
data. The fix:

```jsx
<Image
  src={product.imageUrl}
  alt={product.name}
  fill
  sizes="300px"
  className="object-cover"
/>
```

or, if the card width does vary meaningfully by breakpoint rather than
being capped at a fixed 300px everywhere:

```jsx
sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 300px"
```
