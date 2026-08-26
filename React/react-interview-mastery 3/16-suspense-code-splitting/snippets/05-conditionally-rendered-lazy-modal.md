# Conditionally Rendering a Lazy Modal (Loaded Only on Demand)

```jsx
const SettingsModal = React.lazy(() => import("./SettingsModal"));

function Toolbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Settings</button>
      {open && (
        <Suspense fallback={<p>Loading...</p>}>
          <SettingsModal onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
```
