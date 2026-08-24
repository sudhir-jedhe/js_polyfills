# Snippet: Basic Flex Container

```css
.toolbar {
  display: flex;
  gap: 8px;
}
.toolbar__item {
  padding: 6px 12px;
  background: #eee;
  border-radius: 4px;
}
```

```html
<div class="toolbar">
  <button class="toolbar__item">Bold</button>
  <button class="toolbar__item">Italic</button>
  <button class="toolbar__item">Underline</button>
</div>
```

Three buttons laid out in a row, each sized to its own content, with a consistent 8px gap between them and none around the outer edges.
