# Snippet: Basic `@layer` Usage

```css
/* Declare layer order once — this fixes priority regardless of where each layer is later defined */
@layer reset, base, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
}

@layer base {
  body { font-family: system-ui, sans-serif; line-height: 1.5; }
  a { color: #2563eb; }
}

@layer components {
  .btn {
    padding: 0.6em 1.2em;
    border-radius: 8px;
    background: #e5e7eb;
  }
}

@layer utilities {
  /* Even a single low-specificity class here beats .btn from the earlier "components" layer,
     because layer order outranks specificity entirely. */
  .bg-blue { background: #2563eb; }
}
```

```html
<button class="btn bg-blue">Click me</button>
<!-- renders with the blue background from .bg-blue, because "utilities" is declared
     after "components" — this holds true even though both selectors have identical
     specificity (0,1,0), and would ALSO hold true if .btn had higher specificity. -->
```
