***  04-count-and-badge-bug-and-fix.md ***

# Snippet: The `count && <Badge/>` bug and its fix

```jsx
function CartBadge({ itemCount }) {
  return (
    <div>
      {/* Buggy: renders "0" when itemCount is 0 */}
      {itemCount && <span className="badge">{itemCount}</span>}
      {/* Fixed: coerce to boolean first */}
      {itemCount > 0 && <span className="badge">{itemCount}</span>}
    </div>
  );
}
```
