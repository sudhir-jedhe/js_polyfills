# Runtime Updates via JavaScript

Because custom properties are real, live entries in the browser's style system — not compiled away like a preprocessor variable — JavaScript can read and write them directly, and the browser recomputes every affected style immediately. This is the mechanism behind JS-driven theming, dynamic CSS-based animations, and passing arbitrary computed values (like a measured element's height) into CSS without inline styles for every individual property.

## Reading a custom property's computed value

```js
const root = document.documentElement;
const computedColor = getComputedStyle(root).getPropertyValue('--brand-color').trim();
console.log(computedColor); // e.g. '#3b82f6' — always trim(), since the returned string can include leading whitespace
```

`getComputedStyle()` returns the *resolved* value after the full cascade/inheritance has been applied for that specific element — the same as it does for any other property, custom or not.

## Writing (setting) a custom property

```js
document.documentElement.style.setProperty('--brand-color', '#22c55e');
// every element that reads var(--brand-color), anywhere in the document
// (unless overridden further down the tree), updates immediately
```

```js
// Setting a custom property on a specific element, not just :root — scoped to that
// element and its descendants, exactly like any inherited property override
const card = document.querySelector('.card');
card.style.setProperty('--card-accent', 'orange');
```

## Removing a custom property override

```js
document.documentElement.style.removeProperty('--brand-color');
// falls back to whatever value the cascade provides next (e.g. a value from a stylesheet rule)
```

## Practical pattern: a theme toggle

```js
function setTheme(theme) {
  document.documentElement.dataset.theme = theme; // 'light' | 'dark'
  localStorage.setItem('theme', theme);
}
```

```css
:root {
  --bg: white;
  --text: black;
}
[data-theme='dark'] {
  --bg: #111;
  --text: #eee;
}
body {
  background: var(--bg);
  color: var(--text);
}
```

Note this common pattern doesn't even need `setProperty()` directly — toggling a `data-theme` attribute (via `dataset.theme`) and letting CSS attribute-selector rules redefine the custom properties is often simpler and keeps all the actual color values in CSS rather than JS. `setProperty()` becomes essential specifically when the value is genuinely computed at runtime and has no sensible fixed CSS representation ahead of time — e.g. a color picker UI, a value derived from a measured DOM element, or a live drag-interaction offset.

## Practical pattern: passing a measured value into CSS

```js
function updateProgressRing(percent) {
  document.querySelector('.progress-ring').style.setProperty('--progress', percent);
}
```

```css
.progress-ring {
  --progress: 0; /* default */
  background: conic-gradient(
    var(--ring-color) calc(var(--progress) * 1%),
    var(--ring-track-color) 0
  );
}
```

This avoids needing JS to construct and assign the entire `background` string itself — JS only ever touches the one number that actually changes, and the CSS owns the rest of the visual definition, which keeps the separation of concerns clean (JS provides data, CSS provides presentation) even for values that must originate at runtime.

## Performance note

Setting a custom property that many descendants read via `var()` can trigger recalculation of style (and potentially layout/paint) for all of those descendants — for a value that changes on every animation frame (like a drag position), consider whether the affected property is one that only needs a compositor-friendly update (`transform`/`opacity`, covered in the animations-transitions topic) rather than something that would force layout on every frame across a large subtree.
