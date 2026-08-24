# Snippet: `:focus-visible` vs `:focus` on a Button

```html
<button class="btn">Click or Tab to me</button>
```

```css
.btn {
  padding: 0.6em 1.2em;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
}

/* Fires for BOTH mouse click and keyboard focus */
.btn:focus {
  outline: 3px solid orange; /* visible even on mouse click — often considered visually noisy */
}

/* Fires only when the browser judges focus should be visibly indicated (typically keyboard/AT) */
.btn:focus-visible {
  outline: 3px solid #2563eb;
}

/* Common real pattern: suppress the plain :focus ring, rely on :focus-visible only */
.btn:focus {
  outline: none;
}
.btn:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
```

Click the button with a mouse: no ring appears. Press Tab to focus it: a clear blue ring appears. This preserves keyboard accessibility while avoiding the "ring flash on every click" complaint that led many teams to previously (and wrongly) disable focus outlines entirely.
