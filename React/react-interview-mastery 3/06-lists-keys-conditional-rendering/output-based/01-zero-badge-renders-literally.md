***  01-zero-badge-renders-literally.md ***

# Output-Based: `count && <Component/>` with `count={0}`

```jsx
function Notifications({ count }) {
  return <div>{count && <span>You have {count} alerts</span>}</div>;
}

// rendered with <Notifications count={0} />
```

**Answer:** The page renders the text `0` inside the `<div>`, not nothing.

**Why:** `count && <span>...</span>` short-circuits at `count` because `0` is falsy, so the expression evaluates to `0` (not `false`). JSX renders numbers as text nodes, so `0` shows up literally on the screen. Only `false`, `null`, and `undefined` render as nothing.
