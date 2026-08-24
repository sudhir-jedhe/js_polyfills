# Does This `fixed` Tooltip Stay Pinned to the Viewport?

```html
<section class="carousel">
  <div class="slide">
    <span class="fixed-badge">LIVE</span>
  </div>
</section>
```

```css
.carousel {
  will-change: transform; /* added ahead of a slide-swipe animation */
}
.fixed-badge {
  position: fixed;
  bottom: 12px;
  left: 12px;
}
```

**Question:** As the page scrolls, does `.fixed-badge` stay pinned to the bottom-left of the *viewport*, or does it move with `.carousel`?

**Answer:** It moves with `.carousel` — it is effectively pinned to `.carousel`'s bottom-left corner, not the viewport's.

**Why:** `will-change: transform` names a property (`transform`) that, when actually set, would create a containing block for `fixed`/`absolute` descendants — and per spec, `will-change` opts the element into that containing-block-creating behavior *preemptively*, even before any `transform` is actually applied. So `.carousel` becomes the containing block for `.fixed-badge`, and its offsets (`bottom`/`left`) resolve against `.carousel`'s box instead of the viewport. If `.carousel` scrolls out of view, `.fixed-badge` scrolls with it. This is a common surprise when `will-change` is added defensively "just in case" ahead of an animation, without realizing it has this side effect immediately, not just during the animation.
