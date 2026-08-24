# Snippet: Resolution-Switching Image with `srcset` + `sizes`

```html
<img
  src="landscape-800w.jpg"
  srcset="
    landscape-400w.jpg 400w,
    landscape-800w.jpg 800w,
    landscape-1200w.jpg 1200w,
    landscape-1600w.jpg 1600w
  "
  sizes="
    (min-width: 1024px) 33vw,
    (min-width: 640px) 50vw,
    100vw
  "
  alt="A wide landscape photo used inside a responsive card grid"
  loading="lazy"
/>
```

`sizes` describes the *rendered* CSS width, condition by condition, matching the same grid breakpoints as the layout it lives in (e.g. a 3-column grid at desktop width → ~33vw per image, 2-column at tablet → ~50vw, full-width single column on mobile → 100vw). The browser uses whichever `sizes` condition matches the current viewport, combines that rendered width with the device's actual pixel density, and downloads only the smallest `srcset` candidate that's still sharp enough — never the largest file by default, and never a file the developer manually "picked" per breakpoint.
