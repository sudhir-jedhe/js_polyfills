*** copy 06-visually-hidden-utility.md ***

# Snippet: The `.visually-hidden` (Screen-Reader-Only) Utility Class

```css
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

```html
<button>
  <svg aria-hidden="true"><!-- trash icon --></svg>
  <span class="visually-hidden">Delete item</span>
</button>

<a href="/rss">
  <svg aria-hidden="true"><!-- rss icon --></svg>
  <span class="visually-hidden">Subscribe via RSS</span>
</a>
```

**Why not just `display: none` or `visibility: hidden`?** Both of those remove the element from the accessibility tree entirely — a screen reader wouldn't announce the text either. This specific combination of properties (near-zero dimensions, `overflow: hidden`, clip-based visual hiding) removes the content *visually* while keeping it fully present and announced in the accessibility tree — this exact recipe (not an approximation of it) is the industry-standard pattern used by most CSS frameworks (it's Bootstrap's `.sr-only`, Tailwind's `.sr-only`, and WordPress's `.screen-reader-text`, all functionally identical).

**Common mistake:** using `opacity: 0` or `font-size: 0` instead — these don't reliably hide content visually in all cases and can create confusing behavior (an invisible-but-still-occupying-space element, or text a screen reader skips because zero font-size is sometimes treated as "not rendered" by some engines) — the `clip`/`overflow` recipe above is deliberately the safe, well-tested one.
