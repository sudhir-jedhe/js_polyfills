*** copy 06-null-access-throws-during-render.md ***

# What Does This Render for `user = null`?

```jsx
function Greeting({ user }) {
  return <div>Hello, {user.name}!</div>;
}
```

**Answer:** It throws at render time: `Cannot read properties of null (reading 'name')`, which crashes the component (and, without an error boundary, the whole tree below the boundary).

**Why:** JSX expressions inside `{}` are evaluated eagerly during render. There's no built-in optional chaining safety net — `user.name` is accessed directly, so a `null` user throws a TypeError before React ever gets to build the element tree for this component.
