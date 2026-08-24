# Scenario: Sticky Sidebar Won't Stick Inside a Flex Layout

**Scenario:** A two-column layout uses `display: flex` — a narrow sidebar with navigation links, and a long main content column. The sidebar has `position: sticky; top: 16px;`, but it scrolls away with the page instead of sticking. What's going wrong, and how do you fix it?

**Diagnosis:**

There are two usual suspects in a flex/grid sticky-sidebar setup:

1. **The sidebar's height is being stretched to match its sibling.** By default, flex items stretch to the cross-axis size of the tallest item (`align-items: stretch` is the default). If the sidebar (the flex item, or a wrapper around the sticky element) is being stretched to the *same height* as the tall main content column, then the sidebar's own box has no extra room to scroll within relative to its content — but more importantly, if the *sticky element itself* is stretched to fill that full height, its containing block is exactly as tall as the element, leaving no room to "travel," per the third `sticky` requirement (containing block must be taller than the sticky element).
2. **An `overflow` value on the flex container or an intermediate wrapper.** If the flex container (or anything between the sticky element and the viewport) has `overflow: hidden`/`auto`/`scroll`, that ancestor becomes the sticky element's scroll boundary instead of the page — and depending on that ancestor's actual height/scroll behavior, the sidebar may appear to never stick at all.

**Fix:**

```css
.layout {
  display: flex;
  align-items: flex-start; /* stop stretching children to equal height — lets the sidebar be only as tall as its own content */
  gap: 24px;
}
.sidebar {
  position: sticky;
  top: 16px;
  /* now the sidebar's own box is only as tall as its nav links,
     while .layout (its containing block for sticky purposes) is as tall
     as the long main column — giving it real room to stick and travel */
}
.main-content {
  flex: 1;
}
```

`align-items: flex-start` is the fix in the overwhelming majority of "sticky sidebar in a flex row" bugs — it's such a common combination that it's worth remembering as a pattern: *sticky sidebar next to a taller column, inside flex/grid, almost always needs `align-items: flex-start` (or `align-self: flex-start` on just the sidebar) so the sidebar isn't stretched to match its sibling's height.* Separately, double check no ancestor between the sidebar and the viewport has an unwanted `overflow` value — a wrapper added purely to fix an unrelated horizontal-scroll bug is a common culprit.
