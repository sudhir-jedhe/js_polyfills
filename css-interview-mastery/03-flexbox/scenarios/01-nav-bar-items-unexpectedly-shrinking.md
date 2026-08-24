# Scenario: Nav Bar Items Unexpectedly Shrinking and Wrapping Their Text

**Scenario:** A horizontal nav bar (`display: flex`) has five links. On medium-width viewports, the links start visually squishing — their text wraps onto two lines and the links themselves become narrower than their label needs, well before the container is actually out of room. Design says nothing should shrink below its natural label width; instead, less-important items should be hidden behind a "More" menu at that breakpoint. What's causing the squish, and how do you fix the immediate layout bug?

**Diagnosis:** Flex items default to `flex-shrink: 1` and — just as importantly — their default `min-width` is `auto`, which for a flex item resolves to its **content's minimum size** in most cases, EXCEPT text content specifically can still shrink below its natural single-line width once wrapping kicks in, because text has a very small true `min-content` width (the width of its longest unbreakable word, not its full label). So when the nav bar runs low on space, the browser's shrink algorithm keeps shrinking the links — since `flex-shrink: 1` allows it — right up until each link's text starts wrapping, which is not what "min-width: auto" protects against; it only protects against shrinking below the *word-wrap point*, not below the *unwrapped label width*.

**Fix — set an explicit `min-width` (or disable shrinking) on the nav items so they stop shrinking at their full label width:**

```css
.nav {
  display: flex;
  gap: 16px;
}
.nav__link {
  flex: 0 0 auto; /* don't grow, don't shrink at all — always render at natural content width */
  white-space: nowrap; /* extra safety: even if something forces a resize, text won't wrap mid-label */
}
```

With `flex-shrink: 0`, the nav links can no longer shrink below their content width at all — once the container genuinely runs out of room for all five at full size, they'll overflow the container instead of squishing (which is the correct failure mode here, since the actual fix for "not enough room" is meant to be the "More" menu, not shrinking).

**Follow-up (the actual responsive fix, not just the layout bug):** implement the "More" menu behavior with a `ResizeObserver` (or a container query once broadly sufficient for this use case) that measures whether all nav items fit and progressively moves the lowest-priority items into an overflow menu — the flex fix above is a prerequisite for that (it makes "doesn't fit" a detectable, well-defined overflow condition instead of a silent squish), not a replacement for it.
