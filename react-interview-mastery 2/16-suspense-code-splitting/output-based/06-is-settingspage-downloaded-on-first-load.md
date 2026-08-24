# Is `SettingsPage` Code Downloaded When the App First Loads?

```jsx
const SettingsPage = React.lazy(() => import("./SettingsPage"));

function App() {
  const [route, setRoute] = useState("home");
  return (
    <Suspense fallback={<p>Loading...</p>}>
      {route === "home" && <Home />}
      {route === "settings" && <SettingsPage />}
    </Suspense>
  );
}
```

**Answer:** No — the `SettingsPage` chunk is only fetched once `route` becomes `"settings"` and `<SettingsPage />` actually renders for the first time.

**Why:** `React.lazy`'s dynamic `import()` only executes when the lazy component is rendered, not when it's merely referenced/defined at module scope. The bundler still creates a separate chunk file for it at build time, but the browser doesn't request it until render actually needs it.
