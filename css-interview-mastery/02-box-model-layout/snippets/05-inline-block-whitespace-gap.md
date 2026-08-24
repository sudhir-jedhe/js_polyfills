# Snippet: `inline-block` Whitespace Gap and Fixes

```css
.item { display: inline-block; width: 100px; height: 60px; background: #cde; }
```
```html
<!-- BUGGY: the line breaks/spaces between elements render as visible gaps -->
<div class="item">A</div>
<div class="item">B</div>
<div class="item">C</div>
```
Each visible gap between items is roughly the width of a space character (varies by font-size), because the whitespace between the closing `>` and the next `<div` is literal inline content.

```html
<!-- FIX 1: remove the whitespace in markup entirely -->
<div class="item">A</div><div class="item">B</div><div class="item">C</div>
```
```css
/* FIX 2: zero out the parent's font-size, restore it on the children */
.list { font-size: 0; }
.item { font-size: 16px; display: inline-block; }
```
```css
/* FIX 3 (the modern, preferred fix): don't use inline-block for this at all — use flexbox */
.list { display: flex; gap: 0; } /* flex items never have a whitespace-gap issue, by design */
```
