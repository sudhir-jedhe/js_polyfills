# Interview Q&A — `auto-fill`/`auto-fit` and Track Sizing

**Q: What's the difference between `auto-fill` and `auto-fit`?**
Both compute the same number of tracks — as many as fit the container based on the `minmax()` minimum. The difference is what happens to tracks that end up with no item in them: `auto-fill` keeps them in the layout (they render empty, taking up space), while `auto-fit` collapses them to `0px`, letting the tracks that do have items stretch to fill the freed-up space instead.

**Q: If a container has enough items to fill every track that could possibly fit, do `auto-fill` and `auto-fit` behave differently?**
No — they produce identical results in that case, because there are no empty tracks for `auto-fit` to collapse. The difference is only observable when there are *fewer* items than the number of tracks the container could otherwise fit.

**Q: Why won't a `1fr` grid track shrink below its content's natural minimum size, even in a narrow container?**
Because a track's automatic minimum size defaults to `auto` (effectively `min-content`), not `0`. An `fr` track will grow to accommodate un-shrinkable content (like an unbreakable long string) rather than shrink past that floor, which can cause the grid to overflow its container. The fix is `minmax(0, 1fr)`, which explicitly overrides that automatic floor down to zero.

**Q: What does `minmax(min, max)` do if `min` is larger than `max`?**
The `max` value is ignored, and the track behaves as if sized to `min` alone — an invalid inverted range doesn't error out, it just collapses to the more restrictive (minimum) bound.

**Q: How does `gap` interact with `fr` track sizing?**
`gap` space is reserved and subtracted from the container's available space *before* `fr` tracks divide up what's left — it's never itself distributed as part of an `fr` share. Adding or increasing `gap` on a grid with `fr` tracks will shrink those tracks somewhat, since there's less remaining space for them to divide, whereas fixed-length tracks are completely unaffected by `gap` either way.
