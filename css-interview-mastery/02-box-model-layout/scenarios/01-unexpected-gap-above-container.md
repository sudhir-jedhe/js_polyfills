# Scenario: Unexplained Gap Above a Container

**Scenario:** A designer reports a mysterious ~32px gap between the top of the browser viewport and a full-width hero `<section>`, even though `body { margin: 0; }` is set and the hero section itself has no margin or padding set on its outer edge — only its first child, an `<h1>`, has `margin-top: 32px` from the base typography styles. Where's the gap coming from, and how do you fix it?

**Diagnosis:** This is parent/first-child margin collapsing. `<body>` has `margin: 0`, but the `<h1>`'s `margin-top: 32px` is collapsing *through* both the `<section>` and the `<body>` (since neither has padding, border, or a new block-formatting-context on their top edge), and landing as a margin **above** `<body>` itself, pushing the entire page down from the top of the viewport. This is a very common real-world bug — the DevTools box model inspector for `<body>` will show `margin-top: 0` even while the *actual rendered position* of `<body>` is offset, because collapsed margins render outside the box they're nominally attached to.

**Fix — stop the collapse at the boundary where it should logically end (the hero section), not by chasing it further down:**

```css
.hero {
  /* any of these independently breaks the collapse chain */
  display: flow-root; /* preferred: zero other side effects */
  /* or: padding-top: 1px; border-top: 1px solid transparent; overflow: hidden; */
}
```

`display: flow-root` on `.hero` establishes a new block formatting context, which prevents the `<h1>`'s top margin from collapsing through `.hero`'s own top edge — so the 32px margin now renders correctly *inside* `.hero`, above the `<h1>`, instead of leaking out above the entire page.

**Why not just set `margin-top: 0` on the `<h1>` instead?** That would fix the symptom but reintroduce the bug the moment someone reuses that same `<h1>` typography style elsewhere where the collapsing-through effect is actually undesired in a different, non-obvious way — `display: flow-root` on the *container* fixes it at the layer where the leak actually happens, which is the more durable fix and doesn't require every consumer of the shared heading style to remember a special case.
