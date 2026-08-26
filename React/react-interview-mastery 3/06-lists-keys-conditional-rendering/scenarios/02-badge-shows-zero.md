*** copy 02-badge-shows-zero.md ***

# Scenario: Product list badge shows "0" for out-of-stock items

You're building a product grid where each card shows a "X in cart" badge only if the user has added at least one unit. Support tickets say some products show a badge reading literally "0" even for items never added to the cart.

**Approach:** Find the render logic — it's almost certainly:

```jsx
{cartQuantity && <span className="badge">{cartQuantity} in cart</span>}
```

`cartQuantity` defaults to `0` for un-added items, and `0 && <span>` evaluates to `0`, which React renders as text. Fix by making the condition explicitly boolean:

```jsx
{cartQuantity > 0 && (
  <span className="badge">{cartQuantity} in cart</span>
)}
```

Add a quick regression test asserting the badge is absent (not present with text "0") when `cartQuantity` is `0`, since this bug is easy to reintroduce.
