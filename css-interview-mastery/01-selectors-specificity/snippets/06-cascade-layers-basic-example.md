# Snippet: Basic Cascade Layers

```css
@layer reset, base, components, utilities;

@layer reset {
  * { margin: 0; padding: 0; box-sizing: border-box; }
}

@layer base {
  body { font-family: system-ui, sans-serif; line-height: 1.5; }
  h1 { font-size: 2rem; }
}

@layer components {
  .card {
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1rem;
  }
  .card h1 { font-size: 1.25rem; } /* wins over base's h1 — later layer, not higher specificity */
}

@layer utilities {
  .mt-0 { margin-top: 0 !important; } /* utilities layer declared last: intended to always win for normal rules too */
}
```

You can also add to a layer from multiple places in the file (or across files) as long as the name matches — layers accumulate rather than needing to be declared in one block:

```css
@layer components {
  .card { padding: 1rem; }
}
/* ...later in the same file, or a different file entirely... */
@layer components {
  .card__title { font-weight: 600; }
}
```
