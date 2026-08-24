# Interview Q&A: forwardRef & useImperativeHandle

**Q: Why can't you pass a `ref` prop directly to a custom function component the way you would to `<input ref={...}>`?**

React treats `ref` as a reserved, special prop for attaching to underlying DOM nodes or class component instances — it's stripped out before `props` reaches your function component, so `props.ref` is always `undefined` inside a plain function component. There's no default mechanism for a function component to say "attach this ref to one of my internal elements" without opting in explicitly.

**Q: What does `forwardRef` do, and when do you need it?**

`forwardRef` wraps a component and gives it access to the `ref` a parent attached, as a second argument to the render function (`(props, ref) => ...`), which the component can then attach to one of its own internal DOM nodes or forward further down. You need it any time a reusable custom component should let its parent get a ref to something inside it.

```jsx
const TextField = forwardRef(function TextField(props, ref) {
  return <input ref={ref} {...props} />;
});
```

**Q: What is `useImperativeHandle` for, and how does it differ from just forwarding the ref directly?**

It customizes what value is exposed on `ref.current` for a `forwardRef` component — instead of exposing the raw DOM node, you supply a factory function returning whatever object (methods, curated data) you want the parent to see. It's used when you want to hide internal implementation details and expose a limited, intentional imperative API instead of the actual DOM structure.

```jsx
useImperativeHandle(ref, () => ({
  focus: () => inputRef.current.focus(),
}));
```

## Comparison table

| Aspect | `forwardRef` alone | `forwardRef` + `useImperativeHandle` |
|---|---|---|
| What the parent's `ref.current` becomes | The actual underlying DOM node | Whatever object the handle factory returns |
| Encapsulation | Parent can call any DOM method/property — no restriction | Component controls exactly what's exposed |
| Best for | Simple cases — just need to focus/measure/scroll a real element | Component wants to hide internal DOM structure and expose a curated imperative API |

The most common mistake is overusing `useImperativeHandle` for things that should just be props (e.g., exposing a `setValue` method instead of making the component a normal controlled component).
