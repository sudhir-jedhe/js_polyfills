# Snippet: Styling `::placeholder` and `::selection`

```html
<input type="text" placeholder="Search products..." />
<p>Try selecting this paragraph's text with your mouse.</p>
```

```css
input::placeholder {
  color: #9ca3af;
  opacity: 1;         /* Firefox defaults placeholder opacity below 1 — reset explicitly */
  font-style: italic;
}

input:focus::placeholder {
  opacity: 0.5;        /* fade the hint once the user starts focusing/typing */
}

::selection {
  background: #fde68a;
  color: #111827;
}

/* Selection styling can be scoped to a specific element too */
p::selection {
  background: #bae6fd;
}
```

Only a narrow set of visual properties is honored inside `::selection` (background/foreground color, text-shadow) — you cannot use it to change font-size or add padding, since the browser intentionally prevents selection styling from altering text layout.
