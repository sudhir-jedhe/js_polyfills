# Interview Q&A — Flexbox Patterns and Traps

**Q: How do you build equal-height columns with flexbox, and why does it work without any explicit height being set?**
Just use a flex container with the default `align-items: stretch` (or set it explicitly) — every item without its own explicit cross-size automatically stretches to match the tallest item in the line. It works without explicit heights because `stretch` is part of the core cross-axis sizing algorithm, not a hack; it's simply the default behavior for any item that didn't declare its own cross-size.

**Q: How do you build a "sticky footer" that sits at the bottom of the viewport on short pages but still scrolls normally on long ones?**
Make the page a `column`-direction flex container with `min-height: 100vh` (not `height`, which would clip long pages), give the main content area `flex: 1 1 auto` so it absorbs all leftover vertical space, and leave the header/footer at `flex: 0 0 auto` (their natural content height). The `min-height` ensures short pages still fill the viewport; the flexible main area is what pushes the footer down to the bottom in that case.

**Q: Why can `justify-content: space-between` look broken on the last (partial) line of a wrapped flex container?**
Because `space-between` distributes leftover space independently *per flex line* — a full line has no leftover space to distribute, so it's invisible there, but a partial last line does have leftover space, and `space-between` pushes those items to the line's start/end edges, breaking the column alignment the fuller rows above it implied. `gap` (a fixed value between items regardless of line size) avoids this entirely.

**Q: Why might nav bar links unexpectedly wrap onto two lines instead of staying on one, even though the container isn't fully out of room yet?**
Because flex items default to `flex-shrink: 1`, and their automatic minimum width (`min-width: auto`) for text content is based on the longest unbreakable word, not the label's full width — so the shrink algorithm can keep shrinking a link past its natural label width, forcing the text to wrap, before it ever hits that much smaller automatic floor. Fixing it requires `flex-shrink: 0` or an explicit `min-width`/`white-space: nowrap`.

**Q: When would you choose `flex: 1 1 auto` over `flex: 1 1 0%` (i.e. `flex: auto` vs. `flex: 1`)?**
`flex: auto` (basis from content/width) is appropriate when you want items to start from their natural size and only grow/shrink the *leftover* space around that — useful when item content length should meaningfully influence final size. `flex: 1` (basis `0%`) is appropriate when you want strictly equal or ratio-based sizing driven purely by the grow values, ignoring each item's content length as a factor entirely — the more common choice for uniform grid-like flex layouts.
