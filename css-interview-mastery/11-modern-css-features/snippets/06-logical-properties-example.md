# Snippet: Logical Properties for a Direction-Agnostic Card

```css
.card {
  padding-block: 1rem;
  padding-inline: 1.5rem;
  margin-block-end: 1rem;
  border-inline-start: 3px solid #2563eb; /* acts as a "left accent border" in LTR */
  text-align: start; /* like text-align: left in LTR, right in RTL — NOT the same as "left" */
}

.card__close-btn {
  position: absolute;
  inset-block-start: 0.5rem;
  inset-inline-end: 0.5rem; /* acts as "top-right" in LTR, "top-left" in RTL, automatically */
}
```

```html
<div class="card" dir="ltr">... renders with the accent border on the left, close button top-right ...</div>
<div class="card" dir="rtl">... same CSS, renders with the accent border on the right, close button top-left ...</div>
```

No `[dir="rtl"] .card { border-right: ...; border-left: none; }` override rule is needed anywhere — the single logical-property-based rule set handles both directions automatically, because `inline-start`/`inline-end` are resolved relative to the current writing direction rather than hardcoded to a physical side.
