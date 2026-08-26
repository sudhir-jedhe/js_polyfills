# Scenario: A Product Page Has a Lighthouse LCP Score of 4.2s

A product detail page — hero product photo above the fold, description
below — scores poorly on LCP in both Lighthouse and real-user Core Web
Vitals data. The image itself loads in well under a second once its request
starts, so the team is confused about where the 4+ seconds is going.

**Approach:**

Work through this as an actual triage, not a guess-and-check:

**1. Confirm the LCP element.** Run Lighthouse (or check the Core Web Vitals
report's LCP element callout) to verify the product photo is in fact the
reported LCP element, rather than assuming — sometimes it's actually a large
text block or a different image entirely, in which case the fix target
changes completely.

**2. Check when the image's request actually starts**, not just how long it
takes once started — this is usually the real culprit for "the image itself
is fast but LCP is slow." Look at the current implementation:

```jsx
// Likely culprit
<Image src={product.imageUrl} alt={product.name} width={800} height={800} />
```

No `priority` means this image is lazy-loaded by default — even though it's
above the fold, the browser doesn't start fetching it until Next's lazy
loading logic (viewport-intersection-based) decides to, which for an image
present at initial scroll position should trigger quickly, but still adds
avoidable delay compared to an eager, preloaded fetch. This is almost always
the single biggest lever here.

**3. Check whether the image URL depends on a client-side fetch** — if
`product` comes from `useEffect` + client-side `fetch` in a Client
Component rather than being resolved server-side, the browser can't even
discover the image URL until after JS hydrates and that fetch resolves,
which is a much larger delay than lazy-loading alone. If so, the real fix is
moving the data fetch into a Server Component so `product.imageUrl` is known
and embedded in the initial HTML.

**4. Apply the fix**, assuming the image is genuinely server-rendered and
just missing `priority`:

```jsx
<Image
  src={product.imageUrl}
  alt={product.name}
  width={800}
  height={800}
  priority
/>
```

**5. Re-measure**, and if LCP is still poor, check the image's actual file
size/format — a source image that's much larger than its rendered
dimensions still costs bytes even with Next's automatic format conversion;
consider whether the CMS/upload pipeline should downscale extremely large
source images before they ever reach the optimizer.

The key diagnostic instinct to demonstrate: **"the image itself loads fast"
is a strong signal that the problem is *when the request starts*, not the
image's size/format** — which points straight at a missing `priority` (or a
client-side data dependency delaying URL discovery) rather than needing any
image-compression work.
