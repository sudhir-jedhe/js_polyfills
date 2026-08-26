# React.lazy

`React.lazy` takes a function that returns a dynamic `import()` and returns a component that resolves lazily:

```jsx
const SettingsPanel = React.lazy(() => import("./SettingsPanel"));
```

The import itself is what triggers the bundler (webpack/Vite/Rollup) to split `SettingsPanel` into its own chunk file, downloaded only when this line actually executes (i.e., when the lazy component is rendered for the first time — not merely when it's referenced at module scope).

## Default exports only

`React.lazy` only works with default exports — if your module uses named exports, you need a small wrapper:

```jsx
const Chart = React.lazy(() =>
  import("./Chart").then((module) => ({ default: module.Chart }))
);
```

This works because `React.lazy` expects the resolved module object to have a `default` property containing the component; the `.then()` callback remaps a named export onto that shape.

## What happens under the hood, conceptually

The first time a lazy component is rendered, the dynamic import hasn't resolved yet, so React "suspends" — internally the component throws the pending promise. The nearest `Suspense` boundary catches that thrown promise and shows its fallback until the promise resolves, then re-renders the subtree with the real, now-loaded component. Once resolved, the module is cached, so re-rendering the same lazy component again (e.g., after unmount/remount) does not trigger another network request.
