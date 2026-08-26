# How Many Network Requests for the Chunk Happen Here?

```jsx
const Modal = React.lazy(() => import("./Modal"));

function App() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <button onClick={() => setOpen(false)}>Close</button>
      {open && (
        <Suspense fallback={<p>Loading...</p>}>
          <Modal />
        </Suspense>
      )}
    </>
  );
}
// User opens, closes, and reopens the modal.
```

**Answer:** One network request total, on the first open.

**Why:** Dynamic `import()` is cached by the module system after the first successful resolution — calling it again (e.g., unmounting and remounting `Modal`) reuses the already-resolved module rather than re-fetching the chunk over the network.
