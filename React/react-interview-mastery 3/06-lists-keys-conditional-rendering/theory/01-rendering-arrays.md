*** copy 01-rendering-arrays.md ***

# Rendering arrays

React doesn't have a special "list" construct — you just build an array of JSX elements, usually with `.map()`, and put it wherever you'd put any other expression:

```jsx
function ItemList({ items }) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  );
}
```

`.map()` returns a real JS array, and React knows how to render arrays of elements. Each element in that array needs a `key` prop so React can identify it across re-renders.

## `.map()` without a `return` is a common bug

```jsx
// Buggy: block-body arrow with no explicit return -> every call yields undefined
items.map((item) => {
  doStuff(item);
});
```

This is a frequent copy-paste bug when converting an implicit-return arrow (`item => <li>...</li>`) into a multi-line one and forgetting to add `return`.
