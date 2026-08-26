*** copy 07-assigning-new-key-onto-props-object.md ***

# What's Wrong With This Component (and What Does It Do at Runtime)?

```jsx
function UserCard(props) {
  props.formatted = props.firstName + ' ' + props.lastName;
  return <p>{props.formatted}</p>;
}
```

**Answer:** It technically renders the correct full name and doesn't crash, but it's mutating the `props` object.

**Why:** Assigning a new key onto `props` directly mutates the object React passed in. It happens to "work" visually in this simple case because nothing else reads `props.formatted` before this render, but it violates the read-only-props contract: if `React.memo` or `PureComponent`-style shallow comparisons were involved anywhere, or if the same props object were reused/diffed elsewhere, this mutation could cause subtle bugs. The correct approach is a local variable: `const formatted = props.firstName + ' ' + props.lastName;`.
