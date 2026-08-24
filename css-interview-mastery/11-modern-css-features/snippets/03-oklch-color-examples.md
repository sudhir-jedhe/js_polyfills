# Snippet: Authoring a Color Scale in `oklch()`

```css
:root {
  /* Same hue and chroma throughout, only lightness changes — produces an even,
     perceptually-consistent scale that's hard to achieve by hand-picking hex values */
  --blue-100: oklch(0.95 0.03 250);
  --blue-300: oklch(0.85 0.08 250);
  --blue-500: oklch(0.60 0.15 250);
  --blue-700: oklch(0.45 0.15 250);
  --blue-900: oklch(0.28 0.12 250);
}

.badge {
  background: var(--blue-100);
  color: var(--blue-900);
  border: 1px solid var(--blue-300);
}

.btn-primary {
  background: var(--blue-500);
  color: white;
}
.btn-primary:hover {
  background: var(--blue-700);
}
```

```css
/* Fallback for browsers without oklch() support */
.badge {
  background: #dbeafe; /* fallback hex, applied first */
  background: var(--blue-100); /* overridden by the oklch-based value where supported */
}
```

Because a CSS engine that doesn't understand `oklch()` treats the whole declaration as invalid and ignores it (rather than partially applying it), listing a hex fallback *before* the `oklch()`-based declaration is a safe progressive-enhancement pattern: unsupported browsers keep the hex value, supporting browsers use the later, more precise one.
