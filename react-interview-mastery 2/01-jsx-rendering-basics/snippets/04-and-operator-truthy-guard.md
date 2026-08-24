# `&&` Trap: Guard With a Boolean, Not a Raw Number

```jsx
function Cart({ items }) {
  return (
    <div>
      {items.length > 0 && <p>{items.length} item(s) in cart</p>}
    </div>
  );
}
```

Using `items.length && ...` instead of `items.length > 0 && ...` would render a stray `0` when the cart is empty.
