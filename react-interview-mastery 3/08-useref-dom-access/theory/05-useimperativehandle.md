# useImperativeHandle

Sometimes you don't want to expose the raw DOM node through a forwarded ref — you want to expose a curated, limited API instead. `useImperativeHandle` customizes what `ref.current` looks like from the parent's perspective:

```jsx
const FancyInput = forwardRef(function FancyInput(props, ref) {
  const inputRef = useRef(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => { inputRef.current.value = ''; },
  }));
  return <input ref={inputRef} {...props} />;
});
// parent gets { focus, clear } instead of the raw <input> node
```

Use this sparingly — it's an escape hatch for imperative APIs (focus, scroll, play/pause) that don't map cleanly to props, not a general pattern for parent-child communication (which should normally flow through props/state).

## forwardRef alone vs forwardRef + useImperativeHandle

| Aspect | `forwardRef` alone | `forwardRef` + `useImperativeHandle` |
|---|---|---|
| What the parent's `ref.current` becomes | The actual underlying DOM node | Whatever object the handle factory returns |
| Encapsulation | Parent can call any DOM method/property — no restriction | Component controls exactly what's exposed (e.g., only `focus`/`clear`) |
| Best for | Simple cases — just need to focus/measure/scroll a real element | Component wants to hide internal DOM structure and expose a curated imperative API |

Use plain `forwardRef` when exposing the raw node is fine and there's no encapsulation concern. Use `useImperativeHandle` when the component wraps multiple internal DOM nodes and you want to expose only specific behavior, not the whole implementation detail. The most common mistake is overusing `useImperativeHandle` for things that should just be props (e.g., exposing a `setValue` method instead of making the component a normal controlled component).
