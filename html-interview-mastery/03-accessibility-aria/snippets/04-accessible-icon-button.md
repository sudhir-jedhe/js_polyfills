# Snippet: Accessible Icon-Only Button

```html
<!-- aria-label on the button itself: simplest, most common pattern -->
<button type="button" aria-label="Close dialog" onclick="closeDialog()">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
  </svg>
</button>
```

```html
<!-- Alternative: visually-hidden text INSIDE the button, no aria-label needed -->
<button type="button" onclick="closeDialog()">
  <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"/>
  </svg>
  <span class="visually-hidden">Close dialog</span>
</button>
```

Both are valid; the second avoids the "`aria-label` silently overrides visible content" risk entirely since there's no conflicting visible text to override, and it's more resilient if a future contributor adds visible text to the button without realizing an `aria-label` is silently suppressing it from being announced. `aria-hidden="true"` (plus `focusable="false"` for older IE/Edge SVG focus quirks) on the `<svg>` ensures the icon's own internal content, if any, isn't announced redundantly alongside the button's name.
