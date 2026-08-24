# What Happens to This Element in an RTL Document?

```html
<html dir="rtl">
  <body>
    <div class="alert">Warning message</div>
  </body>
</html>
```

```css
.alert {
  border-inline-start: 4px solid crimson;
  padding-inline-start: 1rem;
  margin-inline: 0 1rem;
}
```

**Question:** On which physical side does the red border render, and what does `margin-inline: 0 1rem` produce?

**Answer:** The red border renders on the **right** side of the element (not the left). `margin-inline: 0 1rem` produces `margin-right: 0` and `margin-left: 1rem` (the first value is the inline-start margin, the second is inline-end).

**Why:** In an RTL document, the inline axis still runs "start to end" in reading order, but reading order is right-to-left — so `inline-start` maps to the **right** physical edge, and `inline-end` maps to the **left** physical edge (the reverse of LTR, where `inline-start` is `left`). `border-inline-start` therefore paints on the right in this RTL document. Similarly, `margin-inline: 0 1rem` sets the start value (0) on the right and the end value (1rem) on the left — flipped from what the same shorthand would produce in an LTR document, where it would instead be `margin-left: 0; margin-right: 1rem;`. This automatic flip with zero extra CSS is precisely the point of logical properties.
