# Scenario: "Apply Coupon" Freezes for ~300ms Only When the Cart Has 50+ Items

Users report that a checkout form's "Apply Coupon" button becomes unresponsive-feeling — clicking it causes a visible ~300ms freeze — only when the cart has 50+ line items. How do you diagnose and fix this?

**Approach:** Record the click in the React DevTools Profiler to see which components render during that commit and how long each takes. Likely finding: the coupon click updates a single piece of state (e.g., `discount`) at the top of the page, and because the 50+ cart line items aren't memoized, all of them re-render and recompute derived values (formatting, tax calc) even though none of their props actually changed.

```jsx
// Before: every CartLine re-renders when discount changes, even though CartLine
// doesn't use discount at all.
function CartLine({ item }) {
  const formatted = formatCurrency(item.price * item.qty); // recomputed every time
  return <li>{item.name}: {formatted}</li>;
}

// After: memoize the row so it only re-renders when its own item changes.
const CartLine = React.memo(function CartLine({ item }) {
  const formatted = useMemo(() => formatCurrency(item.price * item.qty), [item]);
  return <li>{item.name}: {formatted}</li>;
});
```

Also move `discount`/coupon state so it doesn't live in a component that's an ancestor of the cart list unless necessary — e.g., keep the order summary (which needs `discount`) as a sibling, not a wrapper, of the cart list. Confirm the fix by re-profiling: the commit triggered by "Apply Coupon" should now only show the order summary re-rendering, not all 50 `CartLine`s.
