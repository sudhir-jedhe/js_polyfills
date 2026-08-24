# Hooks Playground

A small, real, runnable demo app composing three custom hooks from this topic into one page:

- **`useToggle`** — drives a modal's open/closed state.
- **`useLocalStorage`** — drives a counter whose value survives a page reload.
- **`useDebounce`** — drives a search box that only "searches" 300ms after you stop typing.

The hooks themselves live in `src/hooks.js`; `src/App.jsx` composes them into three self-contained demo sections.

## Running it

```bash
npm install
npm run dev
```

Then open the printed local URL (Vite defaults to `http://localhost:5173`).

## What to try

- **Modal:** click "Open modal", then click outside it or "Dismiss" to close — both call the same `toggle`/`close` functions from `useToggle`.
- **Persisted counter:** increment it, then reload the page — the count is still there, because `useLocalStorage` writes to `localStorage` on every change and reads it back on mount.
- **Search box:** type quickly and watch the "Searches fired" counter — it only increments once you pause typing for 300ms, not on every keystroke, demonstrating `useDebounce` collapsing rapid updates into a single delayed one.

## Files

```
hooks-playground/
  package.json
  vite.config.js
  index.html
  src/
    main.jsx       — React root
    App.jsx         — composes the three demos
    hooks.js        — useToggle, useLocalStorage, useDebounce
    style.css
```
