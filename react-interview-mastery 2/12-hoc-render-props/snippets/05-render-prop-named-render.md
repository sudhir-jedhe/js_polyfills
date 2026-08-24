# Snippet: Render Prop Using a `render` Prop Name Instead of `children`

```jsx
function Toggle({ render }) {
  const [on, setOn] = useState(false);
  return render({ on, toggle: () => setOn(o => !o) });
}
// usage:
// <Toggle render={({ on, toggle }) => (
//   <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>
// )} />
```
