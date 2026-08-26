*** copy 05-ref-on-plain-function-component-warns.md ***

# Output-Based: What happens when a `ref` is passed to a plain function component?

```jsx
function ParentA() {
  const ref = useRef(null);
  return <MyComponent ref={ref} />;
}

function MyComponent(props) {
  return <div>Hi</div>;
}
```

What warning (if any) appears in the console, and what is `ref.current` after mount?

**Answer:** React warns that function components cannot be given refs, and `ref.current` stays `null`.

**Why:** `MyComponent` is a plain function component, not wrapped in `forwardRef`. React special-cases the `ref` prop — it's never passed through to `props`, and without `forwardRef` there's no mechanism for the component to attach it to anything internally. React logs a warning suggesting `forwardRef` if you're trying to pass a ref to a function component.
