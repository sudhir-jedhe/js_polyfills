*** copy 04-forwardref.md ***

# forwardRef

By default, function components don't accept `ref` as a regular prop — React reserves it as a special attribute for attaching to DOM nodes or class instances. If you write a custom component and someone tries `<MyInput ref={someRef} />`, `ref` is stripped out and never reaches your component's props; `someRef.current` stays `null`, and React logs a warning suggesting `forwardRef`.

`forwardRef` fixes this by explicitly opting a component in to receiving a ref, which it can then attach to one of its own internal DOM nodes:

```jsx
const FancyInput = forwardRef(function FancyInput(props, ref) {
  return <input ref={ref} className="fancy" {...props} />;
});

function Form() {
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current.focus(); }, []);
  return <FancyInput ref={inputRef} />;
}
```

You need it any time a reusable custom component should let its parent get a ref to something inside it — for example, a design-system `<TextField>` that a form wants to call `.focus()` on.
