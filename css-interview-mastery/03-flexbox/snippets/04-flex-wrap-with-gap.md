# Snippet: `flex-wrap` With `gap`

```css
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px; /* row-gap: 8px, column-gap: 12px */
}
.tag {
  padding: 4px 10px;
  background: #eef;
  border-radius: 999px;
  flex: 0 0 auto; /* don't grow or shrink — tags keep their natural content width */
}
```

```html
<div class="tag-list">
  <span class="tag">javascript</span>
  <span class="tag">css</span>
  <span class="tag">accessibility</span>
  <span class="tag">performance</span>
  <span class="tag">testing</span>
  <span class="tag">design-systems</span>
</div>
```

As the container narrows, tags wrap onto additional lines instead of shrinking or overflowing, and `gap` keeps consistent spacing both within a line (`column-gap: 12px`) and between wrapped lines (`row-gap: 8px`).
