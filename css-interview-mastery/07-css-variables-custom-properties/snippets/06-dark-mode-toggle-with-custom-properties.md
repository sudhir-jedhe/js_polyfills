# Snippet: Dark Mode Toggle, Purely via a Data Attribute

```css
:root {
  --bg: #ffffff;
  --text: #111111;
  --border: #e5e5e5;
}

:root[data-theme='dark'] {
  --bg: #0f0f0f;
  --text: #f5f5f5;
  --border: #2a2a2a;
}

body {
  background: var(--bg);
  color: var(--text);
  transition: background 0.2s ease, color 0.2s ease;
}

.card {
  border: 1px solid var(--border);
}
```

```html
<button id="theme-toggle">Toggle theme</button>
```

```js
const toggleBtn = document.getElementById('theme-toggle');
const root = document.documentElement;

// Restore saved preference on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme) root.setAttribute('data-theme', savedTheme);

toggleBtn.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  if (next === 'dark') {
    root.setAttribute('data-theme', 'dark');
  } else {
    root.removeAttribute('data-theme'); // falls back to the :root default (light) values
  }
  localStorage.setItem('theme', next);
});
```

No `element.style.setProperty()` calls are needed here at all — JS only toggles a single attribute, and CSS's own cascade (via the `:root[data-theme='dark']` selector redeclaring the same custom properties with new values) does the rest, letting every themed value stay defined and readable in one place, in CSS.
