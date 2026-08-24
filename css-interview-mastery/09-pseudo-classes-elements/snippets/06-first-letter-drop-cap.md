# Snippet: Drop Cap with `::first-letter`

```html
<p class="intro">
  Once upon a time, in a small village at the edge of the forest, there lived a clockmaker.
</p>
```

```css
.intro::first-letter {
  float: left;
  font-size: 3.5em;
  line-height: 0.8;
  font-weight: bold;
  padding-right: 0.1em;
  color: #b3541e;
}
```

`float` is one of the few layout-affecting properties `::first-letter` actually supports (unlike `::first-line`, which is limited to text/font/color properties), which is exactly why drop caps are its signature use case — the floated first letter pulls out of normal flow and lets the following text wrap around it.
