# Scenario: Typography Visibly "Jumps" When Resizing the Browser

**Scenario:** A marketing page defines its headline sizes with three fixed breakpoints:

```css
h1 { font-size: 2rem; }
@media (min-width: 768px) { h1 { font-size: 2.75rem; } }
@media (min-width: 1200px) { h1 { font-size: 3.5rem; } }
```

QA reports that slowly resizing the browser window (or viewing on a device rotated between portrait/landscape near the 768px boundary) shows a visibly sudden, jarring jump in headline size exactly at the breakpoint, rather than a smooth resize — and asks whether this can be made to look more polished, without adding a large number of additional breakpoints.

**Diagnosis:**

This is inherent to breakpoint-based sizing: `font-size` only changes at the exact moment a `@media` condition flips from false to true, producing a discrete, instantaneous jump rather than a gradual size change. Adding more breakpoints (e.g. one every 100px of viewport width) would make the jumps smaller and less jarring, but never eliminates the fundamental steppiness, and adds a lot of maintenance overhead for diminishing returns.

**Fix — replace the breakpoint ladder with `clamp()`-based fluid sizing:**

```css
h1 {
  font-size: clamp(2rem, 1.2rem + 2.5vw, 3.5rem);
}
```

This preserves the same practical floor (`2rem`, matching the old mobile size) and ceiling (`3.5rem`, matching the old desktop size), but the value in between now scales continuously with viewport width via the `1.2rem + 2.5vw` formula — there is no viewport width at which the size "jumps"; it changes by a fraction of a pixel per pixel of window resize, which reads as smooth to the eye. This also collapses three separate declarations (base + two media queries) into a single line, which is easier to maintain, and it automatically handles every viewport width in between the old breakpoints correctly, rather than only the three widths the original breakpoints happened to define explicitly.

**When you'd still want fixed breakpoint sizes instead:** if the design calls for headline size to be tied to a specific, deliberate layout change (e.g. "at this exact width, the layout switches from single-column to two-column, and the headline should snap to a size that matches the new layout's proportions instantly, in sync with that layout change"), a breakpoint-based jump might be the *intended* behavior, tied semantically to the layout shift rather than being an accidental side effect of how sizing was implemented. The key distinguishing question is whether the size change is meant to track a discrete layout event, or is meant to be a continuously and independently scaling value — `clamp()` is for the latter.
