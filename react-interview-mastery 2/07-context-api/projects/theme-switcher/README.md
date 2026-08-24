# theme-switcher

A small, genuinely runnable React 18 project demonstrating the Context API pattern covered in this topic: `createContext` + a `useTheme()` custom hook wrapping `useContext` (with a thrown error if used outside its provider), consumed by two sibling components (`ThemedButton`, `ThemedCard`) that toggle and reflect a light/dark theme without any prop drilling.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. Click "Switch to dark mode" to toggle the theme — both the button's label and the card's "Current theme" line update together, driven entirely by context, with no props passed between them.

## Structure

```
theme-switcher/
  index.html
  package.json
  vite.config.js
  src/
    main.jsx           — React root, mounts <App />
    App.jsx             — wires up <ThemeProvider> and renders the two consumers
    ThemeContext.jsx     — createContext, ThemeProvider, useTheme() hook
    ThemedButton.jsx      — consumes useTheme(), toggles the theme
    ThemedCard.jsx         — consumes useTheme(), displays the current theme
    styles.css              — light/dark styling driven by `<html data-theme>`
```

## What to look at

- `src/ThemeContext.jsx` — the `useTheme()` hook throws a descriptive error (`"useTheme must be used within a <ThemeProvider>"`) if called by a component not wrapped in `<ThemeProvider>`; try removing `<ThemeProvider>` from `App.jsx` to see it fire.
- The context `value` is wrapped in `useMemo`, keyed on `theme`, so `ThemeProvider` re-rendering for unrelated reasons doesn't force `ThemedButton`/`ThemedCard` to re-render with a "new" but equivalent value — see `../../theory/02-rerender-cost.md` for why that matters.
- `ThemedButton` and `ThemedCard` are siblings under `<ThemeProvider>`, not parent/child — this is the point of Context: neither one needs to know the other exists, and `App` itself never touches `theme` directly.
