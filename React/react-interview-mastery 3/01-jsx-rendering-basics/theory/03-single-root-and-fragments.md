***  03-single-root-and-fragments.md ***

# Single Root Element and Fragments

Every JSX expression must resolve to a single element, because `createElement`/`jsx` returns one object, not an array. This fails:

```jsx
// Error: Adjacent JSX elements must be wrapped in an enclosing tag
return (
  <h1>Title</h1>
  <p>Body</p>
);
```

Wrap with a real DOM element or a `Fragment` (`<>...</>`) when you don't want an extra DOM wrapper:

```jsx
return (
  <>
    <h1>Title</h1>
    <p>Body</p>
  </>
);
```

## `<>...</>` vs. a wrapping `<div>`

| Aspect | `<>...</>` / `Fragment` | `<div>...</div>` |
|---|---|---|
| DOM output | No extra node added | Adds a real DOM element |
| Styling impact | None — can't be targeted by CSS/flex/grid | Can affect layout (flex/grid children, CSS selectors) |
| Keys | Needs `React.Fragment key={...}` explicit form when in a list | `key` works directly on the div |

Use Fragments when you only need to satisfy "single root" and don't want layout side effects; use a `div` when you actually need a styling/layout hook. The common mistake is wrapping list items in `<>` without realizing you can't attach a `key` to the shorthand syntax — you must use `<React.Fragment key={...}>`:

```jsx
function List({ names }) {
  return (
    <ul>
      {names.map(name => (
        <React.Fragment key={name}>
          <li>{name}</li>
          <li className="sep">—</li>
        </React.Fragment>
      ))}
    </ul>
  );
}
// Only fragments with a `key` prop can be written as <React.Fragment key={...}>;
// the shorthand <> syntax doesn't accept props/keys at all.
```
