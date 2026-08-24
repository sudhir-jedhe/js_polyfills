# Snippet: Zebra-Striping a Table with `nth-child`

```html
<table>
  <tbody>
    <tr><td>Row 1</td></tr>
    <tr><td>Row 2</td></tr>
    <tr><td>Row 3</td></tr>
    <tr><td>Row 4</td></tr>
  </tbody>
</table>
```

```css
tbody tr:nth-child(odd) {
  background: #f9f9f9;
}
tbody tr:nth-child(even) {
  background: #fff;
}

/* Highlight the last 2 rows regardless of total row count */
tbody tr:nth-last-child(-n+2) {
  font-weight: bold;
}
```

Because every sibling in `<tbody>` is a `<tr>`, `:nth-child()` and `:nth-of-type()` are equivalent here — but `:nth-child()` is the conventional choice for zebra striping since rows are homogeneous by definition.
