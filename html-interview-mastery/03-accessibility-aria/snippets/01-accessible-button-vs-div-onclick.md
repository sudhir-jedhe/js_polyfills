# Snippet: Accessible Button vs. `<div onclick>`

```html
<!-- GOOD: native button — focusable, keyboard-operable, correct role, all for free -->
<button type="button" onclick="toggleMenu()">Menu</button>
```

```html
<!-- BAD: not focusable, not keyboard-operable, no role at all -->
<div class="menu-btn" onclick="toggleMenu()">Menu</div>
```

```html
<!-- If a native <button> is truly not usable (rare), the full manual re-implementation: -->
<div class="menu-btn" role="button" tabindex="0"
     onclick="toggleMenu()"
     onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleMenu(); }">
  Menu
</div>
```

The manual version still doesn't handle `disabled` state, doesn't participate correctly in `<form>` submission, and requires you to remember `event.preventDefault()` on Space (to stop the page from scrolling) — three extra failure points a real `<button>` avoids automatically.
