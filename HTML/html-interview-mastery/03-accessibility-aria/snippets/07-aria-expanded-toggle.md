***  07-aria-expanded-toggle.md ***

# Snippet: `aria-expanded` Toggle Pattern

```html
<button id="faq-toggle" aria-expanded="false" aria-controls="faq-panel">
  What is your return policy?
</button>
<div id="faq-panel" hidden>
  <p>Items can be returned within 30 days of purchase.</p>
</div>
```

```js
const toggle = document.getElementById('faq-toggle');
const panel = document.getElementById('faq-panel');

toggle.addEventListener('click', () => {
  const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!isExpanded));
  panel.hidden = isExpanded; // hide if it WAS expanded, show otherwise
});
```

`aria-expanded` announces the current collapsed/expanded state directly on the trigger control itself ("What is your return policy?, button, collapsed" → "…, expanded") without requiring the screen reader user to separately inspect the panel. `aria-controls="faq-panel"` programmatically associates the button with the region it toggles — support for `aria-controls` announcement varies by screen reader, so it's considered a "nice to have" layered on top of `aria-expanded`, which is the attribute that reliably carries the actual state information across all major screen readers.
