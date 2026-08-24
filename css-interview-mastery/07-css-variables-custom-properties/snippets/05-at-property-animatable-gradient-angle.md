# Snippet: `@property` Makes a Gradient Angle Animatable

```css
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.spinner-border {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: conic-gradient(from var(--angle), transparent, #3b82f6);
  animation: rotate 1.2s linear infinite;
}

@keyframes rotate {
  to {
    --angle: 360deg; /* animates smoothly because --angle is a REGISTERED, typed custom property */
  }
}
```

```html
<div class="spinner-border"></div>
```

Without the `@property` registration above, animating `--angle` in the `@keyframes` block would not work — the browser would treat `--angle` as an opaque, untyped token stream with no defined way to interpolate between `0deg` and `360deg`, so the gradient would just jump discontinuously rather than sweep smoothly through every intermediate angle.
