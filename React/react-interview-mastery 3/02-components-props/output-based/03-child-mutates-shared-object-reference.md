*** copy 03-child-mutates-shared-object-reference.md ***

# What Does the Console Show?

```jsx
function Child({ user }) {
  user.name = 'Changed'; // eslint would flag this
  return <p>{user.name}</p>;
}

function Parent() {
  const user = { name: 'Original' };
  return (
    <div>
      <Child user={user} />
      <p>Parent still sees: {user.name}</p>
    </div>
  );
}
```

**Answer:** The page shows "Changed" from `Child` and "Parent still sees: Changed" from `Parent`.

**Why:** Objects are passed by reference. `Child` mutating `user.name` directly modifies the same object `Parent` holds, so both components see the mutated value — even though `Parent` never called a setter and has no idea its data changed. This illustrates why "props are read-only" is a discipline convention, not something React enforces at runtime; violating it causes action-at-a-distance bugs, especially once `user` is actual `useState` state (mutating it wouldn't even trigger a re-render, unlike this plain-object example).
