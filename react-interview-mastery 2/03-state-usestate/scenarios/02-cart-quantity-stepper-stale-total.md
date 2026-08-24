# Shopping Cart Quantity Stepper Occasionally Shows a Stale Total

**Scenario:** You're building a cart page where each line item has a `+`/`-` quantity stepper, and the "Total" line at the bottom sometimes lags by one step behind the actual quantities shown, especially when a user clicks quickly.

**Approach:** Check how quantities are stored and updated. If it's an array of `{ id, qty }` objects in state and the update handler mutates the array or a specific item in place before calling `setItems`, React may skip re-rendering (same reference) or a computed "Total" derived elsewhere may read stale data mid-update. Fix by always producing new array/object references on update:

```jsx
function CartItem({ item, onQtyChange }) {
  return (
    <div>
      <button onClick={() => onQtyChange(item.id, item.qty - 1)}>-</button>
      <span>{item.qty}</span>
      <button onClick={() => onQtyChange(item.id, item.qty + 1)}>+</button>
    </div>
  );
}

function Cart() {
  const [items, setItems] = React.useState([{ id: 1, qty: 2, price: 10 }]);

  function updateQty(id, qty) {
    setItems(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: Math.max(0, qty) } : item))
    );
  }

  const total = items.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <>
      {items.map(item => (
        <CartItem key={item.id} item={item} onQtyChange={updateQty} />
      ))}
      <p>Total: ${total}</p>
    </>
  );
}
```

Because `total` is derived directly from `items` on every render (not stored as separate state), and `items` is always replaced with a new array reference on update, the total can never desync from the actual quantities.
