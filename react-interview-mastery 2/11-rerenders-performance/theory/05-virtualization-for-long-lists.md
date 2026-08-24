# Virtualization for Long Lists

When a list has hundreds/thousands of rows, the bottleneck isn't re-renders — it's the sheer number of DOM nodes. **Virtualization** renders only the rows currently visible in the viewport (plus a small buffer), swapping content in and out as the user scrolls, keeping DOM node count roughly constant. Reach for `react-window` (or `react-virtual`/`@tanstack/react-virtual`) when a list is long, rows are uniform-ish height, and initial render or scroll performance is measurably janky — not by default for every list.

## Full list render vs virtualized list

| Aspect | Rendering all items | Virtualized (`react-window`) |
|---|---|---|
| DOM nodes | One per item, grows linearly with data | Roughly constant — only visible rows + buffer |
| Complexity | Simple, works with normal CSS layout (e.g., variable height flows naturally) | Requires fixed/estimated row heights, more setup, harder to combine with some CSS (e.g., `:nth-child`) |
| Common mistake | Rendering thousands of rows "because it works in dev" and only discovering jank on real/large datasets | Reaching for virtualization on small lists (<100 items) where it adds complexity for no measurable benefit |

Use plain rendering by default; switch to virtualization only once profiling shows the DOM node count itself (not JS logic) is the bottleneck, typically in the hundreds-to-thousands-of-rows range.

## What is virtualization, and when should you use a library like `react-window`?

Virtualization renders only the list rows currently in (or near) the viewport, recycling a small, roughly constant number of DOM nodes as the user scrolls, instead of mounting every row up front. Reach for it once a list is long enough (typically hundreds to thousands of rows) that DOM node count — not render logic — is the measured bottleneck; it adds setup complexity (fixed/estimated row heights) that isn't worth it for short lists.
