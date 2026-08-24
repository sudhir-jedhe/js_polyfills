# Where Does This Absolutely Positioned Element Actually Land?

```html
<body>
  <div class="layout">
    <section class="content">
      <div class="corner-badge">TOP RIGHT?</div>
    </section>
  </div>
</body>
```

```css
.layout { display: block; }        /* static */
.content { display: block; padding: 40px; } /* static */
.corner-badge {
  position: absolute;
  top: 0;
  right: 0;
}
```

**Question:** Neither `.layout` nor `.content` sets a `position` value. Where does `.corner-badge` end up?

**Answer:** Pinned to the top-right corner of the **initial containing block** — in practice, the top-right of the viewport/document, not the top-right of `.content`.

**Why:** `.corner-badge` walks up its ancestor chain looking for the nearest ancestor that is positioned (`relative`/`absolute`/`fixed`/`sticky`) or that has a `transform`/`filter`/`perspective`/`will-change` naming one of those. Neither `.content` nor `.layout` qualifies (both are `static` with no other containing-block-creating property), so the search continues all the way to the root, and `.corner-badge` falls back to the initial containing block — a box the size of the viewport, anchored at the top of the document. It will visually sit at the top-right of the *page*, potentially far from `.content`, and it will scroll away with the page's normal content (unlike `fixed`, which would stay pinned as you scroll). The fix is simply adding `position: relative;` to `.content` (or whichever ancestor is meant to be the anchor).
