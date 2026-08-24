# Snippet: Basic Theming with Custom Properties

```css
:root {
  --color-bg: #ffffff;
  --color-text: #1a1a1a;
  --color-accent: #3b82f6;
  --spacing: 16px;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  padding: var(--spacing);
}

.button {
  background: var(--color-accent);
  color: white;
  padding: calc(var(--spacing) / 2) var(--spacing);
  border: none;
  border-radius: 6px;
}
```

```html
<body>
  <button class="button">Click me</button>
</body>
```

Every value that could plausibly need to change per-theme or per-brand is expressed as a custom property once, at the root, and referenced everywhere via `var()` — changing `--color-accent` in one place updates every element that reads it, with no need to hunt down every individual color declaration across the stylesheet.
