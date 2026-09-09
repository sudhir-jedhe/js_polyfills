***  05-tabindex-usage.md ***

# Snippet: `tabindex` Usage Patterns

```html
<!-- tabindex="0": makes a non-interactive element part of the natural tab order -->
<div role="button" tabindex="0" onclick="expand()" onkeydown="handleKey(event)">
  Expand section
</div>

<!-- tabindex="-1": focusable only via JS (.focus()), never via Tab key -->
<h2 id="modal-title" tabindex="-1">Confirm Deletion</h2>
```

```js
// programmatically focusing a tabindex="-1" element (e.g. when a modal opens)
document.getElementById('modal-title').focus();
```

```html
<!-- ANTI-PATTERN: positive tabindex forces this ahead of everything else in tab order -->
<input tabindex="1" placeholder="Don't do this">
<input tabindex="2" placeholder="Or this">
<button>This natural-order button gets tabbed to AFTER both inputs above, even if it appears first in the DOM</button>
```

The fix for "I want this earlier in tab order" is virtually always to **move it earlier in the DOM**, not to add a positive `tabindex` — DOM reordering keeps tab order, visual order, and screen-reader reading order all consistent with each other.
