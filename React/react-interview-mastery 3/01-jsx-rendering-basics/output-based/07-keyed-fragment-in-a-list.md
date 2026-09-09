***  07-keyed-fragment-in-a-list.md ***

# What's Rendered in the DOM After This List Renders?

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
```

**Answer:** A flat `<ul>` containing pairs of `<li>` elements (name, then separator) for each name, with no extra wrapper elements around each pair.

**Why:** `React.Fragment` (with an explicit `key`, required here since it's in a list) groups multiple children without adding a DOM node. Only fragments with a `key` prop can be written as `<React.Fragment key={...}>`; the shorthand `<>` syntax doesn't accept props/keys.
