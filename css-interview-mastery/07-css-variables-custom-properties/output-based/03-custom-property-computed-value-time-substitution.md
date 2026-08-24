# When Does `var()` Actually Resolve?

```css
.parent {
  --size: 10px;
}
.child {
  width: var(--size);
}
```

```js
document.querySelector('.parent').style.setProperty('--size', '50px');
```

**Question:** If the JS above runs *after* the stylesheet has already been parsed and applied (e.g. in response to a button click, well after initial page load), does `.child`'s `width` update?

**Answer:** Yes — `.child`'s `width` recomputes to `50px` immediately.

**Why:** `var()` substitution happens at **computed-value time**, not at "parse the stylesheet once" time — it's not a one-time textual substitution baked in when the CSS file is first processed (that would be how a Sass variable behaves, see the Sass-comparison theory file). Every time the browser needs to compute `.child`'s actual `width`, it re-resolves `var(--size)` against whatever `--size` currently evaluates to for `.child` at that moment, following the live cascade/inheritance chain. Since `.parent`'s `--size` was just changed via `setProperty()`, and `.child` inherits `--size` from `.parent` (no competing declaration of its own), the browser's next style recalculation picks up the new value and `.child`'s width becomes `50px`, with no need to re-fetch or reprocess the original stylesheet at all. This live, continuous re-resolution is the core mechanic that makes JS-driven theming and dynamic custom-property-based effects work without any manual DOM style manipulation beyond setting the one custom property.
