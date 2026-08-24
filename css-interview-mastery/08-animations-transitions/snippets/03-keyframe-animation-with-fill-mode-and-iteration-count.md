# Snippet: `@keyframes` with `fill-mode` and `iteration-count`

```html
<div class="skeleton-loader"></div>
```

```css
@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: 200px 0;
  }
}

.skeleton-loader {
  width: 100%;
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 400px 100%;
  animation: shimmer 1.2s linear infinite; /* loops forever, constant speed */
}
```

```css
@keyframes pop-in {
  from { transform: scale(0.8); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

.badge {
  animation: pop-in 0.25s ease-out forwards; /* runs once, RETAINS end state (scale(1), opacity: 1) */
}
```

`.skeleton-loader` uses `infinite` for a continuous loading shimmer with no defined end state (it never needs `fill-mode`, since it never stops). `.badge` uses `forwards` specifically because without it, the element would snap back to its pre-animation styles (`transform`/`opacity` as defined by the base rule, or the browser's initial values if unset) the instant the single iteration completes — `forwards` is what makes the "pop in and stay visible" effect actually stick.
