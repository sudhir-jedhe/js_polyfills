# Snippet: Independent Timing per Transitioned Property

```html
<div class="card">Card content</div>
```

```css
.card {
  opacity: 1;
  transform: scale(1);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.1);

  transition:
    transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),  /* a springy overshoot curve, slower */
    box-shadow 0.15s ease-out,                          /* quicker, simple ease */
    opacity 0.2s linear;                                 /* constant fade rate */
}

.card.is-dismissing {
  opacity: 0;
  transform: scale(0.9);
  box-shadow: none;
}
```

Each property in the comma-separated `transition` list gets its own independent duration and timing function — `transform` uses a slower, bouncy curve for a springy pop effect, while `opacity` fades at a flat, linear rate over a shorter duration, and both changes are triggered by the exact same class toggle (`is-dismissing`) but visually unfold on their own separate timelines.
