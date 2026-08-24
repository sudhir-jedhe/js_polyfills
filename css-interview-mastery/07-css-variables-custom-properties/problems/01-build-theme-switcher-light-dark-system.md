# Problem: Build a Complete Light/Dark/System Theme Switcher

## Problem Statement

Build a three-state theme switcher (Light / Dark / System) for a settings panel. "System" means the site follows the OS-level `prefers-color-scheme` preference and updates live if the OS preference changes while the page is open (not just on load); "Light"/"Dark" are explicit, persisted overrides that ignore the OS preference entirely.

## Requirements

- Three radio buttons or a segmented control: Light, Dark, System.
- Explicit choice persists across page reloads (e.g. via `localStorage`).
- "System" mode must react live if the user changes their OS dark-mode setting while the tab is open, without a page reload.
- No flash of the wrong theme on initial page load.
- All themed values (background, text, border, accent) driven by custom properties, referenced consistently across the whole page's CSS.

## Approach

Use the same layered custom-property architecture as the dark-mode scenario (OS-preference media query + explicit `data-theme` override), but additionally listen for `prefers-color-scheme` *changes* via `matchMedia`'s change event when in System mode, and guard against a flash-of-wrong-theme by applying the saved preference in a blocking, inline `<script>` in the document `<head>`, before first paint.

## Solution

```html
<head>
  <script>
    // Inline, blocking, runs before first paint — prevents a flash of the wrong theme.
    (function () {
      const saved = localStorage.getItem('theme-preference'); // 'light' | 'dark' | null (null = system)
      if (saved) document.documentElement.setAttribute('data-theme', saved);
    })();
  </script>
  <style>
    :root {
      --bg: #ffffff;
      --text: #111111;
    }
    @media (prefers-color-scheme: dark) {
      :root:not([data-theme]) {
        --bg: #0f0f0f;
        --text: #f5f5f5;
      }
    }
    :root[data-theme='dark'] { --bg: #0f0f0f; --text: #f5f5f5; }
    :root[data-theme='light'] { --bg: #ffffff; --text: #111111; }
    body { background: var(--bg); color: var(--text); }
  </style>
</head>
<body>
  <fieldset id="theme-picker">
    <legend>Theme</legend>
    <label><input type="radio" name="theme" value="light" /> Light</label>
    <label><input type="radio" name="theme" value="dark" /> Dark</label>
    <label><input type="radio" name="theme" value="system" /> System</label>
  </fieldset>
</body>
```

```js
const STORAGE_KEY = 'theme-preference';
const picker = document.getElementById('theme-picker');
const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

function applyPreference(pref) {
  // pref: 'light' | 'dark' | 'system'
  if (pref === 'system') {
    document.documentElement.removeAttribute('data-theme');
    localStorage.removeItem(STORAGE_KEY);
  } else {
    document.documentElement.setAttribute('data-theme', pref);
    localStorage.setItem(STORAGE_KEY, pref);
  }
}

// Initialize the radio buttons to reflect the current saved (or system) state
const saved = localStorage.getItem(STORAGE_KEY);
picker.querySelector(`input[value="${saved || 'system'}"]`).checked = true;

picker.addEventListener('change', (e) => applyPreference(e.target.value));

// Live-react to OS preference changes ONLY while in "system" mode — if the user has
// an explicit override (data-theme present), this listener's effect is irrelevant
// anyway, since the CSS's :root:not([data-theme]) guard means the media query rule
// simply doesn't apply when an explicit choice is set.
systemQuery.addEventListener('change', () => {
  // no direct action needed — the :root:not([data-theme]) media query in CSS
  // re-evaluates automatically on its own whenever prefers-color-scheme changes,
  // since it's a live CSS media query, not something JS needs to re-apply manually
});
```

**Why the inline `<head>` script prevents a flash-of-wrong-theme:** if theme restoration only happened in a deferred/`DOMContentLoaded` script, the browser would paint the page once with the default (light) theme first, then repaint with the correct saved theme a moment later — visible as a brief flash. Running a small, synchronous, blocking script in `<head>`, before the `<body>` and its stylesheet-driven paint occur, ensures `data-theme` is already set on `<html>` by the time the page actually renders anything.

**Why the `systemQuery.addEventListener('change', ...)` handler body is empty here:** the live-update behavior for System mode doesn't actually require JS to do anything — it's already handled entirely by the CSS `@media (prefers-color-scheme: dark)` rule re-evaluating on its own whenever the OS preference changes, which is a native browser behavior for any active media query, not something that needs JS to trigger a re-render. The listener is included mainly to make the intent explicit and as a hook point if additional JS-side reactions (e.g. updating a non-CSS-driven canvas chart's colors) were ever needed alongside the theme change.
