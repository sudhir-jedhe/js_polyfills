# Interview Q&A: Fundamentals

**Q: What problem does code splitting solve?**
Without it, the entire app ships as one JavaScript bundle, forcing every user to download code for features/routes they may never use, which slows down initial load. Code splitting breaks the app into smaller chunks that load on demand — typically per-route — so the initial payload only contains what's needed to render the first screen, improving metrics like Time to Interactive.

**Q: How does `React.lazy` work under the hood, at a conceptual level?**
`React.lazy(() => import('./X'))` wraps a dynamic `import()`, which the bundler turns into a separate chunk fetched over the network at runtime. The first time the lazy component is rendered, the import hasn't resolved yet, so React "suspends" — internally the component throws the pending promise — and the nearest `Suspense` boundary catches it and shows its fallback until the promise resolves, then re-renders with the real component.

**Q: Why does `React.lazy` require a default export?**
`React.lazy` expects the resolved module to have a `default` property containing the component, matching how `import()` resolves ES modules with a default export. If your component is a named export, you need a `.then()` wrapper that remaps it: `import('./X').then(m => ({ default: m.X }))`.

**Q: What is the `fallback` prop for, and what can it contain?**
It's the UI `Suspense` renders while any descendant within its boundary is suspended (not ready). It can be any valid JSX — a spinner, a skeleton screen, `null`, or nothing meaningful — React doesn't impose special constraints on it beyond it being a valid element.

**Q: What happens if you forget the `Suspense` boundary around a lazy component entirely?**
React throws an error at render time telling you a suspended component was rendered outside of a `Suspense` boundary — there's no silent fallback behavior; a boundary is required somewhere in the ancestor chain for `React.lazy` to work.
