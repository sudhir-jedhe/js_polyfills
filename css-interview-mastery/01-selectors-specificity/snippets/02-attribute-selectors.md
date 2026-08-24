# Snippet: Attribute Selectors

```css
/* exact match */
input[type="checkbox"] { width: 18px; height: 18px; }

/* attribute is present, any value (or empty) */
[data-loading] { opacity: 0.5; pointer-events: none; }

/* starts with */
a[href^="https://"] { padding-right: 14px; background: url(/icons/external.svg) no-repeat right center; }

/* ends with */
img[src$=".svg"] { shape-rendering: crispEdges; }

/* contains substring anywhere */
a[href*="analytics"] { display: none; }

/* space-separated word match (NOT substring) */
[class~="warning"] { color: darkorange; }

/* case-insensitive value match */
[data-status="ACTIVE" i] { color: green; }
```

```html
<input type="checkbox" />
<button data-loading>Saving…</button>
<a href="https://example.com">External link</a>
<img src="icon.svg" />
```
