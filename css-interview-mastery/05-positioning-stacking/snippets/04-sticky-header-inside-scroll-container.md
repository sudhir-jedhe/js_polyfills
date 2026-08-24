# Snippet: A Correctly Configured Sticky Header

```html
<div class="scroll-area">
  <table>
    <thead>
      <tr class="sticky-row">
        <th>Name</th>
        <th>Score</th>
      </tr>
    </thead>
    <tbody>
      <!-- many rows -->
    </tbody>
  </table>
</div>
```

```css
.scroll-area {
  height: 400px;
  overflow-y: auto; /* this IS the scroll container the sticky row sticks within */
}
.sticky-row th {
  position: sticky;
  top: 0; /* required offset — the threshold to stick at */
  background: white; /* sticky elements need an opaque background, or content will show through underneath */
  z-index: 1; /* keeps the header above scrolling body rows, which paint in tree order otherwise */
}
```

All three requirements are satisfied here: an offset is set (`top: 0`), the only ancestor with non-`visible` overflow (`.scroll-area`) is the intended scroll container rather than something clipping it out, and `.scroll-area`'s content is far taller than the header, giving it plenty of room to stick as the table scrolls.
