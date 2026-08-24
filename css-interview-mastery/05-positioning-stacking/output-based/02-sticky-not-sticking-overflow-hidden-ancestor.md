# Why Doesn't This Sticky Header Stick?

```html
<div class="page-wrapper">
  <div class="scroll-content">
    <div class="sticky-header">I want to stick to the top</div>
    <p>...lots of content, page scrolls normally...</p>
  </div>
</div>
```

```css
.page-wrapper {
  overflow-x: hidden; /* added to prevent horizontal scrollbars from a wide child element */
}
.sticky-header {
  position: sticky;
  top: 0;
}
```

**Question:** The page scrolls vertically via the normal document/viewport scroll (no inner scroll container). Why does `.sticky-header` fail to stick as the page scrolls?

**Answer:** Because `.page-wrapper`, an ancestor of `.sticky-header`, has `overflow-x: hidden`.

**Why:** The rule isn't "only `overflow: hidden` on both axes breaks sticky" — setting `overflow` to anything other than `visible` on *either* axis (`overflow-x`, `overflow-y`, or the shorthand `overflow`) turns that ancestor into a scroll container (even if it doesn't visibly scroll on that axis), and it becomes the boundary `.sticky-header` sticks within instead of the normal page/viewport scroll. Since `.page-wrapper` isn't actually a scrollable box in the way the developer intended (they only wanted to clip horizontal overflow), `.sticky-header`'s sticking behavior gets tied to a container that behaves unexpectedly — in many browsers this manifests as the sticky element never appearing to stick at all. The fix is to remove `overflow-x: hidden` from any ancestor of the sticky element (and, if the horizontal-scrollbar problem still needs solving, apply the `overflow-x: hidden` at a more targeted level that doesn't sit between the sticky element and its intended scroll context, or fix the root cause of the horizontal overflow instead).
