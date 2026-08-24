# Snippet: Reading and Setting Custom Properties in JavaScript

```css
:root {
  --accent-hue: 210;
}
.swatch {
  background: hsl(var(--accent-hue) 80% 55%);
  width: 80px;
  height: 80px;
  border-radius: 8px;
}
```

```html
<div class="swatch"></div>
<input type="range" id="hue-slider" min="0" max="360" value="210" />
```

```js
const slider = document.getElementById('hue-slider');
const root = document.documentElement;

// Read the current value on load, in case CSS set something the slider should reflect
const currentHue = getComputedStyle(root).getPropertyValue('--accent-hue').trim();
slider.value = currentHue;

// Write the new value live as the user drags the slider
slider.addEventListener('input', (e) => {
  root.style.setProperty('--accent-hue', e.target.value);
  // .swatch's background recomputes immediately — no re-render logic needed on the JS side
});
```

The `.swatch`'s color updates on every slider `input` event purely because the browser recomputes `hsl(var(--accent-hue) ...)` whenever `--accent-hue` changes — JS never touches `background` directly, it only ever writes the one custom property, and CSS owns the actual visual formula.
