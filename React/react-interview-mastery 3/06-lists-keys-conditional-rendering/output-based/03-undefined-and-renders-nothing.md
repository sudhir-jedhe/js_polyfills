***  03-undefined-and-renders-nothing.md ***

# Output-Based: `isAdmin && <AdminPanel/>` when `isAdmin` is `undefined`

```jsx
function Page({ isAdmin }) {
  return <div>{isAdmin && <AdminPanel />}</div>;
}
```

`isAdmin` is `undefined` on first render (data hasn't loaded yet). What renders?

**Answer:** Nothing visible — the `<div>` renders empty.

**Why:** `undefined && <AdminPanel />` evaluates to `undefined`, and React renders `undefined` (like `null`/`false`) as nothing. This is different from the `0` case because `undefined` is one of the "renders as nothing" values.
