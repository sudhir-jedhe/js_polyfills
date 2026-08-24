# Snippet: Basic Hover Transition

```html
<button class="btn">Hover me</button>
```

```css
.btn {
  background: #3b82f6;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  transform: translateY(0);
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.btn:hover {
  transform: translateY(-2px);
  background: #2563eb;
  box-shadow: 0 4px 8px rgb(0 0 0 / 0.15);
}
```

Three properties transition together, each with its own listed timing — the `transition` shorthand accepts a comma-separated list, and every property changing on `:hover` animates smoothly instead of snapping instantly, using the same 0.15s ease timing for all three here (though each could have its own distinct duration/timing-function if desired).
