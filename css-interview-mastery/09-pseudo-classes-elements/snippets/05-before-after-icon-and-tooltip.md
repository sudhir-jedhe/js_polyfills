# Snippet: `::before` / `::after` for Icons and a Tooltip

```html
<a class="external" href="https://example.com">External link</a>
<button class="tooltip-trigger" data-tooltip="Copied!">Copy</button>
```

```css
/* Decorative icon appended after external links, no extra markup needed */
.external::after {
  content: " ↗";
  font-size: 0.8em;
  color: #888;
}

/* CSS-only tooltip using generated content + attr() */
.tooltip-trigger {
  position: relative;
}
.tooltip-trigger::before {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
.tooltip-trigger:hover::before,
.tooltip-trigger:focus-visible::before {
  opacity: 1;
}
```

The tooltip text lives in `data-tooltip` and is pulled in via `content: attr(...)`, so the same CSS rule works for any element carrying that attribute — no per-tooltip CSS rule required.
