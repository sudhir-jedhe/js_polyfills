# Scenario: Add Dark Mode Without a Page Reload, and Respect the User's OS Preference

**Scenario:** A product wants a dark mode toggle in its settings menu, but also wants the site to default to whatever the user's OS-level color scheme preference is on first visit, and to remember an explicit manual override if the user picks one, persisting across visits — all without a page reload when toggling. How do you architect this with custom properties?

**Approach:**

Layer three sources of truth, from lowest to highest priority, using the cascade itself to do most of the work:

```css
/* 1. Light mode values as the baseline default */
:root {
  --bg: #ffffff;
  --text: #1a1a1a;
  --border: #e5e5e5;
}

/* 2. Respect the OS preference automatically, if the user hasn't made an explicit choice */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --bg: #0f0f0f;
    --text: #f5f5f5;
    --border: #2a2a2a;
  }
}

/* 3. Explicit user override always wins, regardless of OS preference, once set */
:root[data-theme='dark'] {
  --bg: #0f0f0f;
  --text: #f5f5f5;
  --border: #2a2a2a;
}
:root[data-theme='light'] {
  --bg: #ffffff;
  --text: #1a1a1a;
  --border: #e5e5e5;
}

body {
  background: var(--bg);
  color: var(--text);
}
```

```js
function applyTheme(theme) {
  // theme: 'light' | 'dark' | null (null = defer to OS preference)
  if (theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  }
}

// On load: restore an explicit saved choice, otherwise leave data-theme unset
// so the prefers-color-scheme media query above takes over automatically.
applyTheme(localStorage.getItem('theme'));

document.getElementById('theme-toggle').addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const isDark = current
    ? current === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(isDark ? 'light' : 'dark');
});
```

**Why this layering works cleanly:** the `:root:not([data-theme])` selector in the `prefers-color-scheme` media query is the key trick — it only applies the OS-driven dark values when the user *hasn't* set an explicit `data-theme` attribute, so an explicit user choice always takes precedence via ordinary specificity/source-order rules once `data-theme` is present, without needing any `!important` or JS-computed CSS. Because everything downstream reads the same handful of custom properties via `var()`, toggling is instant — no reload, no re-render logic beyond the browser's normal style recalculation — and because the OS-preference case is handled entirely in CSS (not duplicated in JS), the two sources of truth can't drift out of sync with each other.
